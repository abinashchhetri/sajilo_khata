"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchWorkoutSessions } from "@/services/workouts/workouts.service";
import type { IWorkoutSession, IFindSessionsParams } from "@/types/fitness/workouts.types";
import type { TPaginatedResponse } from "@/types/api.types";

interface UseGetWorkoutSessionsReturn {
  sessions: IWorkoutSession[];
  pagination: TPaginatedResponse<IWorkoutSession> | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetWorkoutSessions(
  params?: IFindSessionsParams
): UseGetWorkoutSessionsReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUTS.SESSIONS(params),
    queryFn: () => fetchWorkoutSessions(params),
    select: (response) => response.data,
  });

  return {
    sessions: data?.data ?? [],
    pagination: data,
    isLoading,
    isFetching,
    isError,
  };
}
