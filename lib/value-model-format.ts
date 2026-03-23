/** Directional business-value display helpers — not accounting-grade. */

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function formatCurrencyCompact(value: number): string {
  const n = Math.round(value);
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString("en-US")}`;
}

export function formatCurrencyInput(value: number): string {
  if (!Number.isFinite(value)) return "";
  return Math.round(value).toLocaleString("en-US");
}

export function parseCurrencyInput(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (cleaned === "" || cleaned === "-") return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatCount(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}
