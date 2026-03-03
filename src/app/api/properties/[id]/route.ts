import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getDb();
  const { id } = await params;
  const propertyId = parseInt(id);

  if (isNaN(propertyId)) {
    return NextResponse.json({ error: "Invalid property ID" }, { status: 400 });
  }

  const property = db
    .prepare("SELECT * FROM properties WHERE id = ?")
    .get(propertyId);

  if (!property) {
    return NextResponse.json(
      { error: "Property not found" },
      { status: 404 }
    );
  }

  const priceHistory = db
    .prepare(
      "SELECT price, scraped_at FROM price_snapshots WHERE property_id = ? ORDER BY scraped_at ASC"
    )
    .all(propertyId);

  const priceChanges = db
    .prepare(
      "SELECT * FROM price_changes WHERE property_id = ? ORDER BY detected_at DESC"
    )
    .all(propertyId);

  return NextResponse.json({
    property,
    priceHistory,
    priceChanges,
  });
}
