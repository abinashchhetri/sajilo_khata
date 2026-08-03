// ─────────────────────────────────────────────────────────────────────────────
// Playlist Import Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the backend's playlist-import contract exactly.
//
// Two details worth knowing before touching these shapes:
//   1. List endpoints are DOUBLE-NESTED — TApiResponse<TPaginatedImport<T>>
//      puts the array at `response.data.data`, metadata at `response.data.total`.
//      This is the repo's existing pagination convention (see investments).
//   2. `progress.percentComplete` counts RESOLVED tracks (completed + failed +
//      skipped), not just completed. Always read it from the server — never
//      recompute it as completed/total or the bar sticks below 100 whenever a
//      track fails.
// ─────────────────────────────────────────────────────────────────────────────

import type { TPaginatedResponse } from "@/types/api.types";

// ─────── Status unions ───────────────────────────────────────────────────────

export type TImportStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

// SKIPPED is not an error — the track was already in the target playlist.
export type TImportItemStatus =
  | "PENDING"
  | "SEARCHING"
  | "DOWNLOADING"
  | "COMPLETED"
  | "SKIPPED"
  | "FAILED";

export type TImportSource = "YOUTUBE" | "SPOTIFY";

// ─────── Pagination ──────────────────────────────────────────────────────────

// The import list endpoints use the same envelope+pagination pairing as the
// rest of the app, so this aliases the shared shape rather than redefining it.
// Read as: TApiResponse<TPaginatedImport<T>> → data.data is the array.
export type TPaginatedImport<T> = TPaginatedResponse<T>;

// ─────── 1. Preview — GET /playlists/import/preview ──────────────────────────

export interface IImportPreviewTrack {
  position: number;
  title: string;
  artist: string | null;
  album: string | null;
  durationMs: number | null;
  coverUrl: string | null;
  alreadyCached: boolean;
}

export interface IImportPreview {
  source: TImportSource;
  sourcePlaylistId: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  ownerName: string | null;
  /** What the source reports the playlist holds. */
  totalTracks: number;
  /** What will ACTUALLY be queued — genuinely lower than totalTracks in
   *  practice (e.g. 100 of 183) because the source does not always serve
   *  every entry anonymously, and the server caps an import at 200. */
  importableTracks: number;
  /** Already on the server — these import instantly. */
  alreadyCached: number;
  estimatedMinutes: number;
  tracks: IImportPreviewTrack[];
}

// ─────── 2. Start — POST /playlists/import ───────────────────────────────────

// Exactly one destination; sending both or neither is a 400. Modelled as a
// discriminated union so the wrong shape fails at compile time, not runtime.
export type TStartImportBody =
  | { url: string; targetPlaylistId: string }
  | { url: string; createNewPlaylist: true; newPlaylistName?: string };

export interface IStartImportResult {
  importId: string;
  playlistId: string;
  playlistName: string;
  totalTracks: number;
  alreadyCached: number;
  status: TImportStatus;
}

// ─────── 3. Progress — GET /playlists/import/:importId ───────────────────────

export interface IImportProgressCounts {
  total: number;
  completed: number;
  failed: number;
  skipped: number;
  pending: number;
  /** Server-computed over RESOLVED tracks. Never recompute this. */
  percentComplete: number;
}

export interface IImportProcessingTrack {
  title: string;
  artist: string | null;
  status: TImportItemStatus;
}

export interface IImportRecentFailure {
  position: number;
  title: string;
  errorMessage: string;
}

export interface IImportProgress {
  importId: string;
  playlistId: string;
  status: TImportStatus;
  sourcePlaylistName: string;
  progress: IImportProgressCounts;
  /** At most 2 entries — matches server download concurrency. */
  currentlyProcessing: IImportProcessingTrack[];
  /** Capped at 5 by the server. Use the items endpoint for the full list. */
  recentFailures: IImportRecentFailure[];
  startedAt: string | null;
  finishedAt: string | null;
  errorMessage: string | null;
}

// ─────── 4. Items — GET /playlists/import/:importId/items ────────────────────

export interface IImportItem {
  position: number;
  sourceTitle: string;
  sourceArtist: string | null;
  status: TImportItemStatus;
  trackId: string | null;
  /** Always 100 for YouTube imports (the video was named directly, nothing
   *  was guessed). Exists for future metadata-only sources. */
  matchConfidence: number | null;
  errorMessage: string | null;
}

export interface IImportItemsParams {
  page?: number;
  limit?: number;
  status?: TImportItemStatus;
}

// ─────── 5. History — GET /playlists/import ──────────────────────────────────

export interface IImportHistoryItem {
  importId: string;
  playlistId: string;
  source: TImportSource;
  sourcePlaylistName: string;
  sourceCoverUrl: string | null;
  status: TImportStatus;
  totalTracks: number;
  completedTracks: number;
  failedTracks: number;
  skippedTracks: number;
  createdAt: string;
  finishedAt: string | null;
}

export interface IImportHistoryParams {
  page?: number;
  limit?: number;
}

// ─────── 7. Retry — POST /playlists/import/:importId/retry ───────────────────

export interface IRetryImportResult {
  requeued: number;
}
