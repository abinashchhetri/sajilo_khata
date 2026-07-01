// ─────────────────────────────────────────────────────────────────────────────
// useGetAccountWiseView
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAccountWiseView } from "@/services/analytics/analytics.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

export const useGetAccountWiseView = (params?: IAnalyticsParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.ANALYTICS.ACCOUNTS_VIEW, params],
    queryFn: () => fetchAccountWiseView(params),
  });

  return {
    accounts: data?.data ?? [],
    isLoading,
    isError,
  };
};
