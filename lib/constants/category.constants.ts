// ─────────────────────────────────────────────────────────────────────────────
// Category Constants
// ─────────────────────────────────────────────────────────────────────────────
// Icon and color metadata for the eight seeded system categories.
// getCategoryIcon / getCategoryColor in utils/category.utils.ts use these maps.
// Custom categories not listed here fall back to DEFAULT_CATEGORY_COLOR and
// the CircleDollarSign icon.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ShoppingBasket,
  Utensils,
  Car,
  Zap,
  HeartPulse,
  Tv,
  ShoppingBag,
  CircleEllipsis,
  Star,
  Home,
  Briefcase,
  Plane,
  Gift,
  BookOpen,
  Dumbbell,
  Music,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Maps system category names → Lucide icon components.
// Used by getCategoryIcon; keyed by exact backend category name strings.
export const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "Food & Groceries": ShoppingBasket,
  "Dining Out": Utensils,
  "Transport": Car,
  "Utilities": Zap,
  "Health": HeartPulse,
  "Entertainment": Tv,
  "Shopping": ShoppingBag,
  "Miscellaneous": CircleEllipsis,
};

// Maps system category names → hex brand colors.
// Used by getCategoryColor.
export const CATEGORY_COLOR_MAP: Record<string, string> = {
  "Food & Groceries": "#22c55e",
  "Dining Out": "#f97316",
  "Transport": "#3b82f6",
  "Utilities": "#eab308",
  "Health": "#ef4444",
  "Entertainment": "#8b5cf6",
  "Shopping": "#ec4899",
  "Miscellaneous": "#6b7280",
};

// Fallback color for custom categories that have not set their own color.
export const DEFAULT_CATEGORY_COLOR = "#6b7280";

// Selectable icons for custom category forms — a curated subset of Lucide icons.
// Each entry is { name: string (sent to backend), component: LucideIcon }.
export const ICON_OPTIONS: { name: string; component: LucideIcon }[] = [
  { name: "star", component: Star },
  { name: "home", component: Home },
  { name: "briefcase", component: Briefcase },
  { name: "plane", component: Plane },
  { name: "gift", component: Gift },
  { name: "book-open", component: BookOpen },
  { name: "dumbbell", component: Dumbbell },
  { name: "music", component: Music },
  { name: "shopping-bag", component: ShoppingBag },
  { name: "zap", component: Zap },
];

// Color swatches offered in the custom category form.
export const COLOR_OPTIONS: string[] = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
  "#78716c", // stone
];
