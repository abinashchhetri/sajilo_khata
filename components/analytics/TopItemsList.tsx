// ─────────────────────────────────────────────────────────────────────────────
// TopItemsList
// ─────────────────────────────────────────────────────────────────────────────
// Ranked list of most-spent-on line-item names for the selected period.
// Clicking a row raises the item name to the parent so ItemTrendChart can
// plot that item's monthly trend.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format.utils";
import { useGetTopItems } from "@/hooks/react-query/analytics/get-top-items.hook";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  params?: IAnalyticsParams;
  selectedItem: string | null;
  onSelectItem: (name: string | null) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const TopItemsList = ({ params, selectedItem, onSelectItem }: Props) => {
  const { items, isLoading } = useGetTopItems(params);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-2 p-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-body-sm text-ink-muted">
            No line-item data for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Top Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {items.map((item, i) => {
          const isSelected = selectedItem === item.itemName;
          return (
            <button
              key={item.itemName}
              type="button"
              onClick={() => onSelectItem(isSelected ? null : item.itemName)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                isSelected
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/50 text-foreground",
              )}
            >
              {/* Rank */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-ink-muted",
                )}
              >
                {i + 1}
              </span>

              {/* Name */}
              <span className="flex-1 truncate text-body-sm font-medium capitalize">
                {item.itemName}
              </span>

              {/* Count */}
              <span className="text-caption text-ink-muted">{item.count}×</span>

              {/* Total */}
              <span className="text-body-sm tabular-nums font-medium">
                {formatCurrency(item.total)}
              </span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default TopItemsList;
