// ─────────────────────────────────────────────────────────────────────────────
// useGetTransfers
// ─────────────────────────────────────────────────────────────────────────────
// Fetches all transfers for the current user. Accepts optional filters so
// date-range or account-scoped views can narrow results server-side.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTransfers } from "@/services/transfers/transfers.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IFindAllTransfersParams } from "@/types/transfers/transfers.types";

export const useGetTransfers = (params?: IFindAllTransfersParams) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.TRANSFERS.ALL, params],
    queryFn: () => fetchTransfers(params),
  });

  return {
    transfers: data?.data ?? [],
    isLoading,
    isFetching,
    isError,
  };
};
