"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { startSession } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleStartSession = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (sessionDate: string) => startSession(sessionDate),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUT.TODAY_SESSION],
      });
      queryClient.invalidateQueries({
        queryKey: ["workout-sessions"],
      });
      toast.success(TOAST_MESSAGES.WORKOUT.SESSION_STARTED);
    },
  });

  const handleStartSession = async (sessionDate: string) =>
    mutateAsync(sessionDate);

  return { handleStartSession, isPending };
};
