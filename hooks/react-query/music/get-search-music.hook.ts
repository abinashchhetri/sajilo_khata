// ─────────────────────────────────────────────────────────────────────────────
// useSearchMusic
// ─────────────────────────────────────────────────────────────────────────────
// Searches YouTube for tracks by keyword. Suppresses requests for strings
// shorter than 2 characters so the backend isn't hit on every keystroke.
// staleTime of 30 s lets the user re-open the same search without a refetch
// while keeping results fresh enough to reflect new uploads.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { searchMusic } from "@/services/music/music.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useSearchMusic = (q: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MUSIC.SEARCH(q),
    queryFn: () => searchMusic({ q }),
    enabled: q.length >= 2,
    staleTime: 30 * 1000,
  });

  return { results: data?.data ?? [], isLoading, isError };
};
