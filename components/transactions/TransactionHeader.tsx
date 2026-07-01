// ─────────────────────────────────────────────────────────────────────────────
// TransactionHeader
// ─────────────────────────────────────────────────────────────────────────────
// Top row of a transaction card: type badge, category badge, formatted total,
// and relative date. Used in both TransactionCard (list) and the detail page.
// ─────────────────────────────────────────────────────────────────────────────

import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from "lucide-react";

import CategoryBadge from "@/components/shared/CategoryBadge";
import { formatCurrency } from "@/utils/format.utils";
import { getRelativeTime } from "@/utils/date.utils";
import { cn } from "@/lib/utils";
import type { ITransaction } from "@/types/transactions/transactions.types";

// ─────── Config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  expense: {
    icon: ArrowDownLeft,
    label: "Expense",
    amountClass: "text-destructive",
    badgeClass: "bg-destructive/10 text-destructive",
  },
  income: {
    icon: ArrowUpRight,
    label: "Income",
    amountClass: "text-accent-green",
    badgeClass: "bg-accent-green/10 text-accent-green",
  },
  in_transit: {
    icon: ArrowLeftRight,
    label: "In transit",
    amountClass: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground",
  },
} as const;

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  transaction: Pick<
    ITransaction,
    "type" | "totalAmount" | "category" | "transactedAt"
  >;
}

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionHeader = ({ transaction }: Props) => {
  const { type, totalAmount, category, transactedAt } = transaction;
  const config = TYPE_CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start justify-between gap-3">
      {/* Left: type badge + optional category */}
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              config.badgeClass,
            )}
          >
            <Icon size={11} aria-hidden />
            {config.label}
          </span>
          {category && <CategoryBadge category={category} />}
        </div>
        <span className="text-xs text-muted-foreground">
          {getRelativeTime(transactedAt)}
        </span>
      </div>

      {/* Right: total */}
      <span
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          config.amountClass,
        )}
      >
        {type === "expense" ? "−" : type === "income" ? "+" : ""}
        {formatCurrency(totalAmount)}
      </span>
    </div>
  );
};

export default TransactionHeader;
