// ─────────────────────────────────────────────────────────────────────────────
// useHandleToggleShuffle
// ─────────────────────────────────────────────────────────────────────────────
// Reshuffles the live queue. Pressing repeatedly is intended behaviour — each
// press generates a fresh random order.
//
// Optimistic on the button, authoritative on the result: the returned
// `shuffle` value wins, so a rejected toggle snaps back rather than leaving
// the UI claiming something the server didn't do.
//
// This is only ever called from a deliberate press. A track ending must go
// through /music/queue/advance instead — the backend tells the two apart by
// which endpoint asked, and calling this on rollover would reshuffle
// mid-playlist and replay songs already heard.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { toggleShuffle } from "@/services/playlists/playlist-share.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleToggleShuffle = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: toggleShuffle,
    onSuccess: (response) => {
      toast.success(
        response.data.shuffle
          ? TOAST_MESSAGES.SHUFFLE.ON
          : TOAST_MESSAGES.SHUFFLE.OFF,
        { duration: 1500 },
      );
    },
  });

  return { handleToggleShuffle: mutateAsync, isPending };
};
