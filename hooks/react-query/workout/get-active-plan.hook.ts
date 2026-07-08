"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchActivePlan } from "@/services/workout/workout.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetActivePlan = () => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.WORKOUT.PLAN],
    queryFn: fetchActivePlan,
  });

  return {
    plan: data?.data ?? null,
    isLoading,
    isFetching,
    isError,
  };
};
