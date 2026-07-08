"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchMealPlan } from "@/services/meals/meals.service";
import type { IMealPlanDay } from "@/types/nutrition/meals.types";

interface UseGetMealPlanReturn {
  plan: IMealPlanDay[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetMealPlan(): UseGetMealPlanReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.MEALS.PLAN],
    queryFn: fetchMealPlan,
    select: (response) => response.data ?? [],
  });

  return { plan: data ?? [], isLoading, isFetching, isError };
}
