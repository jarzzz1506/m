import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = getDb();
  const params = request.nextUrl.searchParams;

  const area = params.get("area");
  const listingType = params.get("listing_type") ?? "sale";
  const period = params.get("period") ?? "90"; // days

  const conditions: string[] = ["p.listing_type = ?"];
  const values: (string | number)[] = [listingType];

  if (area) {
    conditions.push("p.area = ?");
    values.push(area);
  }

  const whereClause = conditions.join(" AND ");

  // Price trend over time
  const priceTrend = db
    .prepare(
      `SELECT
         date(scraped_at) as date,
         AVG(price) as avg_price,
         MIN(price) as min_price,
         MAX(price) as max_price,
         COUNT(DISTINCT ps.property_id) as properties_count
       FROM price_snapshots ps
       JOIN properties p ON ps.property_id = p.id
       WHERE ${whereClause}
         AND scraped_at >= datetime('now', '-${parseInt(period)} days')
       GROUP BY date(scraped_at)
       ORDER BY date ASC`
    )
    .all(...values);

  // Area comparison
  const areaComparison = db
    .prepare(
      `SELECT
         p.area,
         AVG(p.current_price) as current_avg,
         COUNT(*) as listings,
         AVG(p.area_sqft) as avg_sqft,
         AVG(p.current_price / NULLIF(p.area_sqft, 0)) as price_per_sqft
       FROM properties p
       WHERE p.listing_type = ?
       GROUP BY p.area
       ORDER BY current_avg DESC`
    )
    .all(listingType);

  // Price change frequency by area
  const changesByArea = db
    .prepare(
      `SELECT
         p.area,
         COUNT(*) as total_changes,
         SUM(CASE WHEN pc.change_amount > 0 THEN 1 ELSE 0 END) as increases,
         SUM(CASE WHEN pc.change_amount < 0 THEN 1 ELSE 0 END) as decreases,
         AVG(pc.change_pct) as avg_change_pct
       FROM price_changes pc
       JOIN properties p ON pc.property_id = p.id
       WHERE p.listing_type = ?
       GROUP BY p.area
       ORDER BY total_changes DESC`
    )
    .all(listingType);

  // Bedroom analysis
  const bedroomAnalysis = db
    .prepare(
      `SELECT
         CASE WHEN p.bedrooms = 0 THEN 'Studio' ELSE p.bedrooms || ' BR' END as bedroom_type,
         p.bedrooms,
         AVG(p.current_price) as avg_price,
         COUNT(*) as count,
         AVG(p.area_sqft) as avg_sqft
       FROM properties p
       WHERE p.listing_type = ?
       GROUP BY p.bedrooms
       ORDER BY p.bedrooms ASC`
    )
    .all(listingType);

  // Property type analysis
  const propertyTypeAnalysis = db
    .prepare(
      `SELECT
         p.property_type,
         AVG(p.current_price) as avg_price,
         COUNT(*) as count,
         AVG(p.area_sqft) as avg_sqft,
         AVG(p.current_price / NULLIF(p.area_sqft, 0)) as price_per_sqft
       FROM properties p
       WHERE p.listing_type = ?
       GROUP BY p.property_type
       ORDER BY avg_price DESC`
    )
    .all(listingType);

  // Areas with most data
  const areas = db
    .prepare(
      `SELECT DISTINCT area, COUNT(*) as count
       FROM properties
       GROUP BY area
       ORDER BY count DESC`
    )
    .all();

  return NextResponse.json({
    priceTrend,
    areaComparison,
    changesByArea,
    bedroomAnalysis,
    propertyTypeAnalysis,
    areas,
  });
}
