"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionFilters, {
  type TransactionFilterState,
} from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useHandleCreateTransaction } from "@/hooks/react-query/transactions/post-transaction.hook";
import type { TCreateTransaction } from "@/lib/validations/create-transaction.validation";

// ─────── Component ───────────────────────────────────────────────────────────

const EMPTY_FILTERS: TransactionFilterState = {};

const TransactionsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilterState>(EMPTY_FILTERS);

  const { handleCreateTransaction, isPending } = useHandleCreateTransaction();

  const handleFilterChange = (next: TransactionFilterState) => setFilters(next);
  const handleReset = () => setFilters(EMPTY_FILTERS);

  const handleSubmit = async (data: TCreateTransaction) => {
    await handleCreateTransaction({ ...data, entryMethod: "form" });
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Your spending, income, and in-transit records
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* List */}
      <TransactionsList filters={filters} />

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onSubmit={handleSubmit} isPending={isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
