// ─────────────────────────────────────────────────────────────────────────────
// useGetDownloadManifest
// ─────────────────────────────────────────────────────────────────────────────
// The size/track breakdown for a playlist download.
//
// Fired when the download dialog opens rather than on page load — there is no
// reason to ask the server to tally a playlist the user may never download.
// Its answer decides everything downstream: which save strategy is safe, and
// whether we can honestly promise a complete archive.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchDownloadManifest } from "@/services/playlists/playlist-download.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetDownloadManifest = (
  playlistId: string,
  enabled = false,
) => {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST_DOWNLOAD.MANIFEST(playlistId),
    queryFn: () => fetchDownloadManifest(playlistId),
    enabled: !!playlistId && enabled,
    // Track availability changes while an import runs, so don't serve a stale
    // "3 tracks aren't ready" count from an earlier visit.
    staleTime: 0,
  });

  return {
    manifest: data?.data ?? null,
    isLoading,
    isFetching,
    isError,
    error,
    refetchManifest: refetch,
  };
};
