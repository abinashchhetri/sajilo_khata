"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addSet } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleAddSet = (sessionId: string) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: { exerciseName: string; bodyPart: string }) =>
      addSet(sessionId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.WORKOUT.SESSION(sessionId),
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORKOUT.TODAY_SESSION],
      });
      toast.success(TOAST_MESSAGES.WORKOUT.SET_ADDED, { duration: 1500 });
    },
  });

  const handleAddSet = async (body: {
    exerciseName: string;
    bodyPart: string;
  }) => mutateAsync(body);

  return { handleAddSet, isPending };
};
