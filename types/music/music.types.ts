// ─────────────────────────────────────────────────────────────────────────────
// Music Types
// ─────────────────────────────────────────────────────────────────────────────

export type TTrackSource = "YOUTUBE";

export interface ITrack {
  id: string;
  externalId: string;
  title: string;
  artist: string;
  album: string | null;
  duration: number;
  s3Key: string | null;
  coverUrl: string | null;
  genre: string | null;
  bitrate: number;
  source: TTrackSource;
  isCached: boolean;
  playCount: number;
  lastPlayedAt: string | null;
  createdAt: string;
}

export interface IStreamResponse {
  streamUrl: string;
  track: ITrack;
  expiresIn: number;
}

export interface IPrepareNextResponse {
  ready: boolean;
  track: ITrack | null;
  streamUrl: string | null;
}

export interface IPlayTrackResponse {
  track: ITrack;
  streamUrl: string;
}

export interface IRecommendationCacheItem {
  id: string;
  sourceTrackId: string;
  recommendedExternalId: string;
  recommendedTitle: string;
  recommendedArtist: string;
  recommendedCoverUrl: string | null;
  matchScore: number;
  isPrepared: boolean;
}

export interface ISearchMusicParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface IMusicHistoryParams {
  page?: number;
  limit?: number;
}

export interface IDiscoveryTrack {
  id: string | null;
  externalId: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  durationSeconds: number;
  isCached: boolean;
  source: "YOUTUBE";
}

export interface IDiscoverySearchResponse {
  results: IDiscoveryTrack[];
  total: number;
}
