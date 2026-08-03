// ─────────────────────────────────────────────────────────────────────────────
// Playlist Share Service
// ─────────────────────────────────────────────────────────────────────────────
// Share-link management, public resolution, saving a copy, and the shuffle
// toggle. No side effects — no toasts, no routing, no cache logic.
//
// `fetchSharedPlaylist` is the one call that does NOT use apiClient. The
// endpoint is public and has to behave identically for a stranger and for a
// signed-in user, so it goes out with no credentials and no Authorization
// header at all. Sending a stale token to a public route risks a 401 that
// would make a perfectly valid link look revoked.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/services";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { TApiResponse } from "@/types/api.types";
import type {
  IShareLink,
  ISharedPlaylist,
  ISaveSharedPlaylistBody,
  ISaveSharedPlaylistResult,
  IShuffleToggleResult,
} from "@/types/playlists/share.types";

// ─────── Owner-side link management ──────────────────────────────────────────

// POST /playlists/:id/share — idempotent "get or create". Calling it again
// returns the same link, so it never invalidates one already sent.
export const createShareLink = async (
  playlistId: string,
): Promise<TApiResponse<IShareLink>> => {
  const { data } = await apiClient.post(`/playlists/${playlistId}/share`);
  return data;
};

// DELETE /playlists/:id/share — breaks every link already sent.
// Copies other people saved are unaffected.
export const revokeShareLink = async (playlistId: string): Promise<void> => {
  await apiClient.delete(`/playlists/${playlistId}/share`);
};

// ─────── Public resolution ───────────────────────────────────────────────────

// GET /playlists/shared/:token — deliberately credential-free, see header.
// Throws a plain Error carrying the user-facing message; the hook surfaces it.
export const fetchSharedPlaylist = async (
  token: string,
): Promise<ISharedPlaylist> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/playlists/shared/${encodeURIComponent(token)}`,
    { headers: { Accept: "application/json" } },
  );

  if (!response.ok) {
    // A revoked link and a link that never existed both 404 — and the backend
    // returns the same message for both on purpose. Don't try to tell them
    // apart; doing so would leak whether a token was ever valid.
    throw new Error(TOAST_MESSAGES.SHARE.INVALID_LINK);
  }

  const body: TApiResponse<ISharedPlaylist> = await response.json();
  return body.data;
};

// ─────── Saving a copy ───────────────────────────────────────────────────────

// POST /playlists/shared/:token/save — 400s if the viewer already owns it.
export const saveSharedPlaylist = async ({
  token,
  body,
}: {
  token: string;
  body?: ISaveSharedPlaylistBody;
}): Promise<TApiResponse<ISaveSharedPlaylistResult>> => {
  const { data } = await apiClient.post(
    `/playlists/shared/${token}/save`,
    body ?? {},
  );
  return data;
};

// ─────── Shuffle ─────────────────────────────────────────────────────────────

// POST /music/queue/shuffle — reshuffles the live queue.
// 400s when nothing is playing from a playlist, which is why the control is
// disabled outside playlist context rather than relying on the error.
export const toggleShuffle = async (
  enabled: boolean,
): Promise<TApiResponse<IShuffleToggleResult>> => {
  const { data } = await apiClient.post("/music/queue/shuffle", { enabled });
  return data;
};
