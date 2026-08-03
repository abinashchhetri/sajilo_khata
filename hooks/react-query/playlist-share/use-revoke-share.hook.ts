// ─────────────────────────────────────────────────────────────────────────────
// useHandleRevokeShare
// ─────────────────────────────────────────────────────────────────────────────
// Stops sharing a playlist. Every link already sent stops resolving; copies
// other people already saved keep working — that distinction belongs in the
// confirm dialog, because it is the question users actually have.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { revokeShareLink } from "@/services/playlists/playlist-share.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleRevokeShare = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: revokeShareLink,
    onSuccess: (_data, playlistId) => {
      // Drop the cached link so the dialog returns to its "not shared" state.
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.PLAYLIST_SHARE.LINK(playlistId),
      });
      toast.success(TOAST_MESSAGES.SHARE.REVOKED);
    },
  });

  return { handleRevokeShare: mutateAsync, isPending };
};
