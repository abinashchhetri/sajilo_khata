"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { importWorkoutPlan as importWorkoutPlanService } from "@/services/workouts/workouts.service";
import { queryClient } from "@/providers/react-query.provider";
import type { IImportSummary } from "@/types/fitness/workouts.types";

interface UseHandleImportWorkoutPlanReturn {
  handleImport: (csv: string) => Promise<IImportSummary | undefined>;
  isPending: boolean;
}

export function useHandleImportWorkoutPlan(): UseHandleImportWorkoutPlanReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: importWorkoutPlanService,
    onSuccess: (response) => {
      toast.success(TOAST_MESSAGES.WORKOUTS.PLAN_IMPORTED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.PLAN],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.TODAY],
      });
    },
  });

  const handleImport = async (csv: string): Promise<IImportSummary | undefined> => {
    const response = await mutateAsync(csv);
    return response?.data;
  };

  return { handleImport, isPending };
}
