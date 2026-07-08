"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { createPrep as createPrepService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";
import type { ICreatePrep, IMealPrepBatch } from "@/types/nutrition/meals.types";

interface UseHandleCreatePrepReturn {
  handleCreate: (body: ICreatePrep) => Promise<IMealPrepBatch | undefined>;
  isPending: boolean;
}

export function useHandleCreatePrep(): UseHandleCreatePrepReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPrepService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.PREP_CREATED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.PREP],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
    },
  });

  const handleCreate = async (body: ICreatePrep): Promise<IMealPrepBatch | undefined> => {
    const response = await mutateAsync(body);
    return response?.data;
  };

  return { handleCreate, isPending };
}
