// ─────────────────────────────────────────────────────────────────────────────
// useGetPresignedUrl
// ─────────────────────────────────────────────────────────────────────────────
// Fetches a presigned S3 URL for a cached track. staleTime is 45 min so the
// URL is refreshed before S3 expires it at 60 min without unnecessary refetches.
// The enabled flag lets the player suppress the query until it actually needs
// the URL (e.g. after the track is selected but before playback starts).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { getPresignedUrl } from "@/services/music/music.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetPresignedUrl = (trackId: string, enabled = true) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.MUSIC.PRESIGNED(trackId),
    queryFn: () => getPresignedUrl(trackId),
    enabled: !!trackId && enabled,
    staleTime: 45 * 60 * 1000,
  });

  return { data: data?.data, isLoading, isError };
};
