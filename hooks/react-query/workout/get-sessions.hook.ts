"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSessions } from "@/services/workout/workout.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetSessions = (params?: Record<string, unknown>) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUT.SESSIONS(params),
    queryFn: () => fetchSessions(params),
  });

  return {
    sessions: data?.data?.data ?? [],
    total: data?.data?.total ?? 0,
    totalPages: data?.data?.totalPages ?? 0,
    hasNextPage: data?.data?.hasNextPage ?? false,
    hasPrevPage: data?.data?.hasPrevPage ?? false,
    isLoading,
    isFetching,
    isError,
  };
};
