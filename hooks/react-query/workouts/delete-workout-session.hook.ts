"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { deleteWorkoutSession as deleteWorkoutSessionService } from "@/services/workouts/workouts.service";
import { queryClient } from "@/providers/react-query.provider";

interface UseHandleDeleteWorkoutSessionReturn {
  handleDelete: (id: string) => Promise<void>;
  isPending: boolean;
}

export function useHandleDeleteWorkoutSession(): UseHandleDeleteWorkoutSessionReturn {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteWorkoutSessionService,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.WORKOUTS.SESSION_DELETED);
      queryClient.invalidateQueries({
        queryKey: ["workout-sessions"],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUTS.TODAY],
      });
    },
  });

  return { handleDelete: mutateAsync, isPending };
}
