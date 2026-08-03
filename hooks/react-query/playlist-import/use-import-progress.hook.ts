// ─────────────────────────────────────────────────────────────────────────────
// useGetImportProgress
// ─────────────────────────────────────────────────────────────────────────────
// Polls one import's progress every 3s. The server keeps this endpoint O(1),
// so polling is cheap — but it must still STOP.
//
// Polling halts on three conditions, all handled in refetchInterval:
//   1. status is terminal (COMPLETED / FAILED / CANCELLED) — it will never
//      change again, so a forgotten tab must not poll forever. This is the
//      single most important behaviour in the whole feature.
//   2. the query errored — a 404 "Import not found" is permanent; retrying
//      it on a loop would hammer the server for nothing.
//   3. no importId — the query is disabled entirely.
//
// State lives entirely on the server. Nothing here is cached in component
// state or localStorage, so closing the dialog or navigating away and coming
// back resumes exactly where the server is.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { fetchImportProgress } from "@/services/playlists/playlist-import.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import {
  IMPORT_CONSTANTS,
  isTerminalImportStatus,
} from "@/lib/constants/import.constants";
import type { TImportStatus } from "@/types/playlists/import.types";

export const useGetImportProgress = (importId: string | null) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST_IMPORT.PROGRESS(importId ?? ""),
    queryFn: () => fetchImportProgress(importId as string),
    enabled: !!importId,
    refetchInterval: (query) => {
      // A permanent failure (404) must not be retried on a loop.
      if (query.state.status === "error") return false;
      const status = query.state.data?.data?.status;
      // Terminal → stop. Undefined (first tick) → keep polling.
      return isTerminalImportStatus(status)
        ? false
        : IMPORT_CONSTANTS.POLL_INTERVAL_MS;
    },
    // Don't poll a backgrounded tab; React Query resumes on refocus.
    refetchIntervalInBackground: false,
  });

  const progress = data?.data ?? null;
  const status = progress?.status;
  const playlistId = progress?.playlistId;

  // ── React to the moment an import finishes ────────────────────────────────
  // Tracks the previous status so the side effect fires on a genuine
  // transition, not on every poll — and not when the hook mounts against an
  // import that finished long ago (revisiting the page shouldn't re-toast).
  const prevStatusRef = useRef<TImportStatus | undefined>(undefined);

  useEffect(() => {
    if (!status) return;

    const previous = prevStatusRef.current;
    prevStatusRef.current = status;

    if (previous === undefined) return; // first observation — record only
    if (previous === status) return; // no change
    if (!isTerminalImportStatus(status)) return;

    if (status === "COMPLETED") {
      // Newly downloaded tracks are now attached to the playlist — refresh it
      // so they actually appear without a manual reload.
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYLISTS.ALL] });
      if (playlistId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(playlistId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLIST_IMPORT.HISTORY(),
      });
      toast.success(TOAST_MESSAGES.PLAYLIST_IMPORT.COMPLETED);
    }

    if (status === "FAILED") {
      toast.error(TOAST_MESSAGES.PLAYLIST_IMPORT.FAILED);
    }
    // CANCELLED is toasted by the cancel mutation that caused it.
  }, [status, playlistId]);

  return {
    progress,
    isLoading,
    isError,
    error,
    isTerminal: isTerminalImportStatus(status),
  };
};
