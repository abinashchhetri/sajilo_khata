// ─────────────────────────────────────────────────────────────────────────────
// useHandleDeleteTransfer
// ─────────────────────────────────────────────────────────────────────────────
// Deletes a transfer. The backend reverses both account balance effects.
// Invalidates TRANSFERS.ALL and ACCOUNTS.ALL — analytics excluded (transfers
// are intentionally absent from analytics).
// The service sets _skipToast so this onError is the sole toast source.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTransfer } from "@/services/transfers/transfers.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeleteTransfer = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSFERS.ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      toast.success(TOAST_MESSAGES.TRANSFERS.DELETED);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
    },
  });

  const handleDeleteTransfer = async (transferId: string) =>
    mutateAsync(transferId);

  return { handleDeleteTransfer, isPending };
};
