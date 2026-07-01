// ─────────────────────────────────────────────────────────────────────────────
// useGetDashboard
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

export const useGetDashboard = (params?: IAnalyticsParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ANALYTICS.DASHBOARD(params),
    queryFn: () => fetchDashboard(params),
  });

  return {
    summary: data?.data,
    isLoading,
    isError,
  };
};
