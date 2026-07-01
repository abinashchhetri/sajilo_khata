// ─────────────────────────────────────────────────────────────────────────────
// useGetCategoryBreakdown
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCategoryBreakdown } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

export const useGetCategoryBreakdown = (params?: IAnalyticsParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.CATEGORIES(params),
    queryFn: () => fetchCategoryBreakdown(params),
  });

  return {
    categories: data?.data ?? [],
    isLoading,
    isError,
  };
};
