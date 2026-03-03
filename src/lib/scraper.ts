import * as cheerio from "cheerio";
import { getDb } from "./db";

export interface ScrapedProperty {
  externalId: string;
  url: string;
  title: string;
  location: string;
  area: string;
  city: string;
  unitNo: string;
  tower: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: string;
  listingType: string;
  price: number;
  currency: string;
  imageUrl: string;
}

interface ScrapeResult {
  total: number;
  new: number;
  updated: number;
  priceChanges: number;
  errors: string[];
}

const BASE_URL = "https://www.propertyfinder.ae";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Cache-Control": "no-cache",
};

export async function scrapeListings(
  listingType: "rent" | "sale" = "rent",
  area?: string,
  pages: number = 1
): Promise<ScrapeResult> {
  const result: ScrapeResult = {
    total: 0,
    new: 0,
    updated: 0,
    priceChanges: 0,
    errors: [],
  };

  for (let page = 1; page <= pages; page++) {
    try {
      const url = buildSearchUrl(listingType, area, page);
      const html = await fetchPage(url);
      const properties = parseSearchResults(html, listingType);

      for (const prop of properties) {
        try {
          const saveResult = saveProperty(prop);
          result.total++;
          if (saveResult === "new") result.new++;
          else if (saveResult === "updated") result.updated++;
          if (saveResult === "price_changed") result.priceChanges++;
        } catch (err) {
          result.errors.push(
            `Failed to save property ${prop.externalId}: ${err}`
          );
        }
      }

      // Be polite - wait between pages
      if (page < pages) {
        await new Promise((r) => setTimeout(r, 2000 + Math.random() * 1000));
      }
    } catch (err) {
      result.errors.push(`Failed to scrape page ${page}: ${err}`);
    }
  }

  return result;
}

