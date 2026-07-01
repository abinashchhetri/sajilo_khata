// ─────────────────────────────────────────────────────────────────────────────
// Analytics Page
// ─────────────────────────────────────────────────────────────────────────────
// Assembles all analytics components under a single shared DateRangePicker.
// The range is held here and passed down so every chart always shows the same
// period — they never fetch independently with their own range state.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";

import DateRangePicker from "@/components/analytics/DateRangePicker";
import DashboardSummaryCards from "@/components/analytics/DashboardSummaryCards";
import CategoryBreakdownChart from "@/components/analytics/CategoryBreakdownChart";
import AccountWiseBreakdown from "@/components/analytics/AccountWiseBreakdown";
import TopItemsList from "@/components/analytics/TopItemsList";
import ItemTrendChart from "@/components/analytics/ItemTrendChart";
import NetWorthCard from "@/components/analytics/NetWorthCard";
import { getMonthRange } from "@/utils/date.utils";
import type { IDateRangeFilter } from "@/types/global.types";

// ─────── Component ───────────────────────────────────────────────────────────

const AnalyticsPage = () => {
  const [range, setRange] = useState<IDateRangeFilter>(getMonthRange);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-heading-3 text-foreground">Analytics</h1>
        <p className="text-body-sm text-ink-muted">
          Spending patterns, category breakdown, and net worth at a glance.
        </p>
      </div>

      {/* Shared date-range control — drives every chart below */}
      <DateRangePicker range={range} onRangeChange={setRange} />

      {/* Summary stat tiles */}
      <DashboardSummaryCards params={range} />

      {/* Two-column grid: category pie + account table */}
      <div className="grid gap-4 lg:grid-cols-2">
        <CategoryBreakdownChart params={range} />
        <AccountWiseBreakdown params={range} />
      </div>

      {/* Net worth — always current snapshot, no date-range */}
      <NetWorthCard />

      {/* Top items list + item trend chart side-by-side */}
      <div className="grid gap-4 lg:grid-cols-2">
        <TopItemsList
          params={range}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
        />

        {selectedItem ? (
          <ItemTrendChart itemName={selectedItem} params={range} />
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-hairline p-8 text-center text-body-sm text-ink-muted lg:min-h-48">
            Select an item from the list to see its monthly trend.
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
