// ─────────────────────────────────────────────────────────────────────────────
// CategoryBadge
// ─────────────────────────────────────────────────────────────────────────────
// Compact colored pill showing the category icon and name.
// Used in transaction rows, analytics breakdowns, and anywhere else a category
// needs an inline label. Color and icon are derived from the category name for
// system categories; custom categories fall back to their own stored color.
// ─────────────────────────────────────────────────────────────────────────────

import { getCategoryIcon, getCategoryColor } from "@/utils/category.utils";
import type { ICategory } from "@/types/categories/categories.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  category: Pick<ICategory, "name" | "icon" | "color">;
  className?: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const CategoryBadge = ({ category, className }: Props) => {
  const Icon = getCategoryIcon(category.name, category.icon);
  // Use stored color as fallback so custom categories show their chosen color
  const color = getCategoryColor(category.name, category.color);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className ?? ""}`}
      style={{
        backgroundColor: `${color}20`,
        color,
      }}
    >
      <Icon size={11} aria-hidden />
      {category.name}
    </span>
  );
};

export default CategoryBadge;
