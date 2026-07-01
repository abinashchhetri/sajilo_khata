// ─────────────────────────────────────────────────────────────────────────────
// Date Utilities
// ─────────────────────────────────────────────────────────────────────────────
// Pure date formatting and range helpers. All functions accept either a Date
// object or an ISO date string so callers don't need to pre-convert.
// getMonthRange() is the primary driver for analytics query defaults — it
// returns ISO date strings that feed directly into IDateRangeFilter params.
// ─────────────────────────────────────────────────────────────────────────────

import {
  format,
  formatDistanceToNow,
  startOfMonth,
  endOfMonth,
} from "date-fns";

// "15 Jan 2025"
export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "dd MMM yyyy");
};

// "15 Jan 2025, 3:30 PM"
export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), "dd MMM yyyy, h:mm a");
};

// "3 hours ago", "2 days ago", etc.
export const getRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

// Returns the ISO date-string boundaries of a given month (defaults to current
// month). The strings land in backend query params as-is — backend expects
// "yyyy-MM-dd" for date range filters.
export const getMonthRange = (
  date?: Date,
): { startDate: string; endDate: string } => {
  const target = date ?? new Date();
  return {
    startDate: format(startOfMonth(target), "yyyy-MM-dd"),
    endDate: format(endOfMonth(target), "yyyy-MM-dd"),
  };
};
