// ─────────────────────────────────────────────────────────────────────────────
// useHandleReorderTrack
// ─────────────────────────────────────────────────────────────────────────────
// Moves a track to a new position within a playlist. Success is silent — the UI
// already shows the reordered state optimistically, so a toast would be noise.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";

import { reorderTrack } from "@/services/playlists/playlists.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useHandleReorderTrack = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: reorderTrack,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(variables.playlistId),
      });
    },
  });

  return { handleReorderTrack: mutateAsync, isPending };
};
