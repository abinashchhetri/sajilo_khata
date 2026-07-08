"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchMealToday } from "@/services/meals/meals.service";
import type { IMealToday } from "@/types/nutrition/meals.types";

interface UseGetMealTodayReturn {
  today: IMealToday | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetMealToday(): UseGetMealTodayReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.MEALS.TODAY],
    queryFn: fetchMealToday,
    select: (response) => response.data,
  });

  return { today: data, isLoading, isFetching, isError };
}
