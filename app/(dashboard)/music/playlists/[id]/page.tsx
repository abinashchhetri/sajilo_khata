// ─────────────────────────────────────────────────────────────────────────────
// Playlist Detail Page
// ─────────────────────────────────────────────────────────────────────────────
// Inside view of a single playlist: track list with positions, play all,
// reorder via drag-and-drop, remove tracks, and add more tracks via search.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  GripVertical,
  ListMusic,
  Loader2,
  Music,
  Play,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import TrackCard from "@/components/music/TrackCard";
import MusicSearchBar from "@/components/music/MusicSearchBar";

import { useGetPlaylist } from "@/hooks/react-query/playlists/get-playlist.hook";
import { useHandleRemoveTrack } from "@/hooks/react-query/playlists/remove-track.hook";
import { useHandleReorderTrack } from "@/hooks/react-query/playlists/reorder-track.hook";
import { useHandleDeletePlaylist } from "@/hooks/react-query/playlists/delete-playlist.hook";
import { useHandleAddTrack } from "@/hooks/react-query/playlists/add-track.hook";
import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";
import type { IDiscoveryTrack, ITrack } from "@/types/music/music.types";

// ─────── Gradient helpers (mirrors PlaylistCard) ──────────────────────────────

const GRADIENTS: [string, string][] = [
  ["#7c3aed", "#4f46e5"],
  ["#0ea5e9", "#06b6d4"],
  ["#10b981", "#0d9488"],
  ["#f97316", "#eab308"],
  ["#ec4899", "#f43f5e"],
];

