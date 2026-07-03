// ─────────────────────────────────────────────────────────────────────────────
// useHandleUpdatePlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Updates a playlist's metadata. Invalidates both the list (so name changes
// appear in the sidebar) and the single playlist cache (so the detail view
// reflects the update without a manual refetch).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updatePlaylist } from "@/services/playlists/playlists.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleUpdatePlaylist = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePlaylist,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(variables.id),
      });
      toast.success(TOAST_MESSAGES.PLAYLISTS.UPDATED);
    },
  });

  return { handleUpdatePlaylist: mutateAsync, isPending };
};
