"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { formatPrice } from "@/lib/format";

interface AreaComparison {
  area: string;
  current_avg: number;
  listings: number;
  avg_sqft: number;
  price_per_sqft: number;
}

interface ChangesByArea {
  area: string;
  total_changes: number;
  increases: number;
  decreases: number;
  avg_change_pct: number;
}

interface BedroomAnalysis {
  bedroom_type: string;
  bedrooms: number;
  avg_price: number;
  count: number;
  avg_sqft: number;
}

interface PropertyTypeAnalysis {
  property_type: string;
  avg_price: number;
  count: number;
  avg_sqft: number;
  price_per_sqft: number;
}

interface TrendPoint {
  date: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  properties_count: number;
}

interface AreaOption {
  area: string;
  count: number;
}

interface TrendsData {
  priceTrend: TrendPoint[];
  areaComparison: AreaComparison[];
  changesByArea: ChangesByArea[];
  bedroomAnalysis: BedroomAnalysis[];
  propertyTypeAnalysis: PropertyTypeAnalysis[];
  areas: AreaOption[];
}

const COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  "#14b8a6", "#e879f9", "#fb923c", "#4ade80", "#a78bfa",
];

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-lg">
      <div className="text-xs text-muted mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-sm font-medium" style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? formatPrice(p.value) : p.value}
        </div>
      ))}
    </div>
  );
}

export default function TrendsPage() {
  const [data, setData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [selectedArea, setSelectedArea] = useState<string>("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("listing_type", listingType);
    if (selectedArea) params.set("area", selectedArea);

    try {
      const res = await fetch(`/api/trends?${params}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch trends:", err);
    } finally {
      setLoading(false);
    }
  }, [listingType, selectedArea]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Trends</h1>
          <p className="text-muted text-sm mt-1">
            Analyze Dubai property market trends and comparisons
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 bg-background rounded-lg p-1">
            <button
              onClick={() => setListingType("sale")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                listingType === "sale"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              For Sale
            </button>
            <button
              onClick={() => setListingType("rent")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
                listingType === "rent"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              For Rent
            </button>
          </div>

          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Areas</option>
            {data?.areas.map((a) => (
              <option key={a.area} value={a.area}>
                {a.area} ({a.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="skeleton h-80 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-80 rounded-xl" />
            <div className="skeleton h-80 rounded-xl" />
          </div>
        </div>
      ) : data ? (
        <>
          {/* Price Trend */}
          {data.priceTrend.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Price Trend Over Time
                {selectedArea && ` - ${selectedArea}`}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.priceTrend.map((d) => ({
                      date: d.date,
                      avg: Math.round(d.avg_price),
                      min: Math.round(d.min_price),
                      max: Math.round(d.max_price),
                    }))}
                    margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v) => formatPrice(v)}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="max" name="Max" stroke="#334155" fill="none" strokeDasharray="4 4" />
                    <Area type="monotone" dataKey="avg" name="Average" stroke="#3b82f6" fill="url(#trendGradient)" strokeWidth={2} />
                    <Area type="monotone" dataKey="min" name="Min" stroke="#334155" fill="none" strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Area Comparison & Price per sqft */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Area Comparison */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Average Price by Area
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.areaComparison.slice(0, 12).map((d) => ({
                      name: d.area.length > 13 ? d.area.slice(0, 11) + ".." : d.area,
                      price: Math.round(d.current_avg),
                    }))}
                    margin={{ top: 5, right: 5, bottom: 50, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v) => formatPrice(v)}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="price" name="Avg Price" radius={[4, 4, 0, 0]}>
                      {data.areaComparison.slice(0, 12).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Price per sqft by Area */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Price per sqft by Area
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.areaComparison
                      .filter((d) => d.price_per_sqft > 0)
                      .sort((a, b) => b.price_per_sqft - a.price_per_sqft)
                      .slice(0, 12)
                      .map((d) => ({
                        name: d.area.length > 13 ? d.area.slice(0, 11) + ".." : d.area,
                        pricePerSqft: Math.round(d.price_per_sqft),
                      }))}
                    margin={{ top: 5, right: 5, bottom: 50, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v) => `AED ${v}`}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="pricePerSqft" name="AED/sqft" radius={[4, 4, 0, 0]}>
                      {data.areaComparison.slice(0, 12).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bedroom & Property Type Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Bedrooms */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Average Price by Bedrooms
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.bedroomAnalysis.map((d) => ({
                      name: d.bedroom_type,
                      price: Math.round(d.avg_price),
                      count: d.count,
                    }))}
                    margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v) => formatPrice(v)}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="price" name="Avg Price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* By Property Type */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Average Price by Property Type
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.propertyTypeAnalysis.map((d) => ({
                      name: d.property_type,
                      price: Math.round(d.avg_price),
                      count: d.count,
                    }))}
                    margin={{ top: 5, right: 5, bottom: 5, left: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(v) => formatPrice(v)}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="price" name="Avg Price" radius={[4, 4, 0, 0]}>
                      {data.propertyTypeAnalysis.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Price Changes by Area */}
          {data.changesByArea.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Price Volatility by Area
              </h3>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Area</th>
                      <th className="text-right">Total Changes</th>
                      <th className="text-right">Increases</th>
                      <th className="text-right">Decreases</th>
                      <th className="text-right">Avg Change %</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.changesByArea.map((row) => (
                      <tr key={row.area}>
                        <td className="font-medium">{row.area}</td>
                        <td className="text-right">{row.total_changes}</td>
                        <td className="text-right text-accent">
                          {row.increases}
                        </td>
                        <td className="text-right text-danger">
                          {row.decreases}
                        </td>
                        <td
                          className={`text-right font-mono text-sm ${
                            row.avg_change_pct > 0
                              ? "text-danger"
                              : "text-accent"
                          }`}
                        >
                          {row.avg_change_pct > 0 ? "+" : ""}
                          {row.avg_change_pct.toFixed(2)}%
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            <div className="flex-1 h-2 bg-background rounded-full overflow-hidden max-w-[120px]">
                              <div
                                className="h-full bg-accent rounded-full"
                                style={{
                                  width: `${
                                    row.total_changes > 0
                                      ? (row.increases / row.total_changes) *
                                        100
                                      : 50
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Area Comparison Table */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">
              Area Comparison
            </h3>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Area</th>
                    <th className="text-right">Listings</th>
                    <th className="text-right">Avg Price</th>
                    <th className="text-right">Avg Size</th>
                    <th className="text-right">AED/sqft</th>
                  </tr>
                </thead>
                <tbody>
                  {data.areaComparison.map((row) => (
                    <tr key={row.area}>
                      <td className="font-medium">{row.area}</td>
                      <td className="text-right text-muted">{row.listings}</td>
                      <td className="text-right font-mono text-sm">
                        {formatPrice(row.current_avg)}
                      </td>
                      <td className="text-right text-muted">
                        {row.avg_sqft > 0
                          ? `${Math.round(row.avg_sqft).toLocaleString()} sqft`
                          : "-"}
                      </td>
                      <td className="text-right font-mono text-sm font-medium">
                        {row.price_per_sqft > 0
                          ? `AED ${Math.round(row.price_per_sqft).toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-muted">Failed to load trends data.</p>
        </div>
      )}
    </div>
  );
}
