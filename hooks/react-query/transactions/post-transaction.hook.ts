// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateTransaction
// ─────────────────────────────────────────────────────────────────────────────
// Creates an expense, income, or in_transit transaction.
// Used by both the manual TransactionForm and the (future) voice ConfirmationCard.
// On success: invalidates transactions, accounts (balance changed), and
// analytics dashboard, since a new transaction affects all three.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createTransaction } from "@/services/transactions/transactions.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCreateTransaction = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.ALL() });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ANALYTICS.DASHBOARD() });
      toast.success(TOAST_MESSAGES.TRANSACTIONS.CREATED);
    },
  });

  const handleCreateTransaction = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleCreateTransaction, isPending };
};
