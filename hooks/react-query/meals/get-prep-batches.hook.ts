"use client";

import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { fetchPrepBatches } from "@/services/meals/meals.service";
import type { IMealPrepBatch } from "@/types/nutrition/meals.types";

interface UseGetPrepBatchesReturn {
  batches: IMealPrepBatch[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function useGetPrepBatches(): UseGetPrepBatchesReturn {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: [QUERY_KEYS.MEALS.PREP],
    queryFn: fetchPrepBatches,
    select: (response) => response.data ?? [],
  });

  return { batches: data ?? [], isLoading, isFetching, isError };
}
