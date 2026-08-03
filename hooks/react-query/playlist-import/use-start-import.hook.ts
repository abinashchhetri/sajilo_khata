// ─────────────────────────────────────────────────────────────────────────────
// useHandleStartImport
// ─────────────────────────────────────────────────────────────────────────────
// Queues a playlist import. Returns in ~2.5s WITHOUT waiting for downloads —
// the caller takes the returned importId and polls useGetImportProgress.
//
// Invalidates playlists on success because "create new playlist" mode adds one
// immediately, before a single track has downloaded.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { startImport } from "@/services/playlists/playlist-import.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleStartImport = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: startImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLIST_IMPORT.HISTORY(),
      });
      toast.success(TOAST_MESSAGES.PLAYLIST_IMPORT.STARTED);
    },
    // Errors (409 already-running, 429 rate limit, 400 bad URL) are toasted by
    // the Axios interceptor with the server's own message, which is already
    // user-facing. The dialog additionally renders it inline.
  });

  return { handleStartImport: mutateAsync, isPending };
};
