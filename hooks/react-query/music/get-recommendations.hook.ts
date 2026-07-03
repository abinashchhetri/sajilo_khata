// ─────────────────────────────────────────────────────────────────────────────
// useGetRecommendations
// ─────────────────────────────────────────────────────────────────────────────
// Fetches AI-generated recommendations seeded from the currently playing track.
// Only fires when a trackId is present — no requests on empty/null state.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { getRecommendations } from "@/services/music/music.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetRecommendations = (trackId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.MUSIC.RECOMMENDATIONS(trackId),
    queryFn: () => getRecommendations(trackId),
    enabled: !!trackId,
  });

  return { recommendations: data?.data ?? [], isLoading };
};
