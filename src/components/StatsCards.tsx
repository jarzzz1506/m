"use client";

import { formatPrice } from "@/lib/format";

interface Stats {
  totalProperties: number;
  totalForSale: number;
  totalForRent: number;
  avgSalePrice: number;
  avgRentPrice: number;
  recentChanges: number;
  priceIncreases: number;
  priceDecreases: number;
}

export default function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    {
      label: "Total Properties",
      value: stats.totalProperties.toLocaleString(),
      sub: `${stats.totalForSale} sale / ${stats.totalForRent} rent`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
        </svg>
      ),
      color: "text-primary-light",
      bgColor: "bg-primary/10",
    },
    {
      label: "Avg. Sale Price",
      value: formatPrice(stats.avgSalePrice),
      sub: "Per listing",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Avg. Rent Price",
      value: formatPrice(stats.avgRentPrice),
      sub: "Annual",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      ),
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Price Changes",
      value: (stats.priceIncreases + stats.priceDecreases).toLocaleString(),
      sub: (
        <span>
          <span className="text-accent">{stats.priceIncreases} up</span>
          {" / "}
          <span className="text-danger">{stats.priceDecreases} down</span>
          {" (30d)"}
        </span>
      ),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-4.5L16.5 7.5m0 0L12 12m4.5-4.5v13.5" />
        </svg>
      ),
      color: "text-primary-light",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
              <span className={card.color}>{card.icon}</span>
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">
            {card.value}
          </div>
          <div className="text-sm text-muted">{card.label}</div>
          <div className="text-xs text-muted mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
