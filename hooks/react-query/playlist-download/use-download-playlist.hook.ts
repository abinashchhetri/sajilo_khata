// ─────────────────────────────────────────────────────────────────────────────
// useDownloadPlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Owns the ZIP download lifecycle. Not a React Query mutation: the transfer is
// a long-lived stream with progress and cancellation, none of which fits the
// mutation model, and its state has to outlive the component (see
// lib/download-store.ts).
//
// Refuses oversized blob downloads before starting rather than discovering the
// limit when the tab dies — the manifest tells us the size up front, so there
// is never a reason to begin a download we know will fail.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useCallback, useSyncExternalStore } from "react";
import toast from "react-hot-toast";

import { streamPlaylistZip } from "@/services/playlists/playlist-download.service";
import { downloadStore } from "@/lib/download-store";
import { DOWNLOAD_CONSTANTS } from "@/lib/constants/download.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { IDownloadManifest } from "@/types/playlists/download.types";

// True when the browser can stream to disk. Chrome/Edge desktop and Chrome
// Android 121+; Firefox and Safari fall back to the memory-bound blob path.
export const canStreamToDisk = (): boolean =>
  typeof window !== "undefined" && "showSaveFilePicker" in window;

export const useDownloadPlaylist = () => {
  const state = useSyncExternalStore(
    downloadStore.subscribe,
    downloadStore.getSnapshot,
    downloadStore.getServerSnapshot,
  );

  const start = useCallback(async (manifest: IDownloadManifest) => {
    if (downloadStore.isRunning()) return;

    if (manifest.downloadableTracks === 0) {
      toast.error(TOAST_MESSAGES.DOWNLOAD.NOT_READY);
      return;
    }

    // Hard stop before a byte moves: without the streaming API the whole
    // archive has to fit in memory.
    if (
      !canStreamToDisk() &&
      manifest.totalBytes > DOWNLOAD_CONSTANTS.BLOCK_BLOB_BYTES
    ) {
      downloadStore.setState({
        phase: "error",
        playlistId: manifest.playlistId,
        playlistName: manifest.name,
        errorMessage: TOAST_MESSAGES.DOWNLOAD.TOO_LARGE,
      });
      toast.error(TOAST_MESSAGES.DOWNLOAD.TOO_LARGE);
      return;
    }

    downloadStore.setState({
      phase: "preparing",
      playlistId: manifest.playlistId,
      playlistName: manifest.name,
      percent: 0,
      received: 0,
      total: manifest.totalBytes,
      errorMessage: null,
    });

    const signal = downloadStore.beginAbortable();

    const result = await streamPlaylistZip({
      playlistId: manifest.playlistId,
      suggestedFilename: manifest.suggestedFilename,
      totalBytes: manifest.totalBytes,
      signal,
      onProgress: (received, total) => {
        downloadStore.setState({
          phase: "downloading",
          received,
          total,
          // Header total covers audio only, so the archive is always a little
          // larger — hold at 99 and let completion snap it to 100.
          percent: total > 0 ? Math.min(99, Math.round((received / total) * 100)) : 0,
        });
      },
    });

    if (result.kind === "saved") {
      downloadStore.setState({ phase: "done", percent: 100 });
      toast.success(TOAST_MESSAGES.DOWNLOAD.COMPLETED);
      return;
    }

    if (result.kind === "cancelled") {
      // Dismissing the save picker is a decision, not a failure — stay quiet.
      downloadStore.setState({ phase: "cancelled", errorMessage: null });
      return;
    }

    downloadStore.setState({ phase: "error", errorMessage: result.message });
    toast.error(result.message);
  }, []);

  const cancel = useCallback(() => {
    // Aborts the fetch itself, which also tears down the server's S3 stream
    // rather than leaving it pulling bytes nobody is reading.
    downloadStore.abort();
    downloadStore.setState({ phase: "cancelled" });
    toast.success(TOAST_MESSAGES.DOWNLOAD.CANCELLED);
  }, []);

  const reset = useCallback(() => {
    if (downloadStore.isRunning()) return; // never discard a live transfer
    downloadStore.reset();
  }, []);

  return {
    ...state,
    isRunning: state.phase === "preparing" || state.phase === "downloading",
    start,
    cancel,
    reset,
  };
};
