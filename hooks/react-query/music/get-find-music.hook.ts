// ─────────────────────────────────────────────────────────────────────────────
// useDiscoverMusic
// ─────────────────────────────────────────────────────────────────────────────
// Hits GET /music/find which runs a live yt-dlp search and merges results with
// the local DB so callers know which results are already cached. Results are
// cached for 1 minute — YouTube search is slow enough that stale results are
// fine for a short window.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { findMusic } from "@/services/music/music.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useDiscoverMusic = (q: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MUSIC.FIND(q),
    queryFn: () => findMusic(q),
    enabled: q.length >= 2,
    staleTime: 60 * 1000,
  });

  return {
    results: data?.results ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
  };
};
