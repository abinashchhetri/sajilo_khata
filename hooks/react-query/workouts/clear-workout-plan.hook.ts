"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { clearWorkoutPlan as clearWorkoutPlanService } from "@/services/workouts/workouts.service";
import { queryClient } from "@/providers/react-query.provider";

interface UseHandleClearWorkoutPlanReturn {
  handleClear: () => Promise<void>;
  isPending: boolean;
}

export function useHandleClearWorkoutPlan(): UseHandleClearWorkoutPlanReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: clearWorkoutPlanService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.WORKOUTS.PLAN_CLEARED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.PLAN],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.TODAY],
      });
    },
  });

  return { handleClear: mutateAsync, isPending };
}
