// ─────────────────────────────────────────────────────────────────────────────
// useHandleAddTrack
// ─────────────────────────────────────────────────────────────────────────────
// Adds a track to a playlist. The backend rejects un-cached tracks (not yet
// downloaded from YouTube), so onError distinguishes that case and shows a
// specific message instead of the generic one.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addTrackToPlaylist } from "@/services/playlists/playlists.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleAddTrack = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: addTrackToPlaylist,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(variables.playlistId),
      });
      toast.success(TOAST_MESSAGES.PLAYLISTS.TRACK_ADDED);
    },
    onError: (error: unknown) => {
      const apiError = error as { message?: string };
      if (apiError?.message?.toLowerCase().includes("cached")) {
        toast.error(TOAST_MESSAGES.PLAYLISTS.MUST_BE_CACHED);
      } else {
        toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
      }
    },
  });

  return { handleAddTrack: mutateAsync, isPending };
};
