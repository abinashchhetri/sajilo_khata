// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateShareLink
// ─────────────────────────────────────────────────────────────────────────────
// Gets the share link for a playlist, creating one if it doesn't exist yet.
//
// A mutation rather than a query because it can create server state — but it
// is idempotent, so pressing the button twice is harmless and returns the same
// link. It is "Get link", never "Regenerate": re-issuing would silently break
// links the owner had already sent.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";

import { createShareLink } from "@/services/playlists/playlist-share.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useHandleCreateShareLink = () => {
  const { mutateAsync, isPending, data, reset } = useMutation({
    mutationFn: createShareLink,
    onSuccess: (response, playlistId) => {
      // Seed the cache so reopening the dialog shows the link immediately
      // instead of round-tripping again.
      queryClient.setQueryData(
        QUERY_KEYS.PLAYLIST_SHARE.LINK(playlistId),
        response,
      );
    },
  });

  return {
    handleCreateShareLink: mutateAsync,
    shareLink: data?.data ?? null,
    isPending,
    resetShareLink: reset,
  };
};
