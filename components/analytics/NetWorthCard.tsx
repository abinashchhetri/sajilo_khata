// ─────────────────────────────────────────────────────────────────────────────
// NetWorthCard
// ─────────────────────────────────────────────────────────────────────────────
// Combines total account balances + investment current value into a single
// net-worth figure. Not date-range scoped — always shows current snapshot.
// ─────────────────────────────────────────────────────────────────────────────

import { Landmark } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format.utils";
import { useGetNetWorth } from "@/hooks/react-query/analytics/get-net-worth.hook";

// ─────── Component ───────────────────────────────────────────────────────────

const NetWorthCard = () => {
  const { netWorth, isLoading } = useGetNetWorth();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-40" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!netWorth) return null;

  const isPositive = netWorth.netWorth >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Landmark size={15} className="text-ink-muted" />
          <CardTitle className="text-base">Net Worth</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total */}
        <div>
          <p className="text-caption text-ink-muted">Total</p>
          <p
            className={`text-heading-2 tabular-nums ${
              isPositive ? "text-foreground" : "text-destructive"
            }`}
          >
            {formatCurrency(netWorth.netWorth)}
          </p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-caption text-ink-muted">Accounts</p>
            <p
              className={`mt-0.5 text-title tabular-nums ${
                netWorth.totalAccountBalance < 0 ? "text-destructive" : "text-foreground"
              }`}
            >
              {formatCurrency(netWorth.totalAccountBalance)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-caption text-ink-muted">Investments</p>
            <p className="mt-0.5 text-title tabular-nums text-foreground">
              {formatCurrency(netWorth.totalInvestmentValue)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthCard;
