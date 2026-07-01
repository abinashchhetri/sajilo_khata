// ─────────────────────────────────────────────────────────────────────────────
// useGetTransactions
// ─────────────────────────────────────────────────────────────────────────────
// Fetches a paginated, filterable list of transactions for the current user.
// Filters (account, type, category, date range) are passed straight through
// to the backend query params — filtering happens server-side, not client-side.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTransactions } from "@/services/transactions/transactions.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IFindAllTransactionsParams } from "@/types/transactions/transactions.types";

export const useGetTransactions = (filters: IFindAllTransactionsParams) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.ALL(filters),
    queryFn: () => fetchTransactions(filters),
  });

  return {
    transactions: data?.data ?? [],
    isLoading,
    isFetching,
    isError,
  };
};
