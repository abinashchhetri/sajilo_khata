// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateAccount
// ─────────────────────────────────────────────────────────────────────────────
// Creates a new account. On success: invalidates the accounts list cache so
// the new account appears immediately without a manual refetch.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createAccount } from "@/services/accounts/accounts.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { ICreateAccount } from "@/types/accounts/accounts.types";

export const useHandleCreateAccount = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      toast.success(TOAST_MESSAGES.ACCOUNTS.CREATED);
    },
  });

  const handleCreateAccount = async (body: ICreateAccount) => {
    return mutateAsync(body);
  };

  return { handleCreateAccount, isPending };
};
