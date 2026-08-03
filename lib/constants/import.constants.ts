// ─────────────────────────────────────────────────────────────────────────────
// Playlist Import Constants
// ─────────────────────────────────────────────────────────────────────────────
// Static config for the playlist-import feature. Server-enforced limits are
// mirrored here so the UI can set expectations and disable actions before a
// request round-trips just to be rejected.
// ─────────────────────────────────────────────────────────────────────────────

import type { TImportStatus } from "@/types/playlists/import.types";

// An import in one of these states will never change again — polling MUST
// stop when the status is one of them, or a forgotten tab polls forever.
export const TERMINAL_IMPORT_STATUSES: readonly TImportStatus[] = [
  "COMPLETED",
  "FAILED",
  "CANCELLED",
];

export const isTerminalImportStatus = (
  status: TImportStatus | undefined,
): boolean => !!status && TERMINAL_IMPORT_STATUSES.includes(status);

export const IMPORT_CONSTANTS = {
  POLL_INTERVAL_MS: 3000,

  // Server-enforced caps (mirrored for UI messaging, not authoritative)
  MAX_TRACKS_PER_IMPORT: 200,
  MAX_IMPORT_STARTS_PER_HOUR: 5,
  MAX_PREVIEWS_PER_HOUR: 20,

  // The server downloads 2 tracks at a time at roughly 10–90s each, so a
  // 100-track import lands around 30–40 minutes. Used to set expectations.
  SERVER_CONCURRENCY: 2,

  ITEMS_PAGE_SIZE: 50,
  HISTORY_PAGE_SIZE: 10,

  // Spotify links parse fine but the API now requires the app owner to hold a
  // Premium subscription, so the server returns 503. We suggest a converter
  // rather than building any Spotify-specific affordance.
  SPOTIFY_CONVERTER_HINT:
    "Spotify importing is unavailable. Convert the playlist to YouTube with a free tool like TuneMyMusic or Soundiiz, then paste that link here.",
} as const;
