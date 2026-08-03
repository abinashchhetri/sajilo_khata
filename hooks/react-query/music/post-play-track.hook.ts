// ─────────────────────────────────────────────────────────────────────────────
// useHandlePlayTrack
// ─────────────────────────────────────────────────────────────────────────────
// Fires the play event and returns a stream URL for the track. No cache
// invalidation — play events are fire-and-forget side effects that the player
// handles directly via the mutation result, not via cache state.
//
// Takes an object so playlistId can be passed through: supplying it tells the
// backend to queue the rest of that playlist behind this track. React Query
// mutations receive exactly one variable, hence the object rather than
// positional args.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { playTrack } from "@/services/music/music.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandlePlayTrack = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      trackId,
      playlistId,
    }: {
      trackId: string;
      playlistId?: string;
    }) => playTrack(trackId, playlistId),
    onError: () => {
      toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR);
    },
  });

  return { handlePlayTrack: mutateAsync, isPending };
};
