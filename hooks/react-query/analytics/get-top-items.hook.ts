// ─────────────────────────────────────────────────────────────────────────────
// useGetTopItems
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTopItems } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

export const useGetTopItems = (params?: IAnalyticsParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.TOP_ITEMS(params),
    queryFn: () => fetchTopItems(params),
  });

  return {
    items: data?.data ?? [],
    isLoading,
    isError,
  };
};
