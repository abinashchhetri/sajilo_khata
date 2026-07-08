"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { consumePortion as consumePortionService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";
import type { IConsumePrep, IConsumeResult } from "@/types/nutrition/meals.types";

interface UseHandleConsumePortionReturn {
  handleConsume: (id: string, body: IConsumePrep) => Promise<IConsumeResult | undefined>;
  isPending: boolean;
}

export function useHandleConsumePortion(): UseHandleConsumePortionReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: IConsumePrep }) =>
      consumePortionService({ id, body }),
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.PORTION_CONSUMED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.PREP],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
      queryClient.invalidateQueries({
        queryKey: ["meal-logs"],
      });
    },
  });

  const handleConsume = async (id: string, body: IConsumePrep): Promise<IConsumeResult | undefined> => {
    const response = await mutateAsync({ id, body });
    return response?.data;
  };

  return { handleConsume, isPending };
}
