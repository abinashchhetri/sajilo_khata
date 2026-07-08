"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPlanForDay } from "@/services/workout/workout.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { TDayOfWeek, IWorkoutPlanDay } from "@/types/workout/workout.types";

export const useGetPlanDay = (day: TDayOfWeek) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUT.PLAN_DAY(day),
    queryFn: () => fetchPlanForDay(day),
  });

  return {
    planDay: data?.data ?? null as IWorkoutPlanDay | null,
    isLoading,
    isFetching,
    isError,
  };
};