function getGradient(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

// ─────── Component ───────────────────────────────────────────────────────────

const PlaylistDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [isAddTracksOpen, setIsAddTracksOpen] = useState(false);
  const [deletePlaylistOpen, setDeletePlaylistOpen] = useState(false);
  const [removeTrackId, setRemoveTrackId] = useState<string | null>(null);

  // ── Local track order for optimistic reorder ──────────────────────────────
  const [localTracks, setLocalTracks] = useState<ITrack[]>([]);
  const draggingIdRef = useRef<string | null>(null);
  const dragStartIndexRef = useRef<number>(-1);

  // ── Data ──────────────────────────────────────────────────────────────────
  const { playlist, isLoading, isError } = useGetPlaylist(id);
  const { playTrack } = useMusicPlayer();

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { handleAddTrack, isPending: addPending } = useHandleAddTrack();
  const { handleRemoveTrack, isPending: removePending } = useHandleRemoveTrack();
  const { handleReorderTrack } = useHandleReorderTrack();
  const { handleDeletePlaylist, isPending: deletePending } = useHandleDeletePlaylist();

  // Sync local track order from server data
  useEffect(() => {
    if (playlist?.tracks) {
      setLocalTracks(playlist.tracks);
    }
  }, [playlist?.tracks]);

  // Reset dragging state if mouse leaves the window mid-drag
  useEffect(() => {
    const handleMouseLeave = () => {
      draggingIdRef.current = null;
      dragStartIndexRef.current = -1;
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  // ── Drag reorder handlers ─────────────────────────────────────────────────

  const handleDragStart = (track: ITrack, index: number) => {
    draggingIdRef.current = track.id;
    dragStartIndexRef.current = index;
  };

  const handleDragEnter = (targetIndex: number) => {
    if (draggingIdRef.current === null) return;
    const sourceIndex = localTracks.findIndex(
      (t) => t.id === draggingIdRef.current,
    );
    if (sourceIndex === -1 || sourceIndex === targetIndex) return;

    setLocalTracks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleDragEnd = async () => {
    const trackId = draggingIdRef.current;
    draggingIdRef.current = null;
    dragStartIndexRef.current = -1;

    if (!trackId) return;

    const newPosition = localTracks.findIndex((t) => t.id === trackId);
    if (newPosition === -1) return;

    try {
      await handleReorderTrack({
        playlistId: id,
        body: { trackId, newPosition: newPosition + 1 },
      });
    } catch {
      // Fall back to server state on error
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PLAYLISTS.SINGLE(id),
      });
    }
  };

  // Fire handleDragEnd on global mouseup so releasing outside a row still commits
  useEffect(() => {
    document.addEventListener("mouseup", handleDragEnd);
    return () => document.removeEventListener("mouseup", handleDragEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localTracks]);

  // ── Action handlers ───────────────────────────────────────────────────────

  const handlePlayAll = () => {
    if (!localTracks.length) return;
    // TODO: queue the remaining tracks once a queue feature is implemented
    playTrack(localTracks[0]);
  };

  const handleSelectTrack = async (track: IDiscoveryTrack) => {
    // Discovery tracks with no DB id haven't been played yet — they must be
    // played first (which downloads + caches them) before they can be added.
    if (!track.id) return;
    await handleAddTrack({ playlistId: id, body: { trackId: track.id } });
    setIsAddTracksOpen(false);
  };

  const handleRemoveConfirm = async () => {
    if (!removeTrackId) return;
    await handleRemoveTrack({ playlistId: id, trackId: removeTrackId });
    setRemoveTrackId(null);
  };

  const handleDeleteConfirm = async () => {
    await handleDeletePlaylist(id);
    router.push(ROUTES.MUSIC);
  };

  // ── Error state ───────────────────────────────────────────────────────────

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted-foreground">Could not load playlist.</p>
        <Button variant="outline" onClick={() => router.push(ROUTES.MUSIC)}>
          Go back
        </Button>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* ── Back link ───────────────────────────────────────────────────── */}
      <button
        onClick={() => router.push(ROUTES.MUSIC)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Playlists
      </button>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex gap-5">
          <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
          <div className="flex flex-col gap-2 pt-1">
            <Skeleton className="h-7 w-52" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ) : playlist ? (
        <div className="flex flex-wrap items-end gap-5">
          {/* Cover — larger, with subtle shadow */}
          {playlist.coverUrl ? (
            <Image
              src={playlist.coverUrl}
              alt={playlist.name}
              width={112}
              height={112}
              className="shrink-0 rounded-xl object-cover shadow-level-2"
            />
          ) : (
            <div
              className="h-28 w-28 shrink-0 rounded-xl shadow-level-2"
              style={{
                background: `linear-gradient(135deg, ${getGradient(playlist.id)[0]}, ${getGradient(playlist.id)[1]})`,
              }}
            />
          )}

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-sm text-muted-foreground">
                {playlist.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              {playlist.trackCount}{" "}
              {playlist.trackCount === 1 ? "track" : "tracks"}
            </p>

            {/* Action buttons */}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={handlePlayAll}
                disabled={localTracks.length === 0}
              >
                <Play size={14} />
                Play All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddTracksOpen(true)}
              >
                <Plus size={14} />
                Add Tracks
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setDeletePlaylistOpen(true)}
              >
                <Trash2 size={14} />
                Delete Playlist
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Track list ──────────────────────────────────────────────────── */}
      <section className="space-y-1">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : localTracks.length === 0 ? (
          <EmptyState
            icon={<ListMusic size={24} />}
            message="This playlist has no tracks yet"
            ctaLabel="Add Tracks"
            onCta={() => setIsAddTracksOpen(true)}
          />
        ) : (
          localTracks.map((track, index) => (
            <div
              key={track.id}
              onMouseEnter={() => handleDragEnter(index)}
              className={cn(
                "flex items-center gap-2 rounded-lg pr-2",
                draggingIdRef.current === track.id && "opacity-50",
              )}
            >
              {/* Position */}
              <span className="w-6 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {index + 1}
              </span>

              {/* Track card */}
              <div className="min-w-0 flex-1">
                <TrackCard track={track} compact />
              </div>

              {/* Drag handle */}
              <button
                onMouseDown={() => handleDragStart(track, index)}
                className="shrink-0 cursor-grab p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical size={16} />
              </button>

              {/* Remove */}
              <button
                onClick={() => setRemoveTrackId(track.id)}
                className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                title="Remove from playlist"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </section>

      {/* ── Add Tracks dialog ────────────────────────────────────────────── */}
      <Dialog open={isAddTracksOpen} onOpenChange={setIsAddTracksOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tracks</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Search for a track and click{" "}
              <span className="font-medium">+</span> to add it. Only cached
              tracks can be added.
            </p>
            {addPending ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                Adding track…
              </div>
            ) : (
              <MusicSearchBar
                onTrackSelect={handleSelectTrack}
                placeholder="Search tracks to add…"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Remove track confirm ─────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!removeTrackId}
        onOpenChange={(open) => !open && setRemoveTrackId(null)}
        title="Remove track"
        description="Remove this track from the playlist?"
        confirmLabel="Remove"
        onConfirm={handleRemoveConfirm}
        isPending={removePending}
      />

      {/* ── Delete playlist confirm ──────────────────────────────────────── */}
      <ConfirmDialog
        open={deletePlaylistOpen}
        onOpenChange={setDeletePlaylistOpen}
        title="Delete playlist"
        description="Delete this playlist and all its tracks? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        isPending={deletePending}
      />
    </div>
  );
};

export default PlaylistDetailPage;
