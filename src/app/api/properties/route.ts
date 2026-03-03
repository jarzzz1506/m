import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = getDb();
  const params = request.nextUrl.searchParams;

  const page = Math.max(1, parseInt(params.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(params.get("limit") ?? "20")));
  const offset = (page - 1) * limit;

  const listingType = params.get("listing_type");
  const area = params.get("area");
  const propertyType = params.get("property_type");
  const minPrice = params.get("min_price");
  const maxPrice = params.get("max_price");
  const minBedrooms = params.get("min_bedrooms");
  const sort = params.get("sort") ?? "last_updated_at";
  const order = params.get("order") === "asc" ? "ASC" : "DESC";
  const search = params.get("q");

  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (listingType && ["rent", "sale"].includes(listingType)) {
    conditions.push("p.listing_type = ?");
    values.push(listingType);
  }

  if (area) {
    conditions.push("p.area = ?");
    values.push(area);
  }

  if (propertyType) {
    conditions.push("p.property_type = ?");
    values.push(propertyType);
  }

  if (minPrice) {
    conditions.push("p.current_price >= ?");
    values.push(parseFloat(minPrice));
  }

  if (maxPrice) {
    conditions.push("p.current_price <= ?");
    values.push(parseFloat(maxPrice));
  }

  if (minBedrooms) {
    conditions.push("p.bedrooms >= ?");
    values.push(parseInt(minBedrooms));
  }

  if (search) {
    conditions.push("(p.title LIKE ? OR p.location LIKE ? OR p.area LIKE ?)");
    const searchTerm = `%${search}%`;
    values.push(searchTerm, searchTerm, searchTerm);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const allowedSorts = [
    "current_price",
    "last_updated_at",
    "first_seen_at",
    "area_sqft",
    "bedrooms",
  ];
  const safeSort = allowedSorts.includes(sort) ? sort : "last_updated_at";

  // Get total count
  const countRow = db
    .prepare(`SELECT COUNT(*) as total FROM properties p ${whereClause}`)
    .get(...values) as { total: number };

  // Get properties with latest price change info
  const properties = db
    .prepare(
      `SELECT p.*,
        (SELECT change_pct FROM price_changes WHERE property_id = p.id ORDER BY detected_at DESC LIMIT 1) as latest_change_pct,
        (SELECT change_amount FROM price_changes WHERE property_id = p.id ORDER BY detected_at DESC LIMIT 1) as latest_change_amount,
        (SELECT COUNT(*) FROM price_changes WHERE property_id = p.id) as total_changes
      FROM properties p
      ${whereClause}
      ORDER BY p.${safeSort} ${order}
      LIMIT ? OFFSET ?`
    )
    .all(...values, limit, offset);

  return NextResponse.json({
    properties,
    pagination: {
      page,
      limit,
      total: countRow.total,
      totalPages: Math.ceil(countRow.total / limit),
    },
  });
}
