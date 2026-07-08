"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchTodaySession } from "@/services/workout/workout.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetTodaySession = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.WORKOUT.TODAY_SESSION],
    queryFn: fetchTodaySession,
  });

  return {
    session: data?.data ?? null,
    isLoading,
    isFetching,
    isError,
  };
};
