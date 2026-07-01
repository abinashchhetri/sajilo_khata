// ─────────────────────────────────────────────────────────────────────────────
// useGetInvestments
// ─────────────────────────────────────────────────────────────────────────────
// Fetches all investments for the current user. Accepts an optional type filter
// so the type-tab switcher can narrow results server-side without a key collision.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchInvestments } from "@/services/investments/investments.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IFindAllInvestmentsParams } from "@/types/investments/investments.types";

export const useGetInvestments = (params?: IFindAllInvestmentsParams) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.INVESTMENTS.ALL, params],
    queryFn: () => fetchInvestments(params),
  });

  return {
    investments: data?.data ?? [],
    isLoading,
    isFetching,
    isError,
  };
};