function buildSearchUrl(
  listingType: "rent" | "sale",
  area?: string,
  page: number = 1
): string {
  const category = listingType === "sale" ? "1" : "2";
  let url = `${BASE_URL}/en/search?c=${category}&ob=mr&page=${page}`;
  if (area) {
    url += `&q=${encodeURIComponent(area)}`;
  }
  return url;
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`);
  }
  return response.text();
}

function parseSearchResults(
  html: string,
  listingType: string
): ScrapedProperty[] {
  const $ = cheerio.load(html);
  const properties: ScrapedProperty[] = [];

  // PropertyFinder uses various card selectors - try multiple patterns
  const cardSelectors = [
    '[data-testid="property-card"]',
    ".property-card",
    'article[class*="property"]',
    '[class*="listing-card"]',
    'a[href*="/property/"]',
  ];

  let matchedSelector = cardSelectors[0];
  for (const selector of cardSelectors) {
    if ($(selector).length > 0) {
      matchedSelector = selector;
      break;
    }
  }
  const cards = $(matchedSelector);

  cards.each((_, el) => {
    try {
      const card = $(el);

      // Extract property URL and ID
      const linkEl = card.is("a") ? card : card.find("a").first();
      const href = linkEl.attr("href") ?? "";
      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
      const externalId = extractPropertyId(href);

      // Extract price
      const priceText =
        card.find('[data-testid="property-card-price"]').text() ||
        card.find('[class*="price"]').first().text() ||
        "";
      const price = parsePrice(priceText);

      // Extract title
      const title =
        card.find('[data-testid="property-card-title"]').text().trim() ||
        card.find("h2, h3").first().text().trim() ||
        card.find('[class*="title"]').first().text().trim() ||
        "";

      // Extract location
      const location =
        card.find('[data-testid="property-card-location"]').text().trim() ||
        card.find('[class*="location"]').first().text().trim() ||
        "";

      // Extract bedrooms/bathrooms/area
      const specs = card.find('[class*="spec"], [class*="attribute"], [data-testid*="spec"]');
      let bedrooms = 0;
      let bathrooms = 0;
      let areaSqft = 0;

      specs.each((_, specEl) => {
        const text = $(specEl).text().trim().toLowerCase();
        if (text.includes("bed")) {
          bedrooms = parseInt(text) || 0;
        } else if (text.includes("bath")) {
          bathrooms = parseInt(text) || 0;
        } else if (text.includes("sqft") || text.includes("sq.ft")) {
          areaSqft = parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
        }
      });

      // Extract property type from title or tags
      const propertyType = detectPropertyType(title);

      // Extract image
      const imageUrl =
        card.find("img").first().attr("src") ??
        card.find("img").first().attr("data-src") ??
        "";

      // Derive area from location
      const areaName = extractArea(location);

      // Extract tower/building name from title
      // Typical format: "2 BR Apartment in Tower Name, Area"
      const tower = extractTower(title, location);

      // Extract unit number if present (e.g. "Unit 2305" or "Apt 1408")
      const unitNo = extractUnitNo(title, externalId);

      if (externalId && price > 0) {
        properties.push({
          externalId,
          url: fullUrl,
          title: title || `Property in ${areaName}`,
          location: location || areaName,
          area: areaName,
          city: "Dubai",
          unitNo,
          tower,
          bedrooms,
          bathrooms,
          areaSqft,
          propertyType,
          listingType,
          price,
          currency: "AED",
          imageUrl,
        });
      }
    } catch {
      // Skip malformed cards
    }
  });

  return properties;
}

function extractPropertyId(href: string): string {
  // Try to extract numeric ID from URL
  const match = href.match(/(\d{5,})/);
  if (match) return `pf-${match[1]}`;

  // Fall back to URL slug
  const slug = href.split("/").filter(Boolean).pop() ?? "";
  return `pf-${slug.replace(/\.html$/, "")}`;
}

function parsePrice(text: string): number {
  const cleaned = text.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function detectPropertyType(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("villa")) return "Villa";
  if (lower.includes("townhouse")) return "Townhouse";
  if (lower.includes("penthouse")) return "Penthouse";
  if (lower.includes("studio")) return "Studio";
  if (lower.includes("duplex")) return "Duplex";
  if (lower.includes("land") || lower.includes("plot")) return "Land";
  return "Apartment";
}

function extractArea(location: string): string {
  const parts = location.split(",").map((s) => s.trim());
  return parts[0] || "Unknown";
}

function extractTower(title: string, location: string): string {
  // Try to extract tower/building from title like "2 BR Apartment in Tower Name, Area"
  const inMatch = title.match(/\bin\s+(.+?)(?:,|$)/i);
  if (inMatch) {
    const afterIn = inMatch[1].trim();
    // If it contains a known area name, the tower is likely the part before the area
    const parts = afterIn.split(",").map((s) => s.trim());
    if (parts.length >= 2) return parts[0];
    // If it looks like a building name (has digits or known words), use it
    if (/tower|gate|residence|heights|point|house|bay|palm|plaza|square|village|garden|court|cluster/i.test(afterIn)) {
      return afterIn;
    }
  }
  // Try from location: "Tower Name, Area, City"
  const locParts = location.split(",").map((s) => s.trim());
  if (locParts.length >= 3) return locParts[0];
  return "";
}

function extractUnitNo(title: string, externalId: string): string {
  // Look for explicit unit numbers in title
  const unitMatch = title.match(/\b(?:unit|apt|flat|no\.?)\s*#?\s*(\w[\w-]*)/i);
  if (unitMatch) return unitMatch[1];
  // Derive from external ID as fallback
  const idNum = externalId.replace(/\D/g, "");
  if (idNum.length >= 3) return idNum.slice(-4);
  return "";
}

function saveProperty(
  prop: ScrapedProperty
): "new" | "updated" | "price_changed" | "unchanged" {
  const db = getDb();

  const existing = db
    .prepare("SELECT id, current_price FROM properties WHERE external_id = ?")
    .get(prop.externalId) as
    | { id: number; current_price: number }
    | undefined;

  if (!existing) {
    // New property
    const info = db
      .prepare(
        `INSERT INTO properties (external_id, url, title, location, area, city, unit_no, tower, bedrooms, bathrooms, area_sqft, property_type, listing_type, current_price, currency, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        prop.externalId,
        prop.url,
        prop.title,
        prop.location,
        prop.area,
        prop.city,
        prop.unitNo,
        prop.tower,
        prop.bedrooms,
        prop.bathrooms,
        prop.areaSqft,
        prop.propertyType,
        prop.listingType,
        prop.price,
        prop.currency,
        prop.imageUrl
      );

    db.prepare(
      "INSERT INTO price_snapshots (property_id, price) VALUES (?, ?)"
    ).run(info.lastInsertRowid, prop.price);

    return "new";
  }

  // Record snapshot
  db.prepare(
    "INSERT INTO price_snapshots (property_id, price) VALUES (?, ?)"
  ).run(existing.id, prop.price);

  // Check for price change
  if (existing.current_price !== prop.price) {
    const changeAmount = prop.price - existing.current_price;
    const changePct =
      Math.round((changeAmount / existing.current_price) * 10000) / 100;

    db.prepare(
      `INSERT INTO price_changes (property_id, old_price, new_price, change_amount, change_pct)
       VALUES (?, ?, ?, ?, ?)`
    ).run(
      existing.id,
      existing.current_price,
      prop.price,
      changeAmount,
      changePct
    );

    db.prepare(
      "UPDATE properties SET current_price = ?, last_updated_at = datetime('now') WHERE id = ?"
    ).run(prop.price, existing.id);

    return "price_changed";
  }

  // Update last seen
  db.prepare(
    "UPDATE properties SET last_updated_at = datetime('now') WHERE id = ?"
  ).run(existing.id);

  return "updated";
}
