// ─────────────────────────────────────────────────────────────────────────────
// useHandleRemoveTrack
// ─────────────────────────────────────────────────────────────────────────────
// Removes a track from a playlist and refreshes the playlist detail cache.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { removeTrackFromPlaylist } from "@/services/playlists/playlists.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleRemoveTrack = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: removeTrackFromPlaylist,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(variables.playlistId),
      });
      toast.success(TOAST_MESSAGES.PLAYLISTS.TRACK_REMOVED);
    },
  });

  return { handleRemoveTrack: mutateAsync, isPending };
};
