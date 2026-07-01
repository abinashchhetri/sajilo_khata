// ─────────────────────────────────────────────────────────────────────────────
// Global Types
// ─────────────────────────────────────────────────────────────────────────────
// Shared types and interfaces used across two or more feature areas.
// If a type is only ever used in one feature, it belongs in that feature's
// types file, not here.
// ─────────────────────────────────────────────────────────────────────────────

// Dropdown/select option shape used in multiple forms
export interface TSelectOption {
  label: string;
  value: string;
}

// Date range filter shape — used by transactions, transfers, and analytics
export interface IDateRangeFilter {
  startDate?: string;
  endDate?: string;
}

// Account type enum — values must match the backend AccountTypeEnum exactly.
// EAccountType is the source of truth; TAccountType is an alias so existing
// type annotations don't need to change across feature files.
export enum EAccountType {
  CASH = "CASH",
  BANK = "BANK",
  ESEWA = "ESEWA",
  KHALTI = "KHALTI",
}

export type TAccountType = EAccountType;

// Sorting direction used in query params
export type TSortDirection = "ASC" | "DESC";
