// ─────────────────────────────────────────────────────────────────────────────
// CategoryBreakdownChart
// ─────────────────────────────────────────────────────────────────────────────
// Recharts PieChart over spend by category for the selected date range.
// Each slice is coloured from the Notion sticker palette cycling in order.
// A companion legend table lists categoryName / amount / percentage.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format.utils";
import { useGetCategoryBreakdown } from "@/hooks/react-query/analytics/get-category-breakdown.hook";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

// ─────── Brand sticker palette (cycling) ─────────────────────────────────────

const SLICE_COLORS = [
  "#62aef0", // sky
  "#d6b6f6", // purple
  "#ff64c8", // pink
  "#2a9d99", // teal
  "#1aae39", // green
  "#dd5b00", // orange
  "#391c57", // purple-deep
  "#523410", // brown
];

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  params?: IAnalyticsParams;
}

// ─────── Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { percentage: number } }[];
}) => {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div className="rounded-md border border-hairline bg-canvas px-3 py-2 shadow-level-1 text-body-sm">
      <p className="font-medium text-foreground">{name}</p>
      <p className="text-ink-muted">{formatCurrency(value)} · {p.percentage.toFixed(1)}%</p>
    </div>
  );
};

// ─────── Component ───────────────────────────────────────────────────────────

const CategoryBreakdownChart = ({ params }: Props) => {
  const { categories, isLoading } = useGetCategoryBreakdown(params);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-body-sm text-ink-muted">
            No expense data for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pie */}
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={categories}
              dataKey="total"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
            >
              {categories.map((_, i) => (
                <Cell
                  key={i}
                  fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend table */}
        <div className="space-y-1.5">
          {categories.map((cat, i) => (
            <div key={cat.categoryId ?? cat.categoryName} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
              />
              <span className="flex-1 truncate text-body-sm text-foreground">
                {cat.categoryName}
              </span>
              <span className="text-caption text-ink-muted">{cat.percentage.toFixed(1)}%</span>
              <span className="text-body-sm tabular-nums text-foreground">
                {formatCurrency(cat.total)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownChart;
