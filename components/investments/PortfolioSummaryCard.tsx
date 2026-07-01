// ─────────────────────────────────────────────────────────────────────────────
// PortfolioSummaryCard
// ─────────────────────────────────────────────────────────────────────────────
// Portfolio-level totals from the backend: totalInvested, totalCurrentValue,
// totalRealizedGainLoss, totalUnrealizedGainLoss, and a per-type breakdown row.
// Realized (locked in via sells) and unrealized (paper, on the open position)
// are always shown as two distinct, separately labeled numbers — never summed
// into one blended gain/loss figure. Neither is recomputed here; both come
// straight from the backend.
// ─────────────────────────────────────────────────────────────────────────────

import { TrendingUp, TrendingDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";
import { useGetPortfolioSummary } from "@/hooks/react-query/investments/get-portfolio-summary.hook";
import type { TInvestmentType } from "@/types/investments/investments.types";

// ─────── Helpers ─────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<TInvestmentType, string> = {
  nepse: "NEPSE",
  sip: "SIP",
  fd: "FD",
};

const signed = (value: number) => (value >= 0 ? "+" : "−");

// ─────── Component ───────────────────────────────────────────────────────────

const PortfolioSummaryCard = () => {
  const { summary, isLoading } = useGetPortfolioSummary();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-5 w-32" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) return null;

  const isRealizedGain = summary.totalRealizedGainLoss >= 0;
  const isUnrealizedGain = summary.totalUnrealizedGainLoss >= 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Portfolio Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Invested / Current */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Invested</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">
              {formatCurrency(summary.totalInvested)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Current</p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">
              {formatCurrency(summary.totalCurrentValue)}
            </p>
          </div>
        </div>

        {/* Realized / Unrealized — kept as two distinct tiles, never blended */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div
            className={cn(
              "rounded-lg p-3",
              isRealizedGain ? "bg-accent-green/10" : "bg-destructive/10",
            )}
          >
            <p className="text-xs text-muted-foreground">Realized G/L</p>
            <p
              className={cn(
                "mt-0.5 flex items-center justify-center gap-0.5 text-sm font-semibold tabular-nums",
                isRealizedGain ? "text-accent-green" : "text-destructive",
              )}
            >
              {isRealizedGain ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {signed(summary.totalRealizedGainLoss)}
              {formatCurrency(Math.abs(summary.totalRealizedGainLoss))}
            </p>
            <p className="text-[10px] text-muted-foreground">Locked in</p>
          </div>
          <div
            className={cn(
              "rounded-lg p-3",
              isUnrealizedGain ? "bg-accent-green/10" : "bg-destructive/10",
            )}
          >
            <p className="text-xs text-muted-foreground">Unrealized G/L</p>
            <p
              className={cn(
                "mt-0.5 flex items-center justify-center gap-0.5 text-sm font-semibold tabular-nums",
                isUnrealizedGain ? "text-accent-green" : "text-destructive",
              )}
            >
              {isUnrealizedGain ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {signed(summary.totalUnrealizedGainLoss)}
              {formatCurrency(Math.abs(summary.totalUnrealizedGainLoss))}
            </p>
            <p className="text-[10px] text-muted-foreground">On paper</p>
          </div>
        </div>

        {/* Per-type breakdown */}
        {summary.byType.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <div className="grid grid-cols-4 gap-2 px-1 text-[10px] font-medium text-muted-foreground">
              <span>Type</span>
              <span className="text-right">Current</span>
              <span className="text-right">Realized</span>
              <span className="text-right">Unrealized</span>
            </div>
            {summary.byType.map((row) => {
              const rowRealizedGain = row.totalRealizedGainLoss >= 0;
              const rowUnrealizedGain = row.totalUnrealizedGainLoss >= 0;
              return (
                <div
                  key={row.type}
                  className="grid grid-cols-4 items-center gap-2 px-1 text-xs"
                >
                  <span className="font-medium text-muted-foreground">
                    {TYPE_LABEL[row.type]}
                  </span>
                  <span className="text-right tabular-nums">
                    {formatCurrency(row.totalCurrentValue)}
                  </span>
                  <span
                    className={cn(
                      "text-right tabular-nums",
                      rowRealizedGain ? "text-accent-green" : "text-destructive",
                    )}
                  >
                    {signed(row.totalRealizedGainLoss)}
                    {formatCurrency(Math.abs(row.totalRealizedGainLoss))}
                  </span>
                  <span
                    className={cn(
                      "text-right tabular-nums",
                      rowUnrealizedGain ? "text-accent-green" : "text-destructive",
                    )}
                  >
                    {signed(row.totalUnrealizedGainLoss)}
                    {formatCurrency(Math.abs(row.totalUnrealizedGainLoss))}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioSummaryCard;
