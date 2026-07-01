// ─────────────────────────────────────────────────────────────────────────────
// useGetTransaction
// ─────────────────────────────────────────────────────────────────────────────
// Fetches a single transaction by ID with its line items and joined category.
// Used by the transaction detail page.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTransactionById } from "@/services/transactions/transactions.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { ITransaction } from "@/types/transactions/transactions.types";

export const useGetTransaction = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.SINGLE(id),
    queryFn: () => fetchTransactionById(id),
    enabled: !!id,
  });

  const transaction: ITransaction | undefined = data?.data;

  return { transaction, isLoading, isError };
};
