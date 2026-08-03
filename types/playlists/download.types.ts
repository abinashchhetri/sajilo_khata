// ─────────────────────────────────────────────────────────────────────────────
// Playlist Download Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the offline-download contract exactly.
//
// Also declares the slice of the File System Access API this feature uses.
// `showSaveFilePicker` is not in TypeScript's DOM lib (tsconfig ships
// "dom" + "esnext"), so rather than a global augmentation that could clash
// with a future lib update, we describe only what we call and narrow onto it.
// ─────────────────────────────────────────────────────────────────────────────

// ─────── Manifest — GET /playlists/:id/download/manifest ─────────────────────

export interface IDownloadManifestTrack {
  position: number;
  /** Exact filename inside the ZIP — "01 - Artist - Title.webm".
   *  The zero-padded prefix is what makes the folder play in order in any
   *  file manager, so it must never be renamed client-side. */
  file: string;
  title: string;
  artist: string;
  album: string | null;
  durationSeconds: number;
  fileSizeBytes: number;
  coverUrl: string | null;
}

export interface IDownloadManifest {
  playlistId: string;
  name: string;
  /** Tracks in the playlist. */
  totalTracks: number;
  /** Tracks with audio ready on the server — only these end up in the ZIP. */
  downloadableTracks: number;
  /** Still importing or failed. Normal, not an error — must be surfaced. */
  unavailableTracks: number;
  totalBytes: number;
  totalDurationSeconds: number;
  format: string;
  /** Server-sanitised. Never override it — long/unsafe names are handled there. */
  suggestedFilename: string;
  tracks: IDownloadManifestTrack[];
}

// ─────── Single track — GET /playlists/tracks/:trackId/download ──────────────

export interface ITrackDownloadLink {
  /** Presigned S3 URL — self-authenticating, already carries
   *  Content-Disposition. Point the browser at it; never fetch+blob it. */
  url: string;
  filename: string;
  fileSizeBytes: number;
  durationSeconds: number;
  expiresInSeconds: number;
}

// ─────── Download lifecycle ──────────────────────────────────────────────────

export type TDownloadPhase =
  | "idle"
  | "preparing"
  | "downloading"
  | "done"
  | "error"
  | "cancelled";

/** Which of the two save strategies actually ran. */
export type TDownloadStrategy = "stream" | "blob";

/** Expected outcomes are returned, not thrown — a user cancelling the save
 *  picker is not an error and must not surface as one. */
export type TStreamZipResult =
  | { kind: "saved"; strategy: TDownloadStrategy }
  | { kind: "cancelled" }
  | { kind: "error"; message: string };

export interface IStreamZipArgs {
  playlistId: string;
  /** From the manifest — used verbatim as the save filename. */
  suggestedFilename: string;
  /** From the manifest — decides stream vs blob before a byte is fetched. */
  totalBytes: number;
  onProgress: (received: number, total: number) => void;
  signal: AbortSignal;
}

// ─────── File System Access API (minimal, hand-declared) ─────────────────────

export interface IFileSystemWritable {
  write(data: BufferSource | Blob | string): Promise<void>;
  close(): Promise<void>;
  abort(reason?: unknown): Promise<void>;
}

export interface IFileSystemFileHandle {
  createWritable(): Promise<IFileSystemWritable>;
}

export interface ISaveFilePickerOptions {
  suggestedName?: string;
  types?: {
    description?: string;
    accept: Record<string, string[]>;
  }[];
}

export type TShowSaveFilePicker = (
  options?: ISaveFilePickerOptions,
) => Promise<IFileSystemFileHandle>;
