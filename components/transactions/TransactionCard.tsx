// ─────────────────────────────────────────────────────────────────────────────
// TransactionCard
// ─────────────────────────────────────────────────────────────────────────────
// Displays a single transaction row with header, optional note, and line items.
// in_transit transactions are visually muted — they represent pass-through
// money that does not affect personal balance, so they should not read as
// regular income or expense.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import TransactionHeader from "@/components/transactions/TransactionHeader";
import LineItemsList from "@/components/transactions/LineItemsList";
import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";
import type { ITransaction } from "@/types/transactions/transactions.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  transaction: ITransaction;
}

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionCard = ({ transaction }: Props) => {
  // in_transit transactions never affect personal balance — show a muted style
  // so the user can visually distinguish pass-through money from real spend
  const isInTransit = transaction.type === "in_transit";

  return (
    <Link href={ROUTES.TRANSACTION_DETAIL(transaction.id)} className="block">
      <Card
        className={cn(
          "transition-shadow hover:shadow-md",
          isInTransit && "opacity-60",
        )}
      >
        <CardContent className="p-4">
          <TransactionHeader transaction={transaction} />

          {transaction.note && (
            <p className="mt-2 text-xs text-muted-foreground italic">
              {transaction.note}
            </p>
          )}

          {/* Line items — only rendered for expense/income; in_transit has none */}
          {transaction.lineItems.length > 0 && (
            <LineItemsList items={transaction.lineItems} />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default TransactionCard;
