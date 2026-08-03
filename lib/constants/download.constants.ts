// ─────────────────────────────────────────────────────────────────────────────
// Offline Download Constants
// ─────────────────────────────────────────────────────────────────────────────
// Thresholds for choosing between the two save strategies.
//
// The blob fallback holds the entire archive in memory before writing it, so
// size is a hard constraint there, not a preference. The manifest endpoint
// gives us the byte count up front precisely so we can decide before starting
// rather than discovering it when the tab dies.
// ─────────────────────────────────────────────────────────────────────────────

export const DOWNLOAD_CONSTANTS = {
  /** Above this, warn before a blob download — it will be slow and memory-heavy. */
  WARN_BYTES: 200 * 1024 ** 2, // 200 MB
  /** Above this, refuse the blob path outright rather than crash the tab. */
  BLOCK_BLOB_BYTES: 500 * 1024 ** 2, // 500 MB

  ZIP_MIME: "application/zip",

  // WebM/Opus plays in Chrome, Edge, Firefox and on Android. It does NOT play
  // in Safari on iOS/iPadOS — state that accurately, never "works everywhere".
  FORMAT_HINT:
    "Files are WebM/Opus. They play in Chrome, Edge, Firefox and on Android, but not in Safari on iPhone or iPad.",

  UNZIP_HINT:
    "Unzip the file, then open the folder in any music player. Tracks are numbered so they stay in playlist order.",

  // Standalone player served from /public. Saved with `download` so the
  // browser stores it instead of opening it in a tab — it is only useful as
  // a local file the user keeps alongside their music.
  OFFLINE_PLAYER_PATH: "/offline-player.html",
  OFFLINE_PLAYER_FILENAME: "sajilo-khata-offline-player.html",
} as const;
