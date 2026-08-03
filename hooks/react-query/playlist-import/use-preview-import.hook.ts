// ─────────────────────────────────────────────────────────────────────────────
// useGetImportPreview
// ─────────────────────────────────────────────────────────────────────────────
// Inspects a source playlist URL before committing to an import.
//
// Deliberately `enabled: false` — each call spawns a ~2s yt-dlp invocation on
// the server and is rate limited to 20/hour, so it fires only when the user
// clicks "Preview", never on keystroke. Call runPreview() to trigger it.
//
// GET failures are not toasted by the Axios interceptor, so `error` is exposed
// for the caller to render — the server's messages are written for users.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchImportPreview } from "@/services/playlists/playlist-import.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetImportPreview = (url: string) => {
  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST_IMPORT.PREVIEW(url),
    queryFn: () => fetchImportPreview(url),
    enabled: false, // manual only — see header
    retry: false, // rate limited; a retry burns another of the 20/hour
    staleTime: 1000 * 60 * 5, // re-previewing the same URL reuses the result
    gcTime: 1000 * 60 * 5,
  });

  return {
    preview: data?.data ?? null,
    isFetching,
    isError,
    error,
    runPreview: refetch,
  };
};
