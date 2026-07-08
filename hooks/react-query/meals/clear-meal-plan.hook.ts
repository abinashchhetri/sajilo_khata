"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { clearMealPlan as clearMealPlanService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";

interface UseHandleClearMealPlanReturn {
  handleClear: () => Promise<void>;
  isPending: boolean;
}

export function useHandleClearMealPlan(): UseHandleClearMealPlanReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: clearMealPlanService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.PLAN_CLEARED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.PLAN],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
    },
  });

  return { handleClear: mutateAsync, isPending };
}
