"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchExerciseProgress } from "@/services/workouts/workouts.service";
import type { IExerciseProgress } from "@/types/fitness/workouts.types";

interface UseGetExerciseProgressReturn {
  progress: IExerciseProgress | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetExerciseProgress(
  exercise: string
): UseGetExerciseProgressReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUTS.PROGRESS(exercise),
    queryFn: () => fetchExerciseProgress(exercise),
    select: (response) => response.data,
    enabled: !!exercise,
  });

  return { progress: data, isLoading, isFetching, isError };
}
