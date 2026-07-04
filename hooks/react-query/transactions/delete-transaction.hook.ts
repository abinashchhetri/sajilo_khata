// ─────────────────────────────────────────────────────────────────────────────
// useHandleDeleteTransaction
// ─────────────────────────────────────────────────────────────────────────────
// Deletes a transaction. The backend reverses the account balance effect.
// On success: invalidates transactions, accounts, and all analytics keys so the
// dashboard stats and recent activity reflect the deletion immediately.
// The service sets _skipToast so this onError is the sole toast source.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTransaction } from "@/services/transactions/transactions.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeleteTransaction = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.ALL() });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      queryClient.invalidateQueries({ queryKey: ["analytics-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["analytics-categories"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.ACCOUNTS_VIEW] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.NET_WORTH] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.RECENT] });
      toast.success(TOAST_MESSAGES.TRANSACTIONS.DELETED);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
    },
  });

  const handleDeleteTransaction = async (transactionId: string) =>
    mutateAsync(transactionId);

  return { handleDeleteTransaction, isPending };
};
