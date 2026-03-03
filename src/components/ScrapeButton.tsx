"use client";

import { useState } from "react";

export default function ScrapeButton({ onComplete }: { onComplete?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    total?: number;
    new?: number;
    updated?: number;
    priceChanges?: number;
    error?: string;
  } | null>(null);
  const [listingType, setListingType] = useState<"rent" | "sale">("sale");
  const [showPanel, setShowPanel] = useState(false);

  async function handleScrape() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingType, pages: 2 }),
      });
      const data = await res.json();
      setResult(data);
      if (data.success) onComplete?.();
    } catch {
      setResult({ success: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Scrape Now
      </button>

      {showPanel && (
        <div className="absolute right-0 top-12 bg-card border border-border rounded-xl p-4 shadow-xl z-10 w-72">
          <h4 className="font-semibold text-sm mb-3">Scrape Properties</h4>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setListingType("sale")}
              className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                listingType === "sale"
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-muted"
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setListingType("rent")}
              className={`flex-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                listingType === "rent"
                  ? "bg-primary text-white"
                  : "bg-surface-hover text-muted"
              }`}
            >
              For Rent
            </button>
          </div>

          <button
            onClick={handleScrape}
            disabled={loading}
            className="w-full px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Scraping...
              </span>
            ) : (
              "Start Scrape"
            )}
          </button>

          {result && (
            <div
              className={`mt-3 p-3 rounded-lg text-sm ${
                result.success
                  ? "bg-accent/10 text-accent"
                  : "bg-danger/10 text-danger"
              }`}
            >
              {result.success ? (
                <div>
                  <div className="font-medium">Scrape Complete</div>
                  <div className="text-xs mt-1 opacity-80">
                    {result.total} found, {result.new} new, {result.priceChanges} price changes
                  </div>
                </div>
              ) : (
                <div>Error: {result.error}</div>
              )}
            </div>
          )}

          <p className="text-xs text-muted mt-3">
            Fetches latest listings from propertyfinder.ae and detects price changes.
          </p>
        </div>
      )}
    </div>
  );
}
