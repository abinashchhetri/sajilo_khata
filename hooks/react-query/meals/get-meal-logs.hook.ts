"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchMealLogs } from "@/services/meals/meals.service";
import type { IMealLog, IFindLogsParams } from "@/types/nutrition/meals.types";
import type { TPaginatedResponse } from "@/types/api.types";

interface UseGetMealLogsReturn {
  logs: IMealLog[];
  pagination: TPaginatedResponse<IMealLog> | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetMealLogs(params?: IFindLogsParams): UseGetMealLogsReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.MEALS.LOGS(params),
    queryFn: () => fetchMealLogs(params),
    select: (response) => response.data,
  });

  return {
    logs: data?.data ?? [],
    pagination: data,
    isLoading,
    isFetching,
    isError,
  };
}
