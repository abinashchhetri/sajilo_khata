// ─────────────────────────────────────────────────────────────────────────────
// TransferList
// ─────────────────────────────────────────────────────────────────────────────
// Renders all transfers for the current user. Fetches accounts once and passes
// them to each TransferCard so names can be resolved without per-card fetches.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { ArrowLeftRight } from "lucide-react";

import TransferCard from "@/components/transfers/TransferCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTransfers } from "@/hooks/react-query/transfers/get-transfers.hook";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import type { IFindAllTransfersParams } from "@/types/transfers/transfers.types";
import type { IAccount } from "@/types/accounts/accounts.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  filters?: IFindAllTransfersParams;
}

// ─────── Helpers ─────────────────────────────────────────────────────────────

const SkeletonRows = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full rounded-xl" />
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
    <ArrowLeftRight size={40} strokeWidth={1.25} />
    <p className="text-sm">No transfers yet</p>
  </div>
);

// ─────── Component ───────────────────────────────────────────────────────────

const TransferList = ({ filters }: Props) => {
  const { transfers, isLoading } = useGetTransfers(filters);
  // Accounts come from cache (already fetched by the accounts page or dashboard)
  const { accounts } = useGetAccounts();
  const allAccounts: IAccount[] = accounts ?? [];

  if (isLoading) return <SkeletonRows />;
  if (!transfers.length) return <EmptyState />;

  return (
    <div className="space-y-3">
      {transfers.map((t) => (
        <TransferCard key={t.id} transfer={t} accounts={allAccounts} />
      ))}
    </div>
  );
};

export default TransferList;
