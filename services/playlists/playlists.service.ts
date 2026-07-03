// ─────────────────────────────────────────────────────────────────────────────
// Playlists Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to playlists and their tracks.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  IPlaylist,
  IPlaylistWithTracks,
  ICreatePlaylist,
  IUpdatePlaylist,
  IAddTrackToPlaylist,
  IReorderTrack,
} from "@/types/playlists/playlists.types";

export const fetchPlaylists = async (): Promise<TApiResponse<IPlaylist[]>> => {
  const { data } = await apiClient.get("/playlists");
  return data;
};

export const fetchPlaylistById = async (
  id: string,
): Promise<TApiResponse<IPlaylistWithTracks>> => {
  const { data } = await apiClient.get(`/playlists/${id}`);
  return data;
};

export const createPlaylist = async (
  body: ICreatePlaylist,
): Promise<TApiResponse<IPlaylist>> => {
  const { data } = await apiClient.post("/playlists", body);
  return data;
};

export const updatePlaylist = async ({
  id,
  body,
}: {
  id: string;
  body: IUpdatePlaylist;
}): Promise<TApiResponse<IPlaylist>> => {
  const { data } = await apiClient.patch(`/playlists/${id}`, body);
  return data;
};

export const deletePlaylist = async (id: string): Promise<void> => {
  await apiClient.delete(`/playlists/${id}`);
};

export const addTrackToPlaylist = async ({
  playlistId,
  body,
}: {
  playlistId: string;
  body: IAddTrackToPlaylist;
}): Promise<TApiResponse<IPlaylist>> => {
  const { data } = await apiClient.post(`/playlists/${playlistId}/tracks`, body);
  return data;
};

export const removeTrackFromPlaylist = async ({
  playlistId,
  trackId,
}: {
  playlistId: string;
  trackId: string;
}): Promise<void> => {
  await apiClient.delete(`/playlists/${playlistId}/tracks/${trackId}`);
};

export const reorderTrack = async ({
  playlistId,
  body,
}: {
  playlistId: string;
  body: IReorderTrack;
}): Promise<TApiResponse<IPlaylist>> => {
  const { data } = await apiClient.patch(
    `/playlists/${playlistId}/tracks/reorder`,
    body,
  );
  return data;
};
