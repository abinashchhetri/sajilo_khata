"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchWorkoutSession } from "@/services/workouts/workouts.service";
import type { IWorkoutSession } from "@/types/fitness/workouts.types";

interface UseGetWorkoutSessionReturn {
  session: IWorkoutSession | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetWorkoutSession(id: string): UseGetWorkoutSessionReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUTS.SESSION(id),
    queryFn: () => fetchWorkoutSession(id),
    select: (response) => response.data,
    enabled: !!id,
  });

  return { session: data, isLoading, isFetching, isError };
}
