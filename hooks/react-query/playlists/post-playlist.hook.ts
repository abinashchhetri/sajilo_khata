// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreatePlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Creates a new playlist and refreshes the playlists list cache.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createPlaylist } from "@/services/playlists/playlists.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCreatePlaylist = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS.ALL] });
      toast.success(TOAST_MESSAGES.PLAYLISTS.CREATED);
    },
  });

  return { handleCreatePlaylist: mutateAsync, isPending };
};
