"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { completeSession } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCompleteSession = (sessionId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => completeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKOUT.SESSION(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUT.TODAY_SESSION],
      });
      queryClient.invalidateQueries({ queryKey: ["workout-sessions"] });
      toast.success(TOAST_MESSAGES.WORKOUT.SESSION_COMPLETED);
    },
  });

  const handleCompleteSession = async () => mutateAsync();

  return { handleCompleteSession, isPending };
};
