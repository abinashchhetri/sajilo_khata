// ─────────────────────────────────────────────────────────────────────────────
// useHandleDownloadTrack
// ─────────────────────────────────────────────────────────────────────────────
// Downloads one track by asking for a presigned S3 link, then pointing the
// browser at it.
//
// Deliberately no fetch-and-blob here: the URL is self-authenticating and
// already carries Content-Disposition, so a direct navigation keeps the bytes
// off our server entirely and hands the user their browser's own download
// manager — with pause, resume and background transfer for free.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  fetchTrackDownloadUrl,
  triggerTrackDownload,
} from "@/services/playlists/playlist-download.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDownloadTrack = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: fetchTrackDownloadUrl,
    onSuccess: (response) => {
      triggerTrackDownload(response.data);
      toast.success(TOAST_MESSAGES.DOWNLOAD.TRACK_SAVED);
    },
    // GET failures aren't toasted by the interceptor, so handle it here.
    onError: () => {
      toast.error(TOAST_MESSAGES.DOWNLOAD.FAILED);
    },
  });

  return { handleDownloadTrack: mutateAsync, isPending };
};
