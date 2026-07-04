// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateTransaction
// ─────────────────────────────────────────────────────────────────────────────
// Creates an expense, income, or in_transit transaction.
// Used by both the manual TransactionForm and the voice ConfirmationCard.
// On success: invalidates transactions, accounts, and all analytics keys so the
// dashboard stats and recent activity refresh immediately.
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
      // Prefix-match invalidation — clears all dashboard/categories queries
      // regardless of what date range params they were fetched with.
      queryClient.invalidateQueries({ queryKey: ["analytics-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-categories"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.ACCOUNTS_VIEW] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.NET_WORTH] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.RECENT] });
      toast.success(TOAST_MESSAGES.TRANSACTIONS.CREATED);
    },
  });

  const handleCreateTransaction = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleCreateTransaction, isPending };
};
