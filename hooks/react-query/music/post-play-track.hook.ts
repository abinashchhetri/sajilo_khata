// ─────────────────────────────────────────────────────────────────────────────
// useHandlePlayTrack
// ─────────────────────────────────────────────────────────────────────────────
// Fires the play event and returns a stream URL for the track. No cache
// invalidation — play events are fire-and-forget side effects that the player
// handles directly via the mutation result, not via cache state.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { playTrack } from "@/services/music/music.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandlePlayTrack = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: playTrack,
    onError: () => {
      toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR);
    },
  });

  return { handlePlayTrack: mutateAsync, isPending };
};
