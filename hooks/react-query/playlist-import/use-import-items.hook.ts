// ─────────────────────────────────────────────────────────────────────────────
// useGetImportItems
// ─────────────────────────────────────────────────────────────────────────────
// The full per-track list for one import, paginated and filterable by status.
//
// Only enabled when the caller opens the list — the progress endpoint stays
// O(1) precisely so this heavier query isn't needed on every poll.
//
// Response is double-nested (TApiResponse<TPaginatedImport<T>>): the array
// lives at data.data.data, pagination metadata alongside it.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchImportItems } from "@/services/playlists/playlist-import.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IImportItemsParams } from "@/types/playlists/import.types";

export const useGetImportItems = (
  importId: string | null,
  params?: IImportItemsParams,
  enabled = true,
) => {
  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST_IMPORT.ITEMS(importId ?? "", params),
    queryFn: () =>
      fetchImportItems({ importId: importId as string, params }),
    enabled: !!importId && enabled,
  });

  return {
    // Double-nested — guard every level.
    items: data?.data?.data ?? [],
    total: data?.data?.total ?? 0,
    page: data?.data?.page ?? 1,
    totalPages: data?.data?.totalPages ?? 0,
    hasNextPage: data?.data?.hasNextPage ?? false,
    hasPrevPage: data?.data?.hasPrevPage ?? false,
    isLoading,
    isFetching,
    isError,
  };
};
