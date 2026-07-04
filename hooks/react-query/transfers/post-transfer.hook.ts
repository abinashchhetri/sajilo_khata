// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateTransfer
// ─────────────────────────────────────────────────────────────────────────────
// Creates a transfer between two accounts.
// On success: invalidates transfers, accounts (both balances changed), and
// analytics keys so the dashboard net-worth and recent activity refresh.
// NO onError — the Axios interceptor reads error.response.data.message and
// toasts it directly, so the backend's "Insufficient balance" message surfaces
// exactly as sent rather than being overwritten by a generic string.
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
      queryClient.invalidateQueries({ queryKey: ["analytics-dashboard"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.ACCOUNTS_VIEW] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.NET_WORTH] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANALYTICS.RECENT] });
      toast.success(TOAST_MESSAGES.TRANSFERS.CREATED);
    },
  });

  const handleCreateTransfer = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleCreateTransfer, isPending };
};
