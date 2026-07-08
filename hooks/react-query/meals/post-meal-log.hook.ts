"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { createMealLog as createMealLogService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";
import type { ICreateMealLog, IMealLog } from "@/types/nutrition/meals.types";

interface UseHandleCreateMealLogReturn {
  handleCreate: (body: ICreateMealLog) => Promise<IMealLog | undefined>;
  isPending: boolean;
}

export function useHandleCreateMealLog(): UseHandleCreateMealLogReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createMealLogService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.LOGGED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
      queryClient.invalidateQueries({
        queryKey: ["meal-logs"],
      });
    },
  });

  const handleCreate = async (body: ICreateMealLog): Promise<IMealLog | undefined> => {
    const response = await mutateAsync(body);
    return response?.data;
  };

  return { handleCreate, isPending };
}
