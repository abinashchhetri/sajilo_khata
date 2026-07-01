// ─────────────────────────────────────────────────────────────────────────────
// LineItemsList
// ─────────────────────────────────────────────────────────────────────────────
// Read-only list of line items within a transaction. Shown in TransactionCard
// and the transaction detail page. Each row is name + amount — no editing here,
// the correct flow for a mistake is delete-and-recreate.
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/utils/format.utils";
import { truncate } from "@/utils/format.utils";
import type { ILineItem } from "@/types/transactions/transactions.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  items: ILineItem[];
}

// ─────── Component ───────────────────────────────────────────────────────────

const LineItemsList = ({ items }: Props) => (
  <div className="mt-2 space-y-1 border-t pt-2">
    {items.map((item) => (
      <div key={item.id} className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {truncate(item.name, 40)}
        </span>
        <span className="shrink-0 text-xs tabular-nums">
          {formatCurrency(item.amount)}
        </span>
      </div>
    ))}
  </div>
);

export default LineItemsList;
