// ─────────────────────────────────────────────────────────────────────────────
// useGetPlaylists
// ─────────────────────────────────────────────────────────────────────────────
// Fetches all playlists for the current user.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchPlaylists } from "@/services/playlists/playlists.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetPlaylists = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PLAYLISTS.ALL],
    queryFn: fetchPlaylists,
  });

  return { playlists: data?.data ?? [], isLoading };
};
