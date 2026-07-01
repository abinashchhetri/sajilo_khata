// ─────────────────────────────────────────────────────────────────────────────
// useGetPortfolioSummary
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the portfolio-level summary from the backend: total invested,
// current value, gain/loss, and a per-type breakdown.
// Invalidated whenever any investment is created, updated, or deleted.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPortfolioSummary } from "@/services/investments/investments.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetPortfolioSummary = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.INVESTMENTS.SUMMARY],
    queryFn: fetchPortfolioSummary,
  });

  return {
    summary: data?.data,
    isLoading,
    isError,
  };
};
