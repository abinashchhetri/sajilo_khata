"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchExerciseNames } from "@/services/workouts/workouts.service";

interface UseGetExerciseNamesReturn {
  exercises: string[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetExerciseNames(): UseGetExerciseNamesReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.WORKOUTS.EXERCISES],
    queryFn: fetchExerciseNames,
    select: (response) => response.data ?? [],
  });

  return { exercises: data ?? [], isLoading, isFetching, isError };
}
