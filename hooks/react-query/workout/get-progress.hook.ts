"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchProgress } from "@/services/workout/workout.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetProgress = (exerciseName: string) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.WORKOUT.PROGRESS(exerciseName),
    queryFn: () => fetchProgress(exerciseName),
    enabled: !!exerciseName,
  });

  return {
    points: data?.data ?? [],
    isLoading,
    isFetching,
    isError,
  };
};
