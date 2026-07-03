// ─────────────────────────────────────────────────────────────────────────────
// useGetMusicHistory
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the current user's playback history with optional pagination.
// isFetching is exposed so the UI can show a subtle loading state on refetch
// without hiding the existing list behind a full skeleton.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { getMusicHistory } from "@/services/music/music.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IMusicHistoryParams } from "@/types/music/music.types";

export const useGetMusicHistory = (params: IMusicHistoryParams) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEYS.MUSIC.HISTORY(params),
    queryFn: () => getMusicHistory(params),
  });

  return { tracks: data?.data ?? [], isLoading, isFetching };
};
