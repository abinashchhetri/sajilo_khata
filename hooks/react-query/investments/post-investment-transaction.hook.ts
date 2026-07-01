// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateInvestmentTransaction
// ─────────────────────────────────────────────────────────────────────────────
// Records a buy/sell/dividend/bonus event for an investment. On success:
// invalidates the transaction ledger, the investment detail, and the
// investments list (quantity/value derived from metadata may have shifted).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createTransaction } from "@/services/investments/investments.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { ICreateInvestmentTransaction } from "@/types/investments/investments.types";

export const useHandleCreateInvestmentTransaction = (investmentId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: ICreateInvestmentTransaction) =>
      createTransaction(investmentId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INVESTMENT_TRANSACTIONS.ALL(investmentId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INVESTMENTS.SINGLE(investmentId),
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTMENTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVESTMENTS.SUMMARY],
      });
      toast.success(TOAST_MESSAGES.INVESTMENT_TRANSACTIONS.CREATED);
    },
  });

  const handleCreateInvestmentTransaction = async (
    body: ICreateInvestmentTransaction,
  ) => mutateAsync(body);

  return { handleCreateInvestmentTransaction, isPending };
};
