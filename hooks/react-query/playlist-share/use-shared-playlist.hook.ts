// ─────────────────────────────────────────────────────────────────────────────
// useGetSharedPlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Resolves a share token. PUBLIC — this runs for visitors who have never
// signed in, which is the entire point of a share link.
//
// retry: false because the only realistic failure is a 404 (invalid or
// revoked), and retrying a permanent 404 just delays the message.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchSharedPlaylist } from "@/services/playlists/playlist-share.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetSharedPlaylist = (token: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST_SHARE.SHARED(token),
    queryFn: () => fetchSharedPlaylist(token),
    enabled: !!token,
    retry: false,
    // The owner can add tracks after sharing, so don't serve a stale copy for
    // the whole session — but this needs no aggressive refetching either.
    staleTime: 1000 * 60,
  });

  return {
    playlist: data ?? null,
    isLoading,
    isError,
  };
};
