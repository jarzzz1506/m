import { NextRequest, NextResponse } from "next/server";
import { scrapeListings } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const listingType = body.listingType === "sale" ? "sale" : "rent";
    const area = body.area || undefined;
    const pages = Math.min(body.pages || 1, 5);

    const result = await scrapeListings(listingType, area, pages);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Scrape failed",
      },
      { status: 500 }
    );
  }
}
