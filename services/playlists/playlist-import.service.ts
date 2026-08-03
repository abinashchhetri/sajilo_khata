// ─────────────────────────────────────────────────────────────────────────────
// Playlist Import Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls for importing a source playlist (YouTube) into a Sajilo Khata
// playlist. One function per backend endpoint.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  IImportPreview,
  IStartImportResult,
  IImportProgress,
  IImportItem,
  IImportItemsParams,
  IImportHistoryItem,
  IImportHistoryParams,
  IRetryImportResult,
  TStartImportBody,
  TPaginatedImport,
} from "@/types/playlists/import.types";

// GET /playlists/import/preview — inspects the source playlist without
// importing. Takes ~2s server-side (yt-dlp) and is rate limited to 20/hour,
// so callers must fire this deliberately, never on keystroke.
export const fetchImportPreview = async (
  url: string,
): Promise<TApiResponse<IImportPreview>> => {
  const { data } = await apiClient.get(
    `/playlists/import/preview?url=${encodeURIComponent(url)}`,
  );
  return data;
};

// POST /playlists/import — queues the import and returns immediately (~2.5s).
// Downloads continue server-side; poll fetchImportProgress for status.
export const startImport = async (
  body: TStartImportBody,
): Promise<TApiResponse<IStartImportResult>> => {
  const { data } = await apiClient.post("/playlists/import", body);
  return data;
};

// GET /playlists/import/:importId — O(1) progress snapshot, safe to poll.
export const fetchImportProgress = async (
  importId: string,
): Promise<TApiResponse<IImportProgress>> => {
  const { data } = await apiClient.get(`/playlists/import/${importId}`);
  return data;
};

// GET /playlists/import/:importId/items — the full per-track list.
// Double-nested: the array lands at response.data.data.
export const fetchImportItems = async ({
  importId,
  params,
}: {
  importId: string;
  params?: IImportItemsParams;
}): Promise<TApiResponse<TPaginatedImport<IImportItem>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/playlists/import/${importId}/items${query ? `?${query}` : ""}`,
  );
  return data;
};

// GET /playlists/import — past imports, newest first. Double-nested.
export const fetchImportHistory = async (
  params?: IImportHistoryParams,
): Promise<TApiResponse<TPaginatedImport<IImportHistoryItem>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/playlists/import${query ? `?${query}` : ""}`,
  );
  return data;
};

// POST /playlists/import/:importId/cancel — 409 if already finished.
// Tracks mid-download still finish; nothing new starts.
export const cancelImport = async (
  importId: string,
): Promise<TApiResponse<null>> => {
  const { data } = await apiClient.post(
    `/playlists/import/${importId}/cancel`,
  );
  return data;
};

// POST /playlists/import/:importId/retry — 400 if nothing failed.
export const retryImport = async (
  importId: string,
): Promise<TApiResponse<IRetryImportResult>> => {
  const { data } = await apiClient.post(`/playlists/import/${importId}/retry`);
  return data;
};
