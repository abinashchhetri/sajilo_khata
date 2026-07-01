// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateTransfer
// ─────────────────────────────────────────────────────────────────────────────
// Creates a transfer between two accounts.
// On success: invalidates TRANSFERS.ALL (list) and ACCOUNTS.ALL (both balances
// changed) — analytics is not invalidated since transfers are excluded there.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createTransfer } from "@/services/transfers/transfers.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCreateTransfer = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTransfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSFERS.ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      toast.success(TOAST_MESSAGES.TRANSFERS.CREATED);
    },
  });

  const handleCreateTransfer = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleCreateTransfer, isPending };
};
