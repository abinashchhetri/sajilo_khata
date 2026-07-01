// ─────────────────────────────────────────────────────────────────────────────
// InvestmentCard
// ─────────────────────────────────────────────────────────────────────────────
// Displays one investment: name, type badge, invested/current amounts, and the
// backend-computed gainLoss (green when ≥ 0, destructive when < 0).
// Three icon buttons: update value (RefreshCw), edit (Pencil), delete (Trash2).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Pencil,
  RefreshCw,
  Trash2,
  History,
  ChevronUp,
  Banknote,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";
import UpdateValueDialog from "@/components/investments/UpdateValueDialog";
import SellDialog from "@/components/investments/SellDialog";
import TransactionsList from "@/components/investments/TransactionsList";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useHandleDeleteInvestment } from "@/hooks/react-query/investments/delete-investment.hook";
import type { IInvestment } from "@/types/investments/investments.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  investment: IInvestment;
  onEdit: (investment: IInvestment) => void;
}

// ─────── Helpers ─────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  nepse: "NEPSE",
  sip: "SIP",
  fd: "FD",
};

// ─────── Component ───────────────────────────────────────────────────────────

const InvestmentCard = ({ investment, onEdit }: Props) => {
  const [isUpdateValueOpen, setIsUpdateValueOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { handleDeleteInvestment, isPending: isDeleting } =
    useHandleDeleteInvestment();

  const isGain = investment.gainLoss >= 0;
  const isNepse = investment.type === "nepse";
  const showHistoryToggle = isNepse;
  const showSellAction = isNepse && investment.isActive;
  const isClosed = !investment.isActive;

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            {/* Left: name + stats */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium">
                  {investment.name}
                </span>
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {TYPE_LABEL[investment.type]}
                </span>
                {isClosed && (
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                    Closed
                  </span>
                )}
              </div>

              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Invested</p>
                  <p className="font-medium tabular-nums">
                    {formatCurrency(investment.investedAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current</p>
                  <p className="font-medium tabular-nums">
                    {formatCurrency(investment.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gain/Loss</p>
                  <p
                    className={cn(
                      "flex items-center gap-0.5 font-semibold tabular-nums",
                      isGain ? "text-accent-green" : "text-destructive",
                    )}
                  >
                    {isGain ? (
                      <TrendingUp size={11} />
                    ) : (
                      <TrendingDown size={11} />
                    )}
                    {formatCurrency(Math.abs(investment.gainLoss))}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex shrink-0 flex-col gap-1">
              {showHistoryToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Transaction history"
                  onClick={() => setIsHistoryOpen((open) => !open)}
                >
                  {isHistoryOpen ? (
                    <ChevronUp size={13} />
                  ) : (
                    <History size={13} />
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Update current value"
                onClick={() => setIsUpdateValueOpen(true)}
              >
                <RefreshCw size={13} />
              </Button>
              {showSellAction && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  title="Sell shares"
                  onClick={() => setIsSellOpen(true)}
                >
                  <Banknote size={13} />
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(investment)}
              >
                <Pencil size={13} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </div>

          {isHistoryOpen && (
            <div className="mt-4 border-t pt-4">
              <TransactionsList investment={investment} />
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateValueDialog
        investment={investment}
        open={isUpdateValueOpen}
        onOpenChange={setIsUpdateValueOpen}
      />

      {showSellAction && (
        <SellDialog
          investment={investment}
          open={isSellOpen}
          onOpenChange={setIsSellOpen}
        />
      )}

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete investment?"
        description="This will permanently remove the investment and all its value history. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => handleDeleteInvestment(investment.id)}
        isPending={isDeleting}
      />
    </>
  );
};

export default InvestmentCard;
