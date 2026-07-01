// ─────────────────────────────────────────────────────────────────────────────
// TransactionsList
// ─────────────────────────────────────────────────────────────────────────────
// Append-only transaction ledger for one investment, shown newest first.
// For NEPSE holdings, a running "Remaining" column is computed client-side by
// anchoring to the investment's current quantity (the most recent transaction's
// remaining = current metadata.quantity) and walking backwards through older
// rows, reversing each transaction's effect on share count.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";
import { useGetInvestmentTransactions } from "@/hooks/react-query/investments/get-investment-transactions.hook";
import { useHandleCreateInvestmentTransaction } from "@/hooks/react-query/investments/post-investment-transaction.hook";
import type {
  IInvestment,
  IInvestmentTransaction,
  INepseMetadata,
} from "@/types/investments/investments.types";

// ─────── Constants ───────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

const TYPE_LABEL: Record<IInvestmentTransaction["transactionType"], string> = {
  buy: "Buy",
  sell: "Sell",
  dividend: "Dividend",
  bonus: "Bonus",
};

// ─────── Add-transaction form schema ─────────────────────────────────────────

const AddTransactionSchema = z.object({
  transactionType: z.enum(["buy", "sell", "dividend", "bonus"] as const),
  quantity: z.coerce.number().positive("Must be greater than 0"),
  pricePerUnit: z.coerce.number().min(0, "Must be 0 or greater"),
  date: z.string().min(1, "Date is required"),
  note: z.string().trim().optional(),
});

type TAddTransaction = z.infer<typeof AddTransactionSchema>;

const todayInputValue = () => format(new Date(), "yyyy-MM-dd");

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  investment: IInvestment;
}

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionsList = ({ investment }: Props) => {
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState<IInvestmentTransaction[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { transactions, hasNextPage, isLoading, isFetching } =
    useGetInvestmentTransactions(investment.id, { page, limit: PAGE_SIZE });
  const { handleCreateInvestmentTransaction, isPending: isCreating } =
    useHandleCreateInvestmentTransaction(investment.id);

  // Reset the accumulator whenever the investment changes
  useEffect(() => {
    setPage(1);
    setLoaded([]);
  }, [investment.id]);

  // Append each newly-fetched page, de-duped by id
  useEffect(() => {
    if (transactions.length === 0) return;
    setLoaded((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const fresh = transactions.filter((t) => !existingIds.has(t.id));
      return fresh.length > 0 ? [...prev, ...fresh] : prev;
    });
  }, [transactions]);

  const showRemaining = investment.type === "nepse";

  const remainingById = useMemo(() => {
    const map = new Map<string, number>();
    if (!showRemaining) return map;

    const currentQuantity = (investment.metadata as INepseMetadata).quantity;
    let running = currentQuantity;
    loaded.forEach((tx, i) => {
      if (i > 0) {
        const prev = loaded[i - 1];
        const prevEffect =
          prev.transactionType === "buy" || prev.transactionType === "bonus"
            ? prev.quantity
            : prev.transactionType === "sell"
              ? -prev.quantity
              : 0;
        running -= prevEffect;
      }
      map.set(tx.id, running);
    });
    return map;
  }, [loaded, showRemaining, investment.metadata]);

  const form = useForm<TAddTransaction>({
    resolver: zodResolver(AddTransactionSchema),
    defaultValues: {
      transactionType: "buy",
      quantity: undefined,
      pricePerUnit: undefined,
      date: todayInputValue(),
      note: "",
    },
  });

  const handleSubmit = async (data: TAddTransaction) => {
    await handleCreateInvestmentTransaction({
      transactionType: data.transactionType,
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      date: data.date,
      ...(data.note ? { note: data.note } : {}),
    });
    form.reset({
      transactionType: data.transactionType,
      quantity: undefined,
      pricePerUnit: undefined,
      date: todayInputValue(),
      note: "",
    });
    setIsAddOpen(false);
    setPage(1);
    setLoaded([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Transaction History</p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus size={14} />
          Add
        </Button>
      </div>

      {isLoading && loaded.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : loaded.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">
          No transactions recorded yet
        </p>
      ) : (
        <div className="space-y-1.5">
          <div
            className={cn(
              "grid gap-2 px-2 text-xs font-medium text-muted-foreground",
              showRemaining ? "grid-cols-5" : "grid-cols-4",
            )}
          >
            <span>Date</span>
            <span>Type</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Price</span>
            {showRemaining && <span className="text-right">Remaining</span>}
          </div>

          {loaded.map((tx) => (
            <div
              key={tx.id}
              className={cn(
                "grid items-center gap-2 rounded-lg bg-muted/40 px-2 py-2 text-xs",
                showRemaining ? "grid-cols-5" : "grid-cols-4",
              )}
            >
              <span className="text-muted-foreground">
                {format(new Date(tx.date), "d MMM yyyy")}
              </span>
              <span className="flex items-center gap-1 font-medium">
                {tx.transactionType === "sell" ? (
                  <TrendingDown size={11} className="text-destructive" />
                ) : tx.transactionType === "dividend" ? (
                  <Minus size={11} className="text-muted-foreground" />
                ) : (
                  <TrendingUp size={11} className="text-accent-green" />
                )}
                {TYPE_LABEL[tx.transactionType]}
              </span>
              <span className="text-right tabular-nums">{tx.quantity}</span>
              <span className="text-right tabular-nums">
                {formatCurrency(tx.pricePerUnit)}
              </span>
              {showRemaining && (
                <span className="text-right font-medium tabular-nums">
                  {remainingById.get(tx.id) ?? "—"}
                </span>
              )}
            </div>
          ))}

          {hasNextPage && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full"
              disabled={isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              {isFetching ? "Loading…" : "Load more"}
            </Button>
          )}
        </div>
      )}

      {/* Add transaction dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="transactionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                        <SelectItem value="dividend">Dividend</SelectItem>
                        <SelectItem value="bonus">Bonus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="1"
                          placeholder="0"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pricePerUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price / Unit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any additional notes…"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? "Saving…" : "Save Transaction"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsList;
