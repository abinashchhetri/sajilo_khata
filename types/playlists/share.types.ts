// ─────────────────────────────────────────────────────────────────────────────
// Playlist Share Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the sharing contract exactly.
//
// Two things the resolve payload deliberately does NOT carry: the playlistId
// and the owner's identity. That is why a viewer cannot get playlist-context
// playback (or shuffle) on someone else's share — they have to save a copy
// first. Do not add those fields hoping they appear.
// ─────────────────────────────────────────────────────────────────────────────

// ─────── Create / get link — POST /playlists/:id/share ───────────────────────

export interface IShareLink {
  shareToken: string;
  /** Fully formed by the backend. Always use this — never rebuild the URL. */
  shareUrl: string;
  sharedAt: string;
  playlistId: string;
  name: string;
}

// ─────── Resolve — GET /playlists/shared/:token (public) ─────────────────────

export interface ISharedTrack {
  position: number;
  trackId: string;
  title: string;
  artist: string;
  album: string | null;
  durationSeconds: number;
  coverUrl: string | null;
  /** false while the server is still fetching the audio. */
  isPlayable: boolean;
}

export interface ISharedPlaylist {
  shareToken: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  trackCount: number;
  playableTracks: number;
  totalDurationSeconds: number;
  sharedAt: string;
  tracks: ISharedTrack[];
}

// ─────── Save a copy — POST /playlists/shared/:token/save ────────────────────

export interface ISaveSharedPlaylistBody {
  /** Defaults to the original playlist name when omitted. */
  name?: string;
}

export interface ISaveSharedPlaylistResult {
  playlistId: string;
  name: string;
  trackCount: number;
  /** true when the copy hit the 500-track cap. */
  truncated: boolean;
}

// ─────── Shuffle — POST /music/queue/shuffle ─────────────────────────────────

export interface IShuffleToggleBody {
  enabled: boolean;
}

export interface IShuffleUpNextTrack {
  id: string;
  title: string;
}

export interface IShuffleToggleResult {
  /** Authoritative — reconcile any optimistic UI against this. */
  shuffle: boolean;
  playlistId: string;
  upNext: IShuffleUpNextTrack[];
}
