"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useGetRecentTransactions
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the N most recent personal transactions for the dashboard.
// Invalidated by every transaction/transfer mutation so dashboard stays live.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { fetchRecentTransactions } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetRecentTransactions = (limit: number = 5) => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.RECENT],
    queryFn: () => fetchRecentTransactions(limit),
  });

  return { transactions: data ?? [], isLoading };
};
