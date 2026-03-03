"use client";

import { useEffect, useState, useCallback } from "react";
import StatsCards from "@/components/StatsCards";
import PriceChangeTable from "@/components/PriceChangeTable";
import { AreaPriceChart, PriceTrendChart } from "@/components/Charts";
import ScrapeButton from "@/components/ScrapeButton";

interface DashboardData {
  stats: {
    totalProperties: number;
    totalForSale: number;
    totalForRent: number;
    avgSalePrice: number;
    avgRentPrice: number;
    recentChanges: number;
    priceIncreases: number;
    priceDecreases: number;
  };
  areaAvgSale: { area: string; avg_price: number; count: number }[];
  areaAvgRent: { area: string; avg_price: number; count: number }[];
  latestChanges: Array<{
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
  }>;
  priceTrend: Array<{
    week: string;
    avg_price: number;
    min_price: number;
    max_price: number;
    samples: number;
  }>;
  rentTrend: Array<{
    week: string;
    avg_price: number;
    min_price: number;
    max_price: number;
    samples: number;
  }>;
  topDrops: Array<{
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
  }>;
  topIncreases: Array<{
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
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-48 mb-2" />
            <div className="skeleton h-4 w-72" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-36 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="skeleton h-80 rounded-xl" />
          <div className="skeleton h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted text-sm mt-1">
            Monitor Dubai property prices from propertyfinder.ae
          </p>
        </div>
        <ScrapeButton onComplete={fetchData} />
      </div>

      {/* Stats */}
      <StatsCards stats={data.stats} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaPriceChart
          data={data.areaAvgSale}
          title="Average Sale Price by Area"
        />
        <AreaPriceChart
          data={data.areaAvgRent}
          title="Average Rent Price by Area"
        />
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceTrendChart
          data={data.priceTrend}
          title="Sale Price Trend (Weekly Avg)"
        />
        <PriceTrendChart
          data={data.rentTrend}
          title="Rent Price Trend (Weekly Avg)"
        />
      </div>

      {/* Price Changes */}
      <PriceChangeTable
        changes={data.latestChanges}
        title="Recent Price Changes"
      />

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChangeTable
          changes={data.topDrops}
          title="Biggest Price Drops"
        />
        <PriceChangeTable
          changes={data.topIncreases}
          title="Biggest Price Increases"
        />
      </div>
    </div>
  );
}
