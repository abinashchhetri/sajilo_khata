// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateInvestment
// ─────────────────────────────────────────────────────────────────────────────
// Creates a new investment. On success: invalidates INVESTMENTS.ALL (list) and
// INVESTMENTS.SUMMARY (totals) so both update immediately.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createInvestment } from "@/services/investments/investments.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCreateInvestment = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTMENTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVESTMENTS.SUMMARY],
      });
      toast.success(TOAST_MESSAGES.INVESTMENTS.CREATED);
    },
  });

  const handleCreateInvestment = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleCreateInvestment, isPending };
};
