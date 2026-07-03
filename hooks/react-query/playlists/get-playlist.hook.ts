// ─────────────────────────────────────────────────────────────────────────────
// useGetPlaylist
// ─────────────────────────────────────────────────────────────────────────────
// Fetches a single playlist with its full track list. Only fires when an id is
// present — guards against empty string from uninitialised route params.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPlaylistById } from "@/services/playlists/playlists.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetPlaylist = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(id),
    queryFn: () => fetchPlaylistById(id),
    enabled: !!id,
  });

  return { playlist: data?.data, isLoading, isError };
};
