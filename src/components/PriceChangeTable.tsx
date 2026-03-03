"use client";

import Link from "next/link";
import { formatPriceExact, formatChange, timeAgo } from "@/lib/format";

interface PriceChange {
  id: number;
  property_id: number;
  old_price: number;
  new_price: number;
  change_amount: number;
  change_pct: number;
  detected_at: string;
  title: string;
  area: string;
  listing_type: string;
  property_type: string;
  bedrooms: number;
  unit_no: string | null;
  tower: string | null;
}

export default function PriceChangeTable({
  changes,
  title = "Recent Price Changes",
}: {
  changes: PriceChange[];
  title?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Unit</th>
              <th>Tower</th>
              <th>Area</th>
              <th>Type</th>
              <th className="text-right">Old Price</th>
              <th className="text-right">New Price</th>
              <th className="text-right">Change</th>
              <th className="text-right">When</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.id}>
                <td>
                  <Link
                    href={`/properties/${change.property_id}`}
                    className="text-primary-light hover:underline font-medium"
                  >
                    {change.title}
                  </Link>
                </td>
                <td className="text-muted font-mono text-sm">{change.unit_no || "-"}</td>
                <td className="text-muted text-sm">{change.tower || "-"}</td>
                <td className="text-muted">{change.area}</td>
                <td>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    change.listing_type === "sale"
                      ? "bg-primary/10 text-primary-light"
                      : "bg-warning/10 text-warning"
                  }`}>
                    {change.listing_type}
                  </span>
                </td>
                <td className="text-right text-muted font-mono text-sm">
                  {formatPriceExact(change.old_price)}
                </td>
                <td className="text-right font-mono text-sm font-medium">
                  {formatPriceExact(change.new_price)}
                </td>
                <td className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-sm font-medium ${
                      change.change_pct > 0
                        ? "text-danger"
                        : "text-accent"
                    }`}
                  >
                    {change.change_pct > 0 ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                      </svg>
                    )}
                    {formatChange(change.change_pct)}
                  </span>
                </td>
                <td className="text-right text-muted text-sm">
                  {timeAgo(change.detected_at)}
                </td>
              </tr>
            ))}
            {changes.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-muted py-8">
                  No price changes recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
