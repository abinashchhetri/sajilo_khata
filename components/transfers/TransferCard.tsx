// ─────────────────────────────────────────────────────────────────────────────
// TransferCard
// ─────────────────────────────────────────────────────────────────────────────
// Displays a single transfer row: "From → To" with amount, date, and note.
// Account names are resolved from the accounts array passed by the parent
// (TransferList) — no additional fetch per card.
// ─────────────────────────────────────────────────────────────────────────────

import { format } from "date-fns";
import { ArrowRight, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format.utils";
import { useHandleDeleteTransfer } from "@/hooks/react-query/transfers/delete-transfer.hook";
import type { ITransfer } from "@/types/transfers/transfers.types";
import type { IAccount } from "@/types/accounts/accounts.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  transfer: ITransfer;
  accounts: IAccount[];
}

// ─────── Component ───────────────────────────────────────────────────────────

const TransferCard = ({ transfer, accounts }: Props) => {
  const { handleDeleteTransfer, isPending } = useHandleDeleteTransfer();

  const fromAccount = accounts.find((a) => a.id === transfer.fromAccountId);
  const toAccount = accounts.find((a) => a.id === transfer.toAccountId);

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span className="truncate">{fromAccount?.name ?? "—"}</span>
            <ArrowRight size={14} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{toAccount?.name ?? "—"}</span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{format(new Date(transfer.transferredAt ?? transfer.createdAt), "d MMM yyyy")}</span>
            {transfer.note && (
              <span className="italic">· {transfer.note}</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(transfer.amount)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => handleDeleteTransfer(transfer.id)}
            disabled={isPending}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferCard;
