"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatPrice } from "@/lib/format";

interface AreaPriceData {
  area: string;
  avg_price: number;
  count: number;
}

interface TrendData {
  week: string;
  avg_price: number;
  min_price: number;
  max_price: number;
  samples: number;
}

function CustomTooltip({
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
          {p.name}: {formatPrice(p.value)}
        </div>
      ))}
    </div>
  );
}

export function AreaPriceChart({
  data,
  title,
}: {
  data: AreaPriceData[];
  title: string;
}) {
  const COLORS = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
    "#14b8a6", "#e879f9", "#fb923c", "#4ade80", "#a78bfa",
  ];

  const chartData = data.slice(0, 12).map((d) => ({
    name: d.area.length > 15 ? d.area.slice(0, 13) + ".." : d.area,
    fullName: d.area,
    price: Math.round(d.avg_price),
    count: d.count,
  }));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 50, left: 10 }}>
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
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="price" name="Avg Price" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PriceTrendChart({
  data,
  title,
}: {
  data: TrendData[];
  title: string;
}) {
  const chartData = data.map((d) => ({
    week: d.week,
    avg: Math.round(d.avg_price),
    min: Math.round(d.min_price),
    max: Math.round(d.max_price),
  }));

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="avgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(v) => formatPrice(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="max"
              name="Max"
              stroke="#334155"
              fill="none"
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="avg"
              name="Average"
              stroke="#3b82f6"
              fill="url(#avgGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="min"
              name="Min"
              stroke="#334155"
              fill="none"
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
