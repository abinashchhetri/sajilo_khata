"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { updateWorkoutSession as updateWorkoutSessionService } from "@/services/workouts/workouts.service";
import { queryClient } from "@/providers/react-query.provider";
import type { IUpdateSession, IWorkoutSession } from "@/types/fitness/workouts.types";

interface UseHandleUpdateWorkoutSessionReturn {
  handleUpdate: (id: string, body: IUpdateSession) => Promise<IWorkoutSession | undefined>;
  isPending: boolean;
}

export function useHandleUpdateWorkoutSession(): UseHandleUpdateWorkoutSessionReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, body }: { id: string; body: IUpdateSession }) =>
      updateWorkoutSessionService({ id, body }),
    onSuccess: (response) => {
      toast.success(TOAST_MESSAGES.WORKOUTS.SESSION_UPDATED);
      const sessionId = response?.data?.id;
      if (sessionId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.WORKOUTS.SESSION(sessionId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["workout-sessions"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.TODAY],
      });
    },
  });

  const handleUpdate = async (id: string, body: IUpdateSession): Promise<IWorkoutSession | undefined> => {
    const response = await mutateAsync({ id, body });
    return response?.data;
  };

  return { handleUpdate, isPending };
}
