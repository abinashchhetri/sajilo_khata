// ─────────────────────────────────────────────────────────────────────────────
// Shared Playlist Page — /shared/:token
// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC. The backend builds every share URL pointing here, so this route has
// to render for someone who has never signed in — that is the whole point of
// a share link. It deliberately lives outside (dashboard) and its auth guard.
//
// Save to my library is the primary and only action. Playback is not offered:
// MusicPlayerProvider is mounted inside the dashboard layout, so there is no
// audio element on a public route, and the resolve payload carries no
// playlistId anyway — a viewer needs their own copy before they can get
// continuous playback or shuffle. Saving takes them straight there.
//
// Signed-out visitors who press Save have their token stashed before being
// sent to sign in, and land back here afterwards rather than on the dashboard.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Bookmark, Link2Off, ListMusic, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/context/use-auth.hook";
import { useGetSharedPlaylist } from "@/hooks/react-query/playlist-share/use-shared-playlist.hook";
import { useHandleSaveSharedPlaylist } from "@/hooks/react-query/playlist-share/use-save-shared-playlist.hook";
import {
  clearPendingShareToken,
  getPendingShareToken,
  setPendingShareToken,
} from "@/lib/pending-share";
import { ROUTES } from "@/lib/constants/routes.constants";
import { formatDuration } from "@/utils/format.utils";
import { formatLongDuration } from "@/utils/download-format.utils";

// ─────── Component ───────────────────────────────────────────────────────────

const SharedPlaylistPage = () => {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { playlist, isLoading, isError } = useGetSharedPlaylist(token);
  const { handleSaveSharedPlaylist, isPending: savePending } =
    useHandleSaveSharedPlaylist();

  // Someone who signed in specifically to save this playlist is returned here
  // by the callback page. Clear the intent so it can't fire again later.
  useEffect(() => {
    if (!authLoading && isAuthenticated && getPendingShareToken() === token) {
      clearPendingShareToken();
    }
  }, [authLoading, isAuthenticated, token]);

  const onSave = () => {
    if (!isAuthenticated) {
      // Survives the OAuth round trip, which leaves our origin entirely.
      setPendingShareToken(token);
      router.push(ROUTES.LOGIN);
      return;
    }
    handleSaveSharedPlaylist({ token }).catch(() => undefined);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="flex gap-5">
          <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3 pt-2">
            <Skeleton className="h-6 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-9 w-40 rounded-full" />
          </div>
        </div>
        <div className="mt-10 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      </main>
    );
  }

  // ── Invalid or revoked ────────────────────────────────────────────────────
  // A link that never existed and one that was revoked return the same 404 by
  // design, so this message covers both without guessing.
  if (isError || !playlist) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Link2Off size={20} className="text-muted-foreground" />
        </div>
        <h1 className="text-heading-3 text-foreground">
          This link isn&apos;t available
        </h1>
        <p className="mt-2 text-body-sm text-muted-foreground">
          It may have been revoked by the person who shared it, or the link may
          be incorrect.
        </p>
        <Link href={ROUTES.HOME} className="mt-6">
          <Button variant="outline" size="sm">
            Go to Sajilo Khata
          </Button>
        </Link>
      </main>
    );
  }

  // ── Playlist ──────────────────────────────────────────────────────────────
  const stillFetching = playlist.trackCount - playlist.playableTracks;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-16">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-accent-sky to-accent-purple shadow-level-1">
          {playlist.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={playlist.coverUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white">
              <ListMusic size={30} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-eyebrow uppercase text-ink-faint">
            Shared playlist
          </p>
          <h1 className="mt-1 text-heading-3 text-foreground">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="mt-1 text-body-sm text-muted-foreground">
              {playlist.description}
            </p>
          )}
          <p className="mt-1 text-body-sm text-muted-foreground">
            {playlist.trackCount} track{playlist.trackCount === 1 ? "" : "s"}
            {playlist.totalDurationSeconds > 0 &&
              ` · ${formatLongDuration(playlist.totalDurationSeconds)}`}
          </p>

          <div className="mt-4">
            <Button onClick={onSave} disabled={savePending}>
              {savePending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Bookmark size={14} />
                  Save to my library
                </>
              )}
            </Button>
            {!authLoading && !isAuthenticated && (
              <p className="mt-2 text-caption text-muted-foreground">
                You&apos;ll be asked to sign in, then brought straight back
                here.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Partial availability — tracks the server is still fetching */}
      {stillFetching > 0 && (
        <p className="mt-6 rounded-md bg-muted px-3 py-2 text-body-sm text-muted-foreground">
          {stillFetching} track{stillFetching === 1 ? " is" : "s are"} still
          downloading and won&apos;t be playable yet.
        </p>
      )}

      {/* Track list */}
      <div className="mt-8 overflow-hidden rounded-lg border border-hairline bg-canvas">
        {playlist.tracks.map((track) => (
          <div
            key={track.trackId}
            className={[
              "flex items-center gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0",
              track.isPlayable ? "" : "opacity-55",
            ].join(" ")}
          >
            <span className="w-6 shrink-0 text-center text-caption tabular-nums text-ink-faint">
              {track.position + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-sm text-foreground">
                {track.title}
              </p>
              <p className="truncate text-caption text-muted-foreground">
                {track.isPlayable ? track.artist : "Still downloading"}
              </p>
            </div>
            {track.durationSeconds > 0 && (
              <span className="shrink-0 text-caption tabular-nums text-ink-faint">
                {formatDuration(track.durationSeconds)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Footer note — explains why there is no play button here */}
      <p className="mt-6 text-caption text-muted-foreground">
        Save this playlist to your library to play it, shuffle it, or download
        it for offline listening.
      </p>
    </main>
  );
};

export default SharedPlaylistPage;
