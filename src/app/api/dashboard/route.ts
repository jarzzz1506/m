import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();

  // Overall stats
  const totalProperties = db
    .prepare("SELECT COUNT(*) as count FROM properties")
    .get() as { count: number };

  const totalForSale = db
    .prepare("SELECT COUNT(*) as count FROM properties WHERE listing_type = 'sale'")
    .get() as { count: number };

  const totalForRent = db
    .prepare("SELECT COUNT(*) as count FROM properties WHERE listing_type = 'rent'")
    .get() as { count: number };

  const avgSalePrice = db
    .prepare(
      "SELECT AVG(current_price) as avg FROM properties WHERE listing_type = 'sale'"
    )
    .get() as { avg: number | null };

  const avgRentPrice = db
    .prepare(
      "SELECT AVG(current_price) as avg FROM properties WHERE listing_type = 'rent'"
    )
    .get() as { avg: number | null };

  // Price changes in last 7 days
  const recentChanges = db
    .prepare(
      `SELECT COUNT(*) as count FROM price_changes
       WHERE detected_at >= datetime('now', '-7 days')`
    )
    .get() as { count: number };

  const priceIncreases = db
    .prepare(
      `SELECT COUNT(*) as count FROM price_changes
       WHERE change_amount > 0 AND detected_at >= datetime('now', '-30 days')`
    )
    .get() as { count: number };

  const priceDecreases = db
    .prepare(
      `SELECT COUNT(*) as count FROM price_changes
       WHERE change_amount < 0 AND detected_at >= datetime('now', '-30 days')`
    )
    .get() as { count: number };

  // Average price by area (for sale)
  const areaAvgSale = db
    .prepare(
      `SELECT area, AVG(current_price) as avg_price, COUNT(*) as count
       FROM properties WHERE listing_type = 'sale'
       GROUP BY area ORDER BY avg_price DESC`
    )
    .all() as { area: string; avg_price: number; count: number }[];

  // Average price by area (for rent)
  const areaAvgRent = db
    .prepare(
      `SELECT area, AVG(current_price) as avg_price, COUNT(*) as count
       FROM properties WHERE listing_type = 'rent'
       GROUP BY area ORDER BY avg_price DESC`
    )
    .all() as { area: string; avg_price: number; count: number }[];

  // Property type distribution
  const typeDistribution = db
    .prepare(
      `SELECT property_type, listing_type, COUNT(*) as count, AVG(current_price) as avg_price
       FROM properties GROUP BY property_type, listing_type
       ORDER BY count DESC`
    )
    .all();

  // Recent price changes with property info
  const latestChanges = db
    .prepare(
      `SELECT pc.*, p.title, p.area, p.listing_type, p.property_type, p.bedrooms
       FROM price_changes pc
       JOIN properties p ON pc.property_id = p.id
       ORDER BY pc.detected_at DESC
       LIMIT 20`
    )
    .all();

  // Price trend over time (avg price per week)
  const priceTrend = db
    .prepare(
      `SELECT
         strftime('%Y-%W', scraped_at) as week,
         AVG(price) as avg_price,
         MIN(price) as min_price,
         MAX(price) as max_price,
         COUNT(*) as samples
       FROM price_snapshots ps
       JOIN properties p ON ps.property_id = p.id
       WHERE p.listing_type = 'sale'
       GROUP BY week
       ORDER BY week ASC`
    )
    .all();

  const rentTrend = db
    .prepare(
      `SELECT
         strftime('%Y-%W', scraped_at) as week,
         AVG(price) as avg_price,
         MIN(price) as min_price,
         MAX(price) as max_price,
         COUNT(*) as samples
       FROM price_snapshots ps
       JOIN properties p ON ps.property_id = p.id
       WHERE p.listing_type = 'rent'
       GROUP BY week
       ORDER BY week ASC`
    )
    .all();

  // Top price drops
  const topDrops = db
    .prepare(
      `SELECT pc.*, p.title, p.area, p.listing_type, p.current_price, p.id as property_id, p.bedrooms
       FROM price_changes pc
       JOIN properties p ON pc.property_id = p.id
       WHERE pc.change_pct < 0
       ORDER BY pc.change_pct ASC
       LIMIT 10`
    )
    .all();

  // Top price increases
  const topIncreases = db
    .prepare(
      `SELECT pc.*, p.title, p.area, p.listing_type, p.current_price, p.id as property_id, p.bedrooms
       FROM price_changes pc
       JOIN properties p ON pc.property_id = p.id
       WHERE pc.change_pct > 0
       ORDER BY pc.change_pct DESC
       LIMIT 10`
    )
    .all();

  return NextResponse.json({
    stats: {
      totalProperties: totalProperties.count,
      totalForSale: totalForSale.count,
      totalForRent: totalForRent.count,
      avgSalePrice: Math.round(avgSalePrice.avg ?? 0),
      avgRentPrice: Math.round(avgRentPrice.avg ?? 0),
      recentChanges: recentChanges.count,
      priceIncreases: priceIncreases.count,
      priceDecreases: priceDecreases.count,
    },
    areaAvgSale,
    areaAvgRent,
    typeDistribution,
    latestChanges,
    priceTrend,
    rentTrend,
    topDrops,
    topIncreases,
  });
}
