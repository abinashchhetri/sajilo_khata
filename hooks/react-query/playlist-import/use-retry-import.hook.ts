// ─────────────────────────────────────────────────────────────────────────────
// useHandleRetryImport
// ─────────────────────────────────────────────────────────────────────────────
// Re-queues every FAILED track on a finished import. Returns 400 if nothing
// failed, so callers should only offer this when failedTracks > 0.
//
// Re-queuing moves the import out of its terminal state, so the progress query
// is invalidated to restart polling.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { retryImport } from "@/services/playlists/playlist-import.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleRetryImport = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: retryImport,
    onSuccess: (_data, importId) => {
      // The import is live again — refetching restarts the poll loop, which
      // had stopped when the status went terminal.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLIST_IMPORT.PROGRESS(importId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLIST_IMPORT.ITEMS(importId),
      });
      toast.success(TOAST_MESSAGES.PLAYLIST_IMPORT.RETRIED);
    },
  });

  return { handleRetryImport: mutateAsync, isPending };
};
