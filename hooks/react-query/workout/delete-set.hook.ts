"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteSet } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeleteSet = (sessionId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (setId: string) => deleteSet(sessionId, setId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKOUT.SESSION(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUT.TODAY_SESSION],
      });
      toast.success(TOAST_MESSAGES.WORKOUT.SET_DELETED, { duration: 1500 });
    },
  });

  return {
    handleDeleteSet: (setId: string) => mutateAsync(setId),
    isPending,
  };
};
