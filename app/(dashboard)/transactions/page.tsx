"use client";

import { useState } from "react";
import toast from "react-hot-toast";
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
import VoiceRecordButton from "@/components/voice/VoiceRecordButton";
import ConfirmationCard from "@/components/voice/ConfirmationCard";
import { useHandleCreateTransaction } from "@/hooks/react-query/transactions/post-transaction.hook";
import { useGetAccountVoiceKeywords } from "@/hooks/react-query/accounts/get-account-voice-keywords.hook";
import { parseVoiceTranscript } from "@/utils/voice-parser.utils";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { TCreateTransaction } from "@/lib/validations/create-transaction.validation";
import type { TParsedVoiceEntry } from "@/types/transactions/transactions.types";

// ─────── Component ───────────────────────────────────────────────────────────

const EMPTY_FILTERS: TransactionFilterState = {};

const TransactionsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filters, setFilters] = useState<TransactionFilterState>(EMPTY_FILTERS);
  const [pendingVoice, setPendingVoice] = useState<TParsedVoiceEntry | null>(null);

  const { handleCreateTransaction, isPending } = useHandleCreateTransaction();
  const { accountKeywords } = useGetAccountVoiceKeywords();

  const handleFilterChange = (next: TransactionFilterState) => setFilters(next);
  const handleReset = () => setFilters(EMPTY_FILTERS);

  const handleSubmit = async (data: TCreateTransaction) => {
    await handleCreateTransaction({ ...data, entryMethod: "form" });
    setIsCreateOpen(false);
  };

  const handleTranscriptReady = (rawTranscript: string) => {
    if (!rawTranscript.trim()) {
      toast.error(TOAST_MESSAGES.VOICE.NO_SPEECH, { duration: 3000 });
      return;
    }
    const parsed = parseVoiceTranscript(rawTranscript, accountKeywords);
    if (parsed.lineItems.length === 0) {
      toast.error(TOAST_MESSAGES.VOICE.NO_ITEMS, { duration: 4000 });
      return;
    }
    setPendingVoice(parsed);
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

      {/* Voice ConfirmationCard — centered modal overlay */}
      {pendingVoice && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPendingVoice(null)}
          />
          <div className="relative w-full max-w-sm">
            <ConfirmationCard
              parsed={pendingVoice}
              onClose={() => setPendingVoice(null)}
              defaultAccountId={pendingVoice.detectedAccount?.accountId}
            />
          </div>
        </div>
      )}

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onSubmit={handleSubmit} isPending={isPending} />
        </DialogContent>
      </Dialog>

      {/* Voice mic button */}
      <VoiceRecordButton onTranscriptReady={handleTranscriptReady} />
    </div>
  );
};

export default TransactionsPage;
