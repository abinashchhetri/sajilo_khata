// ─────────────────────────────────────────────────────────────────────────────
// useHandlePrepareNext
// ─────────────────────────────────────────────────────────────────────────────
// Tells the backend to pre-cache the next recommendation while the current
// track plays. Success is intentionally silent — showing a toast mid-song would
// be annoying. The player reads the response data to know if the next track is
// ready; it doesn't rely on cache state.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { prepareNextTrack } from "@/services/music/music.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandlePrepareNext = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: prepareNextTrack,
    onError: () => {
      toast.error(TOAST_MESSAGES.MUSIC.PREPARE_FAILED);
    },
  });

  return { handlePrepareNext: mutateAsync, isPending };
};
