"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { logSet } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { ILogSetBody } from "@/types/workout/workout.types";

export const useHandleLogSet = (sessionId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: ILogSetBody) => logSet(sessionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKOUT.SESSION(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUT.TODAY_SESSION],
      });
      toast.success(TOAST_MESSAGES.WORKOUT.SET_LOGGED, { duration: 1500 });
    },
  });

  const handleLogSet = async (body: ILogSetBody) => mutateAsync(body);

  return { handleLogSet, isPending };
};
