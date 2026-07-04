"use client";

import { useMutation } from "@tanstack/react-query";

import { advanceQueue } from "@/services/music/music.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useHandleAdvanceQueue = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: advanceQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MUSIC.QUEUE] });
    },
  });

  return { handleAdvanceQueue: mutateAsync, isPending };
};
