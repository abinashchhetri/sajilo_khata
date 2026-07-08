"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSession } from "@/services/workout/workout.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetSession = (id: string | null) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUT.SESSION(id ?? ""),
    queryFn: () => fetchSession(id!),
    enabled: !!id,
  });

  return {
    session: data?.data ?? null,
    isLoading,
    isFetching,
    isError,
  };
};
