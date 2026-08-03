// ─────────────────────────────────────────────────────────────────────────────
// useHandleCancelImport
// ─────────────────────────────────────────────────────────────────────────────
// Stops an in-flight import. Tracks already mid-download still finish; nothing
// new is queued. Returns 409 if the import already reached a terminal state —
// the interceptor surfaces that message.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { cancelImport } from "@/services/playlists/playlist-import.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCancelImport = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: cancelImport,
    onSuccess: (_data, importId) => {
      // Refetch immediately so the UI flips to CANCELLED and polling stops
      // on the very next tick rather than after another interval.
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLIST_IMPORT.PROGRESS(importId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLIST_IMPORT.HISTORY(),
      });
      toast.success(TOAST_MESSAGES.PLAYLIST_IMPORT.CANCELLED);
    },
  });

  return { handleCancelImport: mutateAsync, isPending };
};
