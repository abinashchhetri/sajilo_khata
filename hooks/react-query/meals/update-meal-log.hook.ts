"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { updateMealLog as updateMealLogService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";
import type { IUpdateMealLog, IMealLog } from "@/types/nutrition/meals.types";

interface UseHandleUpdateMealLogReturn {
  handleUpdate: (id: string, body: IUpdateMealLog) => Promise<IMealLog | undefined>;
  isPending: boolean;
}

export function useHandleUpdateMealLog(): UseHandleUpdateMealLogReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateMealLog }) =>
      updateMealLogService({ id, body }),
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.UPDATED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
      queryClient.invalidateQueries({
        queryKey: ["meal-logs"],
      });
    },
  });

  const handleUpdate = async (id: string, body: IUpdateMealLog): Promise<IMealLog | undefined> => {
    const response = await mutateAsync({ id, body });
    return response?.data;
  };

  return { handleUpdate, isPending };
}
