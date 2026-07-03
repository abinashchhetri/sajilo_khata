// ─────────────────────────────────────────────────────────────────────────────
// Playlist Types
// ─────────────────────────────────────────────────────────────────────────────

import type { ITrack } from "@/types/music/music.types";

export interface IPlaylist {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  isActive: boolean;
  trackCount: number;
  createdAt: string;
}

export interface IPlaylistWithTracks extends IPlaylist {
  tracks: ITrack[];
}

export interface ICreatePlaylist {
  name: string;
  description?: string;
  coverUrl?: string;
}

export interface IUpdatePlaylist {
  name?: string;
  description?: string;
  coverUrl?: string;
}

export interface IAddTrackToPlaylist {
  trackId: string;
  position?: number;
}

export interface IReorderTrack {
  trackId: string;
  newPosition: number;
}
