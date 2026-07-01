"use client";

import { ReceiptText } from "lucide-react";

import TransactionCard from "@/components/transactions/TransactionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransactions } from "@/hooks/react-query/transactions/get-transactions.hook";
import type { IFindAllTransactionsParams } from "@/types/transactions/transactions.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  filters: IFindAllTransactionsParams;
}

// ─────── Helpers ─────────────────────────────────────────────────────────────

const SkeletonRows = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-20 w-full rounded-xl" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
    <ReceiptText size={40} strokeWidth={1.25} />
    <p className="text-sm">No transactions found</p>
  </div>
);

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionsList = ({ filters }: Props) => {
  const { transactions, isLoading } = useGetTransactions(filters);

  if (isLoading) return <SkeletonRows />;
  if (!transactions.length) return <EmptyState />;

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <TransactionCard key={t.id} transaction={t} />
      ))}
    </div>
  );
};

export default TransactionsList;
