"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchWorkoutToday } from "@/services/workouts/workouts.service";
import type { IWorkoutToday } from "@/types/fitness/workouts.types";

interface UseGetWorkoutTodayReturn {
  today: IWorkoutToday | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetWorkoutToday(): UseGetWorkoutTodayReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.WORKOUTS.TODAY],
    queryFn: fetchWorkoutToday,
    select: (response) => response.data,
  });

  return { today: data, isLoading, isFetching, isError };
}
