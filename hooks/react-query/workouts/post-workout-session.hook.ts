"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { createWorkoutSession as createWorkoutSessionService } from "@/services/workouts/workouts.service";
import { queryClient } from "@/providers/react-query.provider";
import type { ICreateSession, IWorkoutSession } from "@/types/fitness/workouts.types";

interface UseHandleCreateWorkoutSessionReturn {
  handleCreate: (body: ICreateSession) => Promise<IWorkoutSession | undefined>;
  isPending: boolean;
}

export function useHandleCreateWorkoutSession(): UseHandleCreateWorkoutSessionReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createWorkoutSessionService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.WORKOUTS.SESSION_LOGGED);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.TODAY],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.EXERCISES],
      });
      queryClient.invalidateQueries({
        queryKey: ["workout-sessions"],
      });
    },
  });

  const handleCreate = async (body: ICreateSession): Promise<IWorkoutSession | undefined> => {
    const response = await mutateAsync(body);
    return response?.data;
  };

  return { handleCreate, isPending };
}
