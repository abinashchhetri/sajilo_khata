// ─────────────────────────────────────────────────────────────────────────────
// useHandleUpdateTransaction
// ─────────────────────────────────────────────────────────────────────────────
// Updates a transaction's note or categoryId — the only two fields editable
// after creation. Does not invalidate accounts or analytics because note/category
// changes don't affect any monetary balance.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTransaction } from "@/services/transactions/transactions.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleUpdateTransaction = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateTransaction,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRANSACTIONS.ALL() });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRANSACTIONS.SINGLE(variables.transactionId),
      });
      toast.success(TOAST_MESSAGES.TRANSACTIONS.UPDATED);
    },
  });

  const handleUpdateTransaction = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleUpdateTransaction, isPending };
};
