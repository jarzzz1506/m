export function formatPrice(price: number, currency = "AED"): string {
  if (price >= 1_000_000) {
    return `${currency} ${(price / 1_000_000).toFixed(2)}M`;
  }
  if (price >= 1_000) {
    return `${currency} ${(price / 1_000).toFixed(0)}K`;
  }
  return `${currency} ${price.toLocaleString()}`;
}

export function formatPriceExact(price: number, currency = "AED"): string {
  return `${currency} ${price.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function formatChange(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateStr);
}
