import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "properties.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const fs = require("fs");
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema(db);
    seedIfEmpty(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT UNIQUE,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      area TEXT NOT NULL,
      city TEXT NOT NULL DEFAULT 'Dubai',
      bedrooms INTEGER,
      bathrooms INTEGER,
      area_sqft REAL,
      property_type TEXT NOT NULL,
      listing_type TEXT NOT NULL CHECK(listing_type IN ('rent', 'sale')),
      current_price REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'AED',
      unit_no TEXT,
      tower TEXT,
      image_url TEXT,
      first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS price_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      price REAL NOT NULL,
      scraped_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS price_changes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      old_price REAL NOT NULL,
      new_price REAL NOT NULL,
      change_amount REAL NOT NULL,
      change_pct REAL NOT NULL,
      detected_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
    CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
    CREATE INDEX IF NOT EXISTS idx_properties_listing ON properties(listing_type);
    CREATE INDEX IF NOT EXISTS idx_snapshots_property ON price_snapshots(property_id);
    CREATE INDEX IF NOT EXISTS idx_snapshots_date ON price_snapshots(scraped_at);
    CREATE INDEX IF NOT EXISTS idx_changes_property ON price_changes(property_id);
    CREATE INDEX IF NOT EXISTS idx_changes_date ON price_changes(detected_at);
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = db.prepare("SELECT COUNT(*) as cnt FROM properties").get() as {
    cnt: number;
  };
  if (count.cnt > 0) return;

  const areas = [
    "Dubai Marina",
    "Downtown Dubai",
    "Palm Jumeirah",
    "JBR",
    "Business Bay",
    "Arabian Ranches",
    "Dubai Hills Estate",
    "Jumeirah Village Circle",
    "Dubai Creek Harbour",
    "DIFC",
    "Jumeirah Lake Towers",
    "Al Barsha",
    "Motor City",
    "Dubai Silicon Oasis",
    "Town Square",
  ];

  const propertyTypes = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Penthouse",
    "Studio",
  ];

  const saleListings = generateListings(areas, propertyTypes, "sale", 80);
  const rentListings = generateListings(areas, propertyTypes, "rent", 60);

  const insertProperty = db.prepare(`
    INSERT INTO properties (external_id, url, title, location, area, city, bedrooms, bathrooms, area_sqft, property_type, listing_type, current_price, currency, unit_no, tower, first_seen_at, last_updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'AED', ?, ?, ?, datetime('now'))
  `);

  const insertSnapshot = db.prepare(`
    INSERT INTO price_snapshots (property_id, price, scraped_at)
    VALUES (?, ?, ?)
  `);

  const insertChange = db.prepare(`
    INSERT INTO price_changes (property_id, old_price, new_price, change_amount, change_pct, detected_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const insertAll = db.transaction(() => {
    for (const listing of [...saleListings, ...rentListings]) {
      const info = insertProperty.run(
        listing.externalId,
        listing.url,
        listing.title,
        listing.location,
        listing.area,
        "Dubai",
        listing.bedrooms,
        listing.bathrooms,
        listing.areaSqft,
        listing.propertyType,
        listing.listingType,
        listing.currentPrice,
        listing.unitNo,
        listing.tower,
        listing.firstSeenAt
      );

      const propertyId = info.lastInsertRowid;

      // Insert historical snapshots (30-90 days of data)
      for (const snap of listing.snapshots) {
        insertSnapshot.run(propertyId, snap.price, snap.date);
      }

      // Insert price changes
      for (const change of listing.changes) {
        insertChange.run(
          propertyId,
          change.oldPrice,
          change.newPrice,
          change.changeAmount,
          change.changePct,
          change.date
        );
      }
    }
  });

  insertAll();
}

interface SeedListing {
  externalId: string;
  url: string;
  title: string;
  location: string;
  area: string;
  unitNo: string;
  tower: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  propertyType: string;
  listingType: string;
  currentPrice: number;
  firstSeenAt: string;
  snapshots: { price: number; date: string }[];
  changes: {
    oldPrice: number;
    newPrice: number;
    changeAmount: number;
    changePct: number;
    date: string;
  }[];
}

const TOWERS: Record<string, string[]> = {
  "Dubai Marina": ["Marina Gate 1", "Marina Gate 2", "Cayan Tower", "Princess Tower", "Damac Heights", "Marina Crown", "The Torch", "Botanica Tower", "Marina Pinnacle", "Silverene Tower"],
  "Downtown Dubai": ["Burj Khalifa", "Boulevard Point", "The Address", "Claren Tower 1", "Claren Tower 2", "Act One Act Two", "Forte Tower", "Mon Reve", "Bellevue Tower 1", "The Residences"],
  "Palm Jumeirah": ["Oceana Pacific", "Oceana Atlantic", "Tiara Residences", "Shoreline Apartments", "Golden Mile", "Azure Residences", "Marina Residences", "Fairmont North", "Fairmont South"],
  "JBR": ["Sadaf 1", "Sadaf 2", "Murjan 1", "Murjan 2", "Bahar 1", "Bahar 2", "Shams 1", "Shams 2", "Amwaj 1", "Amwaj 2"],
  "Business Bay": ["Executive Tower B", "Executive Tower H", "Bay Gate", "The Opus", "Damac Maison", "Capital Bay Tower A", "Capital Bay Tower B", "Ubora Tower 1", "The Binary Tower", "Clover Bay Tower"],
  "Arabian Ranches": ["Al Reem", "Palmera", "Savannah", "Alma", "Rosa", "Lila", "Saheel", "Hattan"],
  "Dubai Hills Estate": ["Park Heights 1", "Park Heights 2", "Collective Tower 1", "Collective Tower 2", "Acacia", "Elora", "Golf Suites"],
  "Jumeirah Village Circle": ["Bloom Towers", "Belgravia Square", "Pantheon Elysee", "Oxford Residences", "Hyati Residences", "Ghalia", "Le Grand Chateau"],
  "Dubai Creek Harbour": ["Creek Gate Tower 1", "Creek Gate Tower 2", "Creek Rise", "Harbour Gate Tower 1", "Harbour Gate Tower 2", "Creek Edge Tower 1", "The Cove"],
  "DIFC": ["Index Tower", "Central Park Tower", "Park Tower A", "Park Tower B", "Liberty House", "Sky Gardens", "Gate Village"],
  "Jumeirah Lake Towers": ["Cluster A", "Cluster D", "Cluster E", "Cluster R", "Lake Shore Tower", "Saba Tower 1", "Saba Tower 2", "Goldcrest Executive", "Icon Tower 1"],
  "Al Barsha": ["Al Barsha Business Centre", "Sama Tower", "Majestic Tower", "Elite Residence"],
  "Motor City": ["Fox Hill", "Green Community", "Bennett House", "Sherlock House", "Dickens Circus"],
  "Dubai Silicon Oasis": ["Silicon Heights", "Le Presidium", "Palace Tower", "Axis Silver", "Axis Residence"],
  "Town Square": ["Zahra Apartments", "Safi Apartments", "Hayat Boulevard", "Rawda Apartments", "Naseem Apartments"],
};

function genTower(area: string, propType: string, rng: () => number): string {
  if (propType === "Villa" || propType === "Townhouse") {
    const communities = TOWERS[area] ?? ["Community"];
    return communities[Math.floor(rng() * communities.length)];
  }
  const towers = TOWERS[area] ?? ["Tower 1"];
  return towers[Math.floor(rng() * towers.length)];
}

function genUnitNo(propType: string, rng: () => number): string {
  if (propType === "Villa") return "V" + String(100 + Math.floor(rng() * 900));
  if (propType === "Townhouse") return "TH-" + String(10 + Math.floor(rng() * 90));
  const floor = Math.floor(rng() * 45) + 1;
  const unit = Math.floor(rng() * 12) + 1;
  return String(floor) + String(unit).padStart(2, "0");
}

function generateListings(
  areas: string[],
  propertyTypes: string[],
  listingType: string,
  count: number
): SeedListing[] {
  const listings: SeedListing[] = [];
  const rng = seedRandom(42);

  for (let i = 0; i < count; i++) {
    const area = areas[Math.floor(rng() * areas.length)];
    const propType = propertyTypes[Math.floor(rng() * propertyTypes.length)];
    const unitNo = genUnitNo(propType, rng);
    const tower = genTower(area, propType, rng);
    const bedrooms =
      propType === "Studio" ? 0 : Math.floor(rng() * 5) + 1;
    const bathrooms = Math.max(1, bedrooms);
    const areaSqft =
      propType === "Villa"
        ? 2000 + Math.floor(rng() * 5000)
        : propType === "Penthouse"
          ? 2500 + Math.floor(rng() * 3000)
          : propType === "Studio"
            ? 350 + Math.floor(rng() * 250)
            : 600 + Math.floor(rng() * 2000);

    let basePrice: number;
    if (listingType === "sale") {
      const pricePerSqft = getPricePerSqft(area, propType, rng);
      basePrice = Math.round(areaSqft * pricePerSqft / 1000) * 1000;
    } else {
      const rentPerSqft = getRentPerSqft(area, propType, rng);
      basePrice = Math.round(areaSqft * rentPerSqft / 100) * 100;
    }

    // Generate price history (60-90 days)
    const daysOfHistory = 60 + Math.floor(rng() * 30);
    const snapshots: SeedListing["snapshots"] = [];
    const changes: SeedListing["changes"] = [];

    let currentPrice = basePrice;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysOfHistory);

    for (let day = 0; day <= daysOfHistory; day += 3 + Math.floor(rng() * 4)) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      const dateStr = date.toISOString().replace("T", " ").slice(0, 19);

      snapshots.push({ price: currentPrice, date: dateStr });

      // Random price change (15% chance per snapshot)
      if (rng() < 0.15 && day > 0) {
        const oldPrice = currentPrice;
        const changePct = (rng() - 0.45) * 10; // -4.5% to +5.5% bias slightly up
        currentPrice = Math.round(currentPrice * (1 + changePct / 100) / 100) * 100;
        const changeAmount = currentPrice - oldPrice;
        const actualPct = ((currentPrice - oldPrice) / oldPrice) * 100;

        changes.push({
          oldPrice,
          newPrice: currentPrice,
          changeAmount,
          changePct: Math.round(actualPct * 100) / 100,
          date: dateStr,
        });
      }
    }

    const slug = area.toLowerCase().replace(/\s+/g, "-");
    listings.push({
      externalId: `pf-${listingType}-${i}-${slug}`,
      url: `https://www.propertyfinder.ae/en/plp/${listingType}/${slug}/property-${i}.html`,
      title: `${bedrooms === 0 ? "Studio" : bedrooms + " BR"} ${propType} in ${tower}, ${area}`,
      location: `${tower}, ${area}, Dubai`,
      area,
      unitNo,
      tower,
      bedrooms,
      bathrooms,
      areaSqft,
      propertyType: propType,
      listingType,
      currentPrice,
      firstSeenAt: snapshots[0]?.date ?? new Date().toISOString(),
      snapshots,
      changes,
    });
  }

  return listings;
}

