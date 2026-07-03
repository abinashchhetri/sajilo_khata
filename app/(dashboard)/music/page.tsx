// ─────────────────────────────────────────────────────────────────────────────
// Music Library Page
// ─────────────────────────────────────────────────────────────────────────────
// Hub for the music feature: search at the top, playlist grid in the middle,
// and recent play history at the bottom. All CRUD for playlists lives here —
// detail/track management lives on the playlist detail page.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { ListMusic, Music, Plus } from "lucide-react";

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
import MusicSearchBar from "@/components/music/MusicSearchBar";
import PlaylistCard from "@/components/music/PlaylistCard";
import TrackCard from "@/components/music/TrackCard";
import PlaylistForm from "@/components/playlists/PlaylistForm";

import { useGetPlaylists } from "@/hooks/react-query/playlists/get-playlists.hook";
import { useGetMusicHistory } from "@/hooks/react-query/music/get-music-history.hook";
import { useHandleCreatePlaylist } from "@/hooks/react-query/playlists/post-playlist.hook";
import { useHandleUpdatePlaylist } from "@/hooks/react-query/playlists/update-playlist.hook";
import { useHandleDeletePlaylist } from "@/hooks/react-query/playlists/delete-playlist.hook";
import type { IPlaylist } from "@/types/playlists/playlists.types";
import type { ICreatePlaylist } from "@/types/playlists/playlists.types";

// ─────── Component ───────────────────────────────────────────────────────────

const MusicPage = () => {
  // ── Playlist form dialog state ───────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  // null = create mode; non-null = edit mode with these default values
  const [editingPlaylist, setEditingPlaylist] = useState<IPlaylist | null>(null);

  // ── Delete confirm dialog state ──────────────────────────────────────────
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ── History pagination ───────────────────────────────────────────────────
  const [historyLimit, setHistoryLimit] = useState(20);

  // ── Data ─────────────────────────────────────────────────────────────────
  const { playlists, isLoading: playlistsLoading } = useGetPlaylists();
  const { tracks, isLoading: historyLoading } = useGetMusicHistory({
    page: 1,
    limit: historyLimit,
  });

  // ── Mutations ─────────────────────────────────────────────────────────────
  const { handleCreatePlaylist, isPending: createPending } =
    useHandleCreatePlaylist();
  const { handleUpdatePlaylist, isPending: updatePending } =
    useHandleUpdatePlaylist();
  const { handleDeletePlaylist, isPending: deletePending } =
    useHandleDeletePlaylist();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingPlaylist(null);
    setIsFormOpen(true);
  };

  const openEdit = (playlist: IPlaylist) => {
    setEditingPlaylist(playlist);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPlaylist(null);
  };

  const handleFormSubmit = async (data: ICreatePlaylist) => {
    if (editingPlaylist) {
      await handleUpdatePlaylist({ id: editingPlaylist.id, body: data });
    } else {
      await handleCreatePlaylist(data);
    }
    closeForm();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    await handleDeletePlaylist(deleteTargetId);
    setDeleteTargetId(null);
  };

  const showHistoryLoadMore = tracks.length >= historyLimit;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="rounded-2xl bg-zinc-950 p-6 space-y-8">
        {/* ── Section 1: Search ─────────────────────────────────────────────── */}
        <section>
          <MusicSearchBar />
        </section>

        {/* ── Section 2: Your Playlists ─────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-100">
              Your Playlists
            </h2>
            <Button size="sm" onClick={openCreate}>
              <Plus size={14} />
              New Playlist
            </Button>
          </div>

          {playlistsLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl bg-zinc-800" />
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <EmptyState
              icon={<ListMusic size={24} />}
              message="No playlists yet"
              ctaLabel="Create your first playlist"
              onCta={openCreate}
              darkSurface
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onEdit={() => openEdit(playlist)}
                  onDelete={() => setDeleteTargetId(playlist.id)}
                  darkSurface
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Section 3: Recently Played ───────────────────────────────────── */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-zinc-100">
            Recently Played
          </h2>

          {historyLoading ? (
            <div className="space-y-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg bg-zinc-800" />
              ))}
            </div>
          ) : tracks.length === 0 ? (
            <EmptyState
              icon={<Music size={24} />}
              message="Nothing played yet — search for a track above"
              darkSurface
            />
          ) : (
            <div className="space-y-0.5">
              {tracks.map((track) => (
                <TrackCard key={track.id} track={track} showPlayCount darkContext />
              ))}
              {showHistoryLoadMore && (
                <div className="pt-3 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={() => setHistoryLimit((prev) => prev + 20)}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ── Playlist form dialog ─────────────────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPlaylist ? "Edit Playlist" : "New Playlist"}
            </DialogTitle>
          </DialogHeader>
          <PlaylistForm
            defaultValues={
              editingPlaylist
                ? {
                    name: editingPlaylist.name,
                    description: editingPlaylist.description ?? undefined,
                    coverUrl: editingPlaylist.coverUrl ?? undefined,
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            isPending={createPending || updatePending}
          />
        </DialogContent>
      </Dialog>

      {/* ── Delete confirm dialog ────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deleteTargetId}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Delete playlist"
        description="Delete this playlist? This cannot be undone."
        onConfirm={handleDeleteConfirm}
        isPending={deletePending}
      />
    </>
  );
};

export default MusicPage;
