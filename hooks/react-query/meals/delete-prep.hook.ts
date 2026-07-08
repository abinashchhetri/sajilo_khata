"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { deletePrep as deletePrepService } from "@/services/meals/meals.service";
import { queryClient } from "@/providers/react-query.provider";

interface UseHandleDeletePrepReturn {
  handleDelete: (id: string) => Promise<void>;
  isPending: boolean;
}

export function useHandleDeletePrep(): UseHandleDeletePrepReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deletePrepService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.MEALS.PREP_DELETED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.PREP],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.MEALS.TODAY],
      });
    },
  });

  return { handleDelete: mutateAsync, isPending };
}