function getPricePerSqft(
  area: string,
  propType: string,
  rng: () => number
): number {
  const areaMultipliers: Record<string, number> = {
    "Palm Jumeirah": 2800,
    "Downtown Dubai": 2600,
    DIFC: 2500,
    "Dubai Marina": 2200,
    "Dubai Creek Harbour": 2100,
    JBR: 2000,
    "Business Bay": 1800,
    "Dubai Hills Estate": 1700,
    "Jumeirah Lake Towers": 1400,
    "Arabian Ranches": 1300,
    "Al Barsha": 1200,
    "Jumeirah Village Circle": 1100,
    "Motor City": 1000,
    "Dubai Silicon Oasis": 950,
    "Town Square": 900,
  };

  const typeMultipliers: Record<string, number> = {
    Penthouse: 1.5,
    Villa: 1.2,
    Townhouse: 1.0,
    Apartment: 1.0,
    Studio: 0.95,
  };

  const base = areaMultipliers[area] ?? 1200;
  const typeMult = typeMultipliers[propType] ?? 1.0;
  const variance = 0.85 + rng() * 0.3;

  return base * typeMult * variance;
}

function getRentPerSqft(
  area: string,
  propType: string,
  rng: () => number
): number {
  // Annual rent per sqft
  const base = getPricePerSqft(area, propType, rng);
  return (base * (0.06 + rng() * 0.03)); // 6-9% yield
}

function seedRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
