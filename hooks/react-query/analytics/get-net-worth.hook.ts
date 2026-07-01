// ─────────────────────────────────────────────────────────────────────────────
// useGetNetWorth
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchNetWorth } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetNetWorth = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.NET_WORTH],
    queryFn: fetchNetWorth,
  });

  return {
    netWorth: data?.data,
    isLoading,
    isError,
  };
};
