// ─────────────────────────────────────────────────────────────────────────────
// useHandleDeleteAccount
// ─────────────────────────────────────────────────────────────────────────────
// Deletes an account. The backend blocks deletion when the account has existing
// transactions — onError shows DELETE_BLOCKED for that case, or falls back to
// a generic message for any other failure. The delete service sets _skipToast
// so the interceptor stays silent and this onError is the sole toast source.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteAccount } from "@/services/accounts/accounts.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeleteAccount = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      toast.success(TOAST_MESSAGES.ACCOUNTS.DELETED);
    },
    onError: (error: unknown) => {
      const apiError = error as { message?: string };
      if (apiError?.message?.toLowerCase().includes("transaction")) {
        toast.error(TOAST_MESSAGES.ACCOUNTS.DELETE_BLOCKED);
      } else {
        toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
      }
    },
  });

  const handleDeleteAccount = async (accountId: string) => {
    return mutateAsync(accountId);
  };

  return { handleDeleteAccount, isPending };
};
