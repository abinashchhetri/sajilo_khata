// ─────────────────────────────────────────────────────────────────────────────
// Music Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to music playback, streaming, and discovery.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  ITrack,
  IStreamResponse,
  IPrepareNextResponse,
  IPlayTrackResponse,
  IRecommendationCacheItem,
  ISearchMusicParams,
  IMusicHistoryParams,
  IDiscoverySearchResponse,
  IQueuePeekResponse,
  IQueueAdvanceResponse,
  IQueueStateResponse,
} from "@/types/music/music.types";

// Increment play count and return a presigned stream URL for the track
export const playTrack = async (
  trackId: string,
): Promise<TApiResponse<IPlayTrackResponse>> => {
  const { data } = await apiClient.post(`/music/play/${trackId}`);
  return data;
};

// Get a fresh presigned S3 URL for a cached track without incrementing play count
export const getPresignedUrl = async (
  trackId: string,
): Promise<TApiResponse<IStreamResponse>> => {
  const { data } = await apiClient.get(`/music/presigned/${trackId}`);
  return data;
};

// Tell the backend to pre-cache the next recommendation so it's ready before the
// current track ends. Fire-and-forget from the player's perspective.
export const prepareNextTrack = async (
  currentTrackId: string,
): Promise<TApiResponse<IPrepareNextResponse>> => {
  const { data } = await apiClient.post("/music/prepare-next", {
    currentTrackId,
  });
  return data;
};

// Fetch the pre-cached next track; returns null when nothing is prepared yet
export const getNextTrack = async (
  currentTrackId: string,
): Promise<TApiResponse<IStreamResponse | null>> => {
  const { data } = await apiClient.get(`/music/next/${currentTrackId}`);
  return data;
};

// Peek at the next track in the queue (read-only, does not consume it)
export const peekQueue = async (): Promise<IQueuePeekResponse> => {
  const { data } = await apiClient.get("/music/queue/peek");
  return data.data;
};

// Pop the next track from the queue and return its stream info
export const advanceQueue = async (): Promise<IQueueAdvanceResponse> => {
  const { data } = await apiClient.post("/music/queue/advance");
  return data.data;
};

// Fetch full queue state (length + next track preview)
export const fetchQueue = async (): Promise<IQueueStateResponse> => {
  const { data } = await apiClient.get("/music/queue");
  return data.data;
};

// Get AI-generated recommendations seeded from the given track
export const getRecommendations = async (
  trackId: string,
): Promise<TApiResponse<IRecommendationCacheItem[]>> => {
  const { data } = await apiClient.get(`/music/recommendations/${trackId}`);
  return data;
};

// Fetch the current user's playback history with optional pagination
export const getMusicHistory = async (
  params: IMusicHistoryParams,
): Promise<TApiResponse<ITrack[]>> => {
  const query = qs.stringify(params, { skipNulls: true });
  const { data } = await apiClient.get(
    `/music/history${query ? `?${query}` : ""}`,
  );
  return data;
};

// Search already-cached tracks in the local DB
export const searchMusic = async (
  params: ISearchMusicParams,
): Promise<TApiResponse<ITrack[]>> => {
  const query = qs.stringify(params, { skipNulls: true });
  const { data } = await apiClient.get(
    `/music/search${query ? `?${query}` : ""}`,
  );
  return data;
};

// Live YouTube discovery — returns candidates that may not be cached yet
export const findMusic = async (
  q: string,
): Promise<IDiscoverySearchResponse> => {
  const { data } = await apiClient.get(
    `/music/find?q=${encodeURIComponent(q)}`,
  );
  return data.data;
};

// Create a Track record (if needed), download, cache, and return a stream URL.
// This is intentionally slow on first play (yt-dlp download, 5-30 s).
export const createAndPlayTrack = async (
  externalId: string,
  title: string,
  artist: string,
  coverUrl?: string | null,
): Promise<IPlayTrackResponse> => {
  const { data } = await apiClient.post("/music/play-discovery", {
    externalId,
    title,
    artist,
    coverUrl,
  });
  return data.data;
};
