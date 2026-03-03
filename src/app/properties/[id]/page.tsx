"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPriceExact, formatChange, formatDate, formatDateShort } from "@/lib/format";

interface Property {
  id: number;
  external_id: string;
  url: string;
  title: string;
  location: string;
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  property_type: string;
  listing_type: string;
  current_price: number;
  currency: string;
  first_seen_at: string;
  last_updated_at: string;
}

interface PriceSnapshot {
  price: number;
  scraped_at: string;
}

interface PriceChange {
  id: number;
  old_price: number;
  new_price: number;
  change_amount: number;
  change_pct: number;
  detected_at: string;
}

function PriceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-sm font-medium text-foreground">
        AED {payload[0].value.toLocaleString()}
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceSnapshot[]>([]);
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProperty(data.property);
        setPriceHistory(data.priceHistory);
        setPriceChanges(data.priceChanges);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-4 w-96" />
        <div className="skeleton h-80 rounded-xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted text-lg">Property not found</p>
        <Link href="/properties" className="text-primary-light hover:underline">
          Back to properties
        </Link>
      </div>
    );
  }

  const chartData = priceHistory.map((s) => ({
    date: formatDateShort(s.scraped_at),
    price: s.price,
  }));

  const priceRange =
    priceHistory.length > 0
      ? {
          min: Math.min(...priceHistory.map((s) => s.price)),
          max: Math.max(...priceHistory.map((s) => s.price)),
        }
      : null;

  const firstPrice = priceHistory[0]?.price ?? property.current_price;
  const totalChange = property.current_price - firstPrice;
  const totalChangePct =
    firstPrice > 0
      ? Math.round((totalChange / firstPrice) * 10000) / 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link href="/properties" className="hover:text-foreground">
          Properties
        </Link>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-foreground">{property.title}</span>
      </div>

      {/* Property Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {property.title}
            </h1>
            <p className="text-muted mt-1">{property.location}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span
                className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
                  property.listing_type === "sale"
                    ? "bg-primary/10 text-primary-light"
                    : "bg-warning/10 text-warning"
                }`}
              >
                For {property.listing_type === "sale" ? "Sale" : "Rent"}
              </span>
              <span className="inline-block px-2.5 py-1 rounded text-xs font-medium bg-surface-hover text-foreground">
                {property.property_type}
              </span>
              {property.bedrooms > 0 && (
                <span className="text-sm text-muted">
                  {property.bedrooms} bed{property.bedrooms > 1 ? "s" : ""}
                </span>
              )}
              {property.bathrooms > 0 && (
                <span className="text-sm text-muted">
                  {property.bathrooms} bath{property.bathrooms > 1 ? "s" : ""}
                </span>
              )}
              {property.area_sqft > 0 && (
                <span className="text-sm text-muted">
                  {property.area_sqft.toLocaleString()} sqft
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">
              {formatPriceExact(property.current_price, property.currency)}
            </div>
            {totalChange !== 0 && (
              <div
                className={`text-sm font-medium mt-1 ${
                  totalChange > 0 ? "text-danger" : "text-accent"
                }`}
              >
                {totalChange > 0 ? "+" : ""}
                {formatPriceExact(totalChange)} ({formatChange(totalChangePct)}) since
                tracked
              </div>
            )}
            <div className="text-xs text-muted mt-1">
              Tracked since {formatDate(property.first_seen_at)}
            </div>
            {property.area_sqft > 0 && (
              <div className="text-sm text-muted mt-1">
                {formatPriceExact(
                  Math.round(property.current_price / property.area_sqft)
                )}{" "}
                / sqft
              </div>
            )}
          </div>
        </div>

        <a
          href={property.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary/10 text-primary-light rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          View on PropertyFinder
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted">Price Changes</div>
          <div className="text-xl font-bold text-foreground mt-1">
            {priceChanges.length}
          </div>
        </div>
        {priceRange && (
          <>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted">Lowest Price</div>
              <div className="text-xl font-bold text-accent mt-1">
                {formatPriceExact(priceRange.min)}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-sm text-muted">Highest Price</div>
              <div className="text-xl font-bold text-danger mt-1">
                {formatPriceExact(priceRange.max)}
              </div>
            </div>
          </>
        )}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-sm text-muted">Total Change</div>
          <div
            className={`text-xl font-bold mt-1 ${
              totalChangePct > 0
                ? "text-danger"
                : totalChangePct < 0
                  ? "text-accent"
                  : "text-foreground"
            }`}
          >
            {formatChange(totalChangePct)}
          </div>
        </div>
      </div>

      {/* Price History Chart */}
      {chartData.length > 1 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Price History</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
              >
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}M`
                      : v >= 1_000
                        ? `${(v / 1_000).toFixed(0)}K`
                        : String(v)
                  }
                  domain={["dataMin - dataMin * 0.05", "dataMax + dataMax * 0.05"]}
                />
                <Tooltip content={<PriceTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  fill="url(#priceGradient)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#60a5fa", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Price Change History */}
      {priceChanges.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Price Change History
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th className="text-right">Old Price</th>
                  <th className="text-right">New Price</th>
                  <th className="text-right">Change</th>
                  <th className="text-right">% Change</th>
                </tr>
              </thead>
              <tbody>
                {priceChanges.map((change) => (
                  <tr key={change.id}>
                    <td className="text-muted">
                      {formatDate(change.detected_at)}
                    </td>
                    <td className="text-right font-mono text-sm">
                      {formatPriceExact(change.old_price)}
                    </td>
                    <td className="text-right font-mono text-sm font-medium">
                      {formatPriceExact(change.new_price)}
                    </td>
                    <td
                      className={`text-right font-mono text-sm font-medium ${
                        change.change_amount > 0 ? "text-danger" : "text-accent"
                      }`}
                    >
                      {change.change_amount > 0 ? "+" : ""}
                      {formatPriceExact(change.change_amount)}
                    </td>
                    <td
                      className={`text-right font-mono text-sm font-medium ${
                        change.change_pct > 0 ? "text-danger" : "text-accent"
                      }`}
                    >
                      {formatChange(change.change_pct)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
