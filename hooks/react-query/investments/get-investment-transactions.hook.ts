// ─────────────────────────────────────────────────────────────────────────────
// useGetInvestmentTransactions
// ─────────────────────────────────────────────────────────────────────────────
// Fetches a paginated, newest-first transaction ledger for one investment.
// Transactions are append-only — this hook never mutates, only reads.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTransactions } from "@/services/investments/investments.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IFindAllInvestmentTransactionsParams } from "@/types/investments/investments.types";

export const useGetInvestmentTransactions = (
  investmentId: string,
  params?: IFindAllInvestmentTransactionsParams,
) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.INVESTMENT_TRANSACTIONS.ALL(
      investmentId,
      params as Record<string, unknown> | undefined,
    ),
    queryFn: () => fetchTransactions(investmentId, params),
    enabled: !!investmentId,
  });

  return {
    transactions: data?.data.data ?? [],
    total: data?.data.total ?? 0,
    hasNextPage: data?.data.hasNextPage ?? false,
    isLoading,
    isFetching,
    isError,
  };
};
