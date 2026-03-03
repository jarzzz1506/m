"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatPriceExact, formatChange, timeAgo } from "@/lib/format";

interface Property {
  id: number;
  title: string;
  location: string;
  area: string;
  unit_no: string | null;
  tower: string | null;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  property_type: string;
  listing_type: string;
  current_price: number;
  currency: string;
  first_seen_at: string;
  last_updated_at: string;
  latest_change_pct: number | null;
  latest_change_amount: number | null;
  total_changes: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AREAS = [
  "Dubai Marina",
  "Downtown Dubai",
  "Palm Jumeirah",
  "JBR",
  "Business Bay",
  "Arabian Ranches",
  "Dubai Hills Estate",
  "Jumeirah Village Circle",
  "Dubai Creek Harbour",
  "DIFC",
  "Jumeirah Lake Towers",
  "Al Barsha",
  "Motor City",
  "Dubai Silicon Oasis",
  "Town Square",
];

const PROPERTY_TYPES = ["Apartment", "Villa", "Townhouse", "Penthouse", "Studio"];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [listingType, setListingType] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [minBedrooms, setMinBedrooms] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState("last_updated_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    params.set("sort", sort);
    params.set("order", order);
    if (listingType) params.set("listing_type", listingType);
    if (area) params.set("area", area);
    if (propertyType) params.set("property_type", propertyType);
    if (minBedrooms) params.set("min_bedrooms", minBedrooms);
    if (search) params.set("q", search);

    try {
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, listingType, area, propertyType, minBedrooms, search]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  function handleSort(field: string) {
    if (sort === field) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSort(field);
      setOrder("desc");
    }
    setPage(1);
  }

  function SortIcon({ field }: { field: string }) {
    if (sort !== field) return null;
    return (
      <svg className="w-3 h-3 inline ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {order === "asc" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        )}
      </svg>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Properties</h1>
        <p className="text-muted text-sm mt-1">
          Browse and filter tracked properties
          {pagination && (
            <span className="ml-2 text-foreground font-medium">
              ({pagination.total.toLocaleString()} total)
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search properties..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted focus:outline-none focus:border-primary"
            />
          </div>

          {/* Listing Type */}
          <select
            value={listingType}
            onChange={(e) => {
              setListingType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>

          {/* Area */}
          <select
            value={area}
            onChange={(e) => {
              setArea(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Areas</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Property Type */}
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Property Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Bedrooms */}
          <select
            value={minBedrooms}
            onChange={(e) => {
              setMinBedrooms(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">Any Beds</option>
            <option value="0">Studio+</option>
            <option value="1">1+ BR</option>
            <option value="2">2+ BR</option>
            <option value="3">3+ BR</option>
            <option value="4">4+ BR</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Unit</th>
                <th>Tower</th>
                <th>Area</th>
                <th>Type</th>
                <th>Beds</th>
                <th
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("area_sqft")}
                >
                  Size <SortIcon field="area_sqft" />
                </th>
                <th
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("current_price")}
                >
                  Price <SortIcon field="current_price" />
                </th>
                <th className="text-right">Change</th>
                <th
                  className="text-right cursor-pointer hover:text-foreground"
                  onClick={() => handleSort("last_updated_at")}
                >
                  Updated <SortIcon field="last_updated_at" />
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(10)].map((_, j) => (
                      <td key={j}>
                        <div className="skeleton h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center text-muted py-12">
                    No properties found matching your filters
                  </td>
                </tr>
              ) : (
                properties.map((prop) => (
                  <tr key={prop.id}>
                    <td>
                      <Link
                        href={`/properties/${prop.id}`}
                        className="text-primary-light hover:underline font-medium"
                      >
                        {prop.title}
                      </Link>
                    </td>
                    <td className="text-muted font-mono text-sm">{prop.unit_no || "-"}</td>
                    <td className="text-muted text-sm">{prop.tower || "-"}</td>
                    <td className="text-muted">{prop.area}</td>
                    <td>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          prop.listing_type === "sale"
                            ? "bg-primary/10 text-primary-light"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {prop.listing_type}
                      </span>
                    </td>
                    <td className="text-center">
                      {prop.bedrooms === 0 ? "S" : prop.bedrooms}
                    </td>
                    <td className="text-right text-muted text-sm">
                      {prop.area_sqft > 0
                        ? `${prop.area_sqft.toLocaleString()} sqft`
                        : "-"}
                    </td>
                    <td className="text-right font-mono text-sm font-medium">
                      {formatPriceExact(prop.current_price, prop.currency)}
                    </td>
                    <td className="text-right">
                      {prop.latest_change_pct != null ? (
                        <span
                          className={`font-mono text-sm font-medium ${
                            prop.latest_change_pct > 0
                              ? "text-danger"
                              : "text-accent"
                          }`}
                        >
                          {formatChange(prop.latest_change_pct)}
                        </span>
                      ) : (
                        <span className="text-muted text-sm">-</span>
                      )}
                    </td>
                    <td className="text-right text-muted text-sm">
                      {timeAgo(prop.last_updated_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <div className="text-sm text-muted">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 bg-surface-hover rounded text-sm text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-border transition-colors"
              >
                Previous
              </button>
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const start = Math.max(
                  1,
                  Math.min(page - 2, pagination.totalPages - 4)
                );
                const p = start + i;
                if (p > pagination.totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      p === page
                        ? "bg-primary text-white"
                        : "bg-surface-hover text-foreground hover:bg-border"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setPage(Math.min(pagination.totalPages, page + 1))
                }
                disabled={page === pagination.totalPages}
                className="px-3 py-1.5 bg-surface-hover rounded text-sm text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-border transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
