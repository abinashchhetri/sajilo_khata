// ─────────────────────────────────────────────────────────────────────────────
// Format Utilities
// ─────────────────────────────────────────────────────────────────────────────
// Generic formatting helpers for currency, numbers, and percentages.
// All currency is NPR — no multi-currency support in this app.
// ─────────────────────────────────────────────────────────────────────────────

// Formats a number as NPR currency — 1500 → "Rs. 1,500.00"
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    currencyDisplay: "symbol",
  }).format(amount);
};

// Formats a percentage with one decimal — 12.345 → "12.3%"
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Truncates a long item name for display in compact UI like list rows
export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
};
