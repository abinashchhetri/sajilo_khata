// ─────────────────────────────────────────────────────────────────────────────
// useHandleUpdateAccount
// ─────────────────────────────────────────────────────────────────────────────
// Updates an account's name, default status, or archived status.
// On success: invalidates both the list and the single-account cache, since
// setting isDefault=true changes the old default account's state on the server.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateAccount } from "@/services/accounts/accounts.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { IUpdateAccount } from "@/types/accounts/accounts.types";

export const useHandleUpdateAccount = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateAccount,
    onSuccess: (_, variables) => {
      // Invalidate the full list — setting a new default de-flags the old one
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ACCOUNTS.SINGLE(variables.accountId),
      });
      toast.success(TOAST_MESSAGES.ACCOUNTS.UPDATED);
    },
  });

  const handleUpdateAccount = async (args: {
    accountId: string;
    body: IUpdateAccount;
  }) => {
    return mutateAsync(args);
  };

  return { handleUpdateAccount, isPending };
};
