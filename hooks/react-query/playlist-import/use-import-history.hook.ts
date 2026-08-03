// ─────────────────────────────────────────────────────────────────────────────
// useGetImportHistory
// ─────────────────────────────────────────────────────────────────────────────
// Past imports, newest first. Also the source of truth for "is an import
// currently running?" — the server allows only one at a time, so the page
// uses this to resume a live import after a reload and to disable the import
// button (a second start would 409).
//
// Response is double-nested: the array lives at data.data.data.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchImportHistory } from "@/services/playlists/playlist-import.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { isTerminalImportStatus } from "@/lib/constants/import.constants";
import type { IImportHistoryParams } from "@/types/playlists/import.types";

export const useGetImportHistory = (params?: IImportHistoryParams) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.PLAYLIST_IMPORT.HISTORY(params),
    queryFn: () => fetchImportHistory(params),
  });

  const imports = data?.data?.data ?? [];

  // The one non-terminal import, if any. Drives resume-after-reload and the
  // disabled state of the import button.
  const activeImport =
    imports.find((item) => !isTerminalImportStatus(item.status)) ?? null;

  return {
    imports,
    activeImport,
    total: data?.data?.total ?? 0,
    hasNextPage: data?.data?.hasNextPage ?? false,
    isLoading,
    isError,
  };
};
