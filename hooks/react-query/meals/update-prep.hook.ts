"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { updatePrep as updatePrepService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";
import type { IUpdatePrep, IMealPrepBatch } from "@/types/nutrition/meals.types";

interface UseHandleUpdatePrepReturn {
  handleUpdate: (id: string, body: IUpdatePrep) => Promise<IMealPrepBatch | undefined>;
  isPending: boolean;
}

export function useHandleUpdatePrep(): UseHandleUpdatePrepReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdatePrep }) =>
      updatePrepService({ id, body }),
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.PREP_UPDATED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.PREP],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
    },
  });

  const handleUpdate = async (id: string, body: IUpdatePrep): Promise<IMealPrepBatch | undefined> => {
    const response = await mutateAsync({ id, body });
    return response?.data;
  };

  return { handleUpdate, isPending };
}
