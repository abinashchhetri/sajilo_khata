"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchWorkoutPlan } from "@/services/workouts/workouts.service";
import type { IWorkoutPlanDay } from "@/types/fitness/workouts.types";

interface UseGetWorkoutPlanReturn {
  plan: IWorkoutPlanDay[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetWorkoutPlan(): UseGetWorkoutPlanReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.WORKOUTS.PLAN],
    queryFn: fetchWorkoutPlan,
    select: (response) => response.data ?? [],
  });

  return { plan: data ?? [], isLoading, isFetching, isError };
}
