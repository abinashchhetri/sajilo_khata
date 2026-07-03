// ─────────────────────────────────────────────────────────────────────────────
// useHandleDeletePlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Deletes a playlist and clears it from the list cache.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deletePlaylist } from "@/services/playlists/playlists.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeletePlaylist = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS.ALL] });
      toast.success(TOAST_MESSAGES.PLAYLISTS.DELETED);
    },
  });

  return { handleDeletePlaylist: mutateAsync, isPending };
};
