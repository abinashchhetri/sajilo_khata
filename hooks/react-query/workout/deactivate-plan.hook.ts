"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deactivatePlan } from "@/services/workout/workout.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useHandleDeactivatePlan = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deactivatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORKOUT.PLAN] });
      toast.success("Workout plan deactivated");
    },
  });

  const handleDeactivatePlan = async () => mutateAsync();

  return { handleDeactivatePlan, isPending };
};
