// ─────────────────────────────────────────────────────────────────────────────
// AccountWiseBreakdown
// ─────────────────────────────────────────────────────────────────────────────
// Table showing per-account current balance, period spend, period income, and
// transaction count for the selected date range.
// ─────────────────────────────────────────────────────────────────────────────

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AccountTypeIcon from "@/components/accounts/AccountTypeIcon";
import { formatCurrency } from "@/utils/format.utils";
import { useGetAccountWiseView } from "@/hooks/react-query/analytics/get-account-wise-view.hook";
import { EAccountType } from "@/types/global.types";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  params?: IAnalyticsParams;
}

// ─────── Component ───────────────────────────────────────────────────────────

const AccountWiseBreakdown = ({ params }: Props) => {
  const { accounts, isLoading } = useGetAccountWiseView(params);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-5 w-40" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Account Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-body-sm text-ink-muted">
            No account data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Account Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Header row */}
        <div className="mb-2 grid grid-cols-5 gap-2 px-1 text-caption font-medium text-ink-muted">
          <span className="col-span-2">Account</span>
          <span className="text-right">Balance</span>
          <span className="text-right">Spent</span>
          <span className="text-right">Txns</span>
        </div>

        <div className="space-y-1">
          {accounts.map((acc, i) => (
            <div
              key={acc.accountId ?? i}
              className="grid grid-cols-5 items-center gap-2 rounded-lg bg-muted/40 px-2 py-2.5"
            >
              {/* Name + icon */}
              <div className="col-span-2 flex items-center gap-2 min-w-0">
                <AccountTypeIcon
                  type={acc.accountType?.toUpperCase() as EAccountType}
                  size={14}
                />
                <span className="truncate text-body-sm font-medium text-foreground">
                  {acc.accountName}
                </span>
              </div>

              {/* Balance */}
              <span
                className={`text-right text-body-sm tabular-nums ${
                  acc.currentBalance < 0 ? "text-destructive" : "text-foreground"
                }`}
              >
                {formatCurrency(acc.currentBalance)}
              </span>

              {/* Spent */}
              <span className="text-right text-body-sm tabular-nums text-destructive">
                {formatCurrency(acc.totalSpent)}
              </span>

              {/* Transaction count */}
              <span className="text-right text-caption text-ink-muted">
                {acc.transactionCount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountWiseBreakdown;
