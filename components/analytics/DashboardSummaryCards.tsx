// ─────────────────────────────────────────────────────────────────────────────
// DashboardSummaryCards
// ─────────────────────────────────────────────────────────────────────────────
// Four stat tiles: total spent, total income, net savings, savings rate.
// All numbers come from the backend's aggregation for the selected date range.
// ─────────────────────────────────────────────────────────────────────────────

import { TrendingDown, TrendingUp, PiggyBank, Percent } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format.utils";
import { useGetDashboard } from "@/hooks/react-query/analytics/get-dashboard.hook";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  params?: IAnalyticsParams;
}

// ─────── Stat tile config ────────────────────────────────────────────────────

const TILES = [
  {
    key: "totalSpent" as const,
    label: "Total Spent",
    icon: TrendingDown,
    format: (v: number) => formatCurrency(v),
    colorClass: "text-destructive",
    bgClass: "bg-destructive/10",
  },
  {
    key: "totalIncome" as const,
    label: "Total Income",
    icon: TrendingUp,
    format: (v: number) => formatCurrency(v),
    colorClass: "text-accent-green",
    bgClass: "bg-accent-green/10",
  },
  {
    key: "netSavings" as const,
    label: "Net Savings",
    icon: PiggyBank,
    format: (v: number) => formatCurrency(v),
    colorClass: (v: number) => (v >= 0 ? "text-accent-green" : "text-destructive"),
    bgClass: (v: number) => (v >= 0 ? "bg-accent-green/10" : "bg-destructive/10"),
  },
  {
    key: "savingsRate" as const,
    label: "Savings Rate",
    icon: Percent,
    format: (v: number) => `${v.toFixed(1)}%`,
    colorClass: (v: number) => (v >= 0 ? "text-accent-green" : "text-destructive"),
    bgClass: (v: number) => (v >= 0 ? "bg-accent-green/10" : "bg-destructive/10"),
  },
] as const;

// ─────── Component ───────────────────────────────────────────────────────────

const DashboardSummaryCards = ({ params }: Props) => {
  const { summary, isLoading } = useGetDashboard(params);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TILES.map(({ key, label, icon: Icon, format, colorClass, bgClass }) => {
        const value = summary[key];
        const color = typeof colorClass === "function" ? colorClass(value) : colorClass;
        const bg = typeof bgClass === "function" ? bgClass(value) : bgClass;

        return (
          <Card key={key}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                  <Icon size={15} className={color} />
                </div>
                <span className="text-caption text-ink-muted">{label}</span>
              </div>
              <p className={`mt-2 text-title tabular-nums ${color}`}>
                {format(value)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardSummaryCards;
