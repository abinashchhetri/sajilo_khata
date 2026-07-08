"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { importMealPlan as importMealPlanService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";
import type { IMealImportSummary } from "@/types/nutrition/meals.types";

interface UseHandleImportMealPlanReturn {
  handleImport: (csv: string) => Promise<IMealImportSummary | undefined>;
  isPending: boolean;
}

export function useHandleImportMealPlan(): UseHandleImportMealPlanReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: importMealPlanService,
    onSuccess: (response) => {
      toast.success(TOAST_MESSAGES.MEALS.PLAN_IMPORTED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.PLAN],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
    },
  });

  const handleImport = async (csv: string): Promise<IMealImportSummary | undefined> => {
    const response = await mutateAsync(csv);
    return response?.data;
  };

  return { handleImport, isPending };
}
