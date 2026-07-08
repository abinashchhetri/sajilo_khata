"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { importPlan } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { IImportPlanResult } from "@/types/workout/workout.types";
import type { IWorkoutPlan } from "@/types/workout/workout.types";

export const useHandleImportPlan = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ file, planName }: { file: File; planName: string }) =>
      importPlan(file, planName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKOUT.PLAN] });
      toast.success(TOAST_MESSAGES.WORKOUT.PLAN_IMPORTED);
    },
  });

  const handleImportPlan = async (
    file: File,
    planName: string,
  ): Promise<(IImportPlanResult & { plan: IWorkoutPlan }) | null> => {
    try {
      const result = await mutateAsync({ file, planName });
      return result.data;
    } catch {
      return null;
    }
  };

  return { handleImportPlan, isPending };
};
