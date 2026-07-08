"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { deleteMealLog as deleteMealLogService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";

interface UseHandleDeleteMealLogReturn {
  handleDelete: (id: string) => Promise<void>;
  isPending: boolean;
}

export function useHandleDeleteMealLog(): UseHandleDeleteMealLogReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteMealLogService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.DELETED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
      queryClient.invalidateQueries({
        queryKey: ["meal-logs"],
      });
    },
  });

  return { handleDelete: mutateAsync, isPending };
}
