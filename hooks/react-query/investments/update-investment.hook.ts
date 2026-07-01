// ─────────────────────────────────────────────────────────────────────────────
// useHandleUpdateInvestment / useHandleUpdateInvestmentValue
// ─────────────────────────────────────────────────────────────────────────────
// Two distinct mutations intentionally in one file — they share the same
// invalidation set but hit different endpoints:
//   updateInvestment      → PATCH /investments/:id        (name/note/metadata)
//   updateInvestmentValue → PATCH /investments/:id/value  (currentValue + history)
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  updateInvestment,
  updateInvestmentValue,
} from "@/services/investments/investments.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

// Invalidates the full list, the single entry, and the portfolio summary
const invalidateAll = (investmentId: string) => {
  queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTMENTS.ALL] });
  queryClient.invalidateQueries({
    queryKey: QUERY_KEYS.INVESTMENTS.SINGLE(investmentId),
  });
  queryClient.invalidateQueries({
    queryKey: [QUERY_KEYS.INVESTMENTS.SUMMARY],
  });
};

export const useHandleUpdateInvestment = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateInvestment,
    onSuccess: (_, variables) => {
      invalidateAll(variables.investmentId);
      toast.success(TOAST_MESSAGES.INVESTMENTS.UPDATED);
    },
  });

  const handleUpdateInvestment = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleUpdateInvestment, isPending };
};

export const useHandleUpdateInvestmentValue = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateInvestmentValue,
    onSuccess: (_, variables) => {
      invalidateAll(variables.investmentId);
      toast.success(TOAST_MESSAGES.INVESTMENTS.UPDATED);
    },
  });

  const handleUpdateInvestmentValue = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleUpdateInvestmentValue, isPending };
};
