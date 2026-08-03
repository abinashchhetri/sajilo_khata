// ─────────────────────────────────────────────────────────────────────────────
// useHandleSaveSharedPlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Copies a shared playlist into the viewer's own library, then takes them to
// it — saving and then leaving someone on the share page would be a dead end.
//
// Clears any pending-share intent on the way through, so a token left over
// from the sign-in round trip cannot fire again on the next login.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { saveSharedPlaylist } from "@/services/playlists/playlist-share.service";
import { queryClient } from "@/providers/react-query.provider";
import { clearPendingShareToken } from "@/lib/pending-share";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { ROUTES } from "@/lib/constants/routes.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleSaveSharedPlaylist = () => {
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: saveSharedPlaylist,
    onSuccess: (response) => {
      const result = response.data;

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS.ALL] });
      clearPendingShareToken();

      // A truncated copy is still a success — say what happened rather than
      // letting the user discover the missing tracks themselves.
      if (result.truncated) {
        toast.success(TOAST_MESSAGES.SHARE.TRUNCATED);
      } else {
        toast.success(TOAST_MESSAGES.SHARE.SAVED);
      }

      router.push(ROUTES.PLAYLIST_DETAIL(result.playlistId));
    },
    // Failures (including the 400 when the viewer already owns it) are toasted
    // by the interceptor with the server's own wording.
  });

  return { handleSaveSharedPlaylist: mutateAsync, isPending };
};
