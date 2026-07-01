// ─────────────────────────────────────────────────────────────────────────────
// useHandleDeleteInvestment
// ─────────────────────────────────────────────────────────────────────────────
// Deletes an investment and all its value history.
// The service sets _skipToast so this onError is the sole toast source.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteInvestment } from "@/services/investments/investments.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeleteInvestment = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteInvestment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTMENTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVESTMENTS.SUMMARY],
      });
      toast.success(TOAST_MESSAGES.INVESTMENTS.DELETED);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
    },
  });

  const handleDeleteInvestment = async (investmentId: string) =>
    mutateAsync(investmentId);

  return { handleDeleteInvestment, isPending };
};
