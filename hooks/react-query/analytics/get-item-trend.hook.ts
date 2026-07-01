// ─────────────────────────────────────────────────────────────────────────────
// useGetItemTrend
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchItemTrend } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

export const useGetItemTrend = (itemName: string | null, params?: IAnalyticsParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.ITEM_TREND(itemName ?? ""),
    queryFn: () => fetchItemTrend(itemName!, params),
    enabled: !!itemName,
  });

  return {
    trend: data?.data ?? [],
    isLoading,
    isError,
  };
};
