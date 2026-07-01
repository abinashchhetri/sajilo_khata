// ─────────────────────────────────────────────────────────────────────────────
// Category Utilities
// ─────────────────────────────────────────────────────────────────────────────
// Pure lookups for category display — icon component and color by category name.
// System categories have predefined entries; custom categories fall back to
// the category's own color field, then DEFAULT_CATEGORY_COLOR.
// ─────────────────────────────────────────────────────────────────────────────

import { CircleDollarSign } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  CATEGORY_ICON_MAP,
  CATEGORY_COLOR_MAP,
  DEFAULT_CATEGORY_COLOR,
  ICON_OPTIONS,
} from "@/lib/constants/category.constants";

// Returns the Lucide icon component for a category by name.
// System categories use the predefined map; custom categories fall back to the
// icon name stored on the backend (matched against ICON_OPTIONS), then CircleDollarSign.
export const getCategoryIcon = (
  categoryName: string,
  iconName?: string,
): LucideIcon => {
  if (CATEGORY_ICON_MAP[categoryName]) return CATEGORY_ICON_MAP[categoryName];
  if (iconName) {
    const match = ICON_OPTIONS.find((o) => o.name === iconName);
    if (match) return match.component;
  }
  return CircleDollarSign;
};

// Returns the display color for a category.
// System categories use predefined colors; custom categories use their stored
// color field (passed as fallback), or DEFAULT_CATEGORY_COLOR as last resort.
export const getCategoryColor = (
  categoryName: string,
  fallback = DEFAULT_CATEGORY_COLOR,
): string => {
  return CATEGORY_COLOR_MAP[categoryName] ?? fallback;
};
