// ─────────────────────────────────────────────────────────────────────────────
// DiscoveryTrackRow
// ─────────────────────────────────────────────────────────────────────────────
// Renders one live YouTube discovery result (IDiscoveryTrack — may have no DB
// id yet). Separate from TrackCard because durationSeconds ≠ duration and the
// play path differs (download pipeline vs. direct S3 stream).
//
// Play button is revealed on hover; "+" stops propagation so adding to a
// playlist keeps the dropdown open for further additions.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Image from "next/image";
import { HardDrive, Music, Play, Plus } from "lucide-react";

import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { formatDuration, truncate } from "@/utils/format.utils";
import type { IDiscoveryTrack, ITrack } from "@/types/music/music.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  track: IDiscoveryTrack;
  onAddToPlaylist?: (track: IDiscoveryTrack) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const DiscoveryTrackRow = ({ track, onAddToPlaylist }: Props) => {
  const { playTrack, playDiscoveryTrack } = useMusicPlayer();

  const handlePlay = () => {
    if (track.id && track.isCached) {
      playTrack(track as unknown as ITrack);
    } else {
      playDiscoveryTrack(track);
    }
  };

  return (
    <div className="group flex cursor-default items-center gap-3 rounded-md p-2 transition-colors hover:bg-zinc-800/60">
      {/* Cover */}
      {track.coverUrl ? (
        <Image
          src={track.coverUrl}
          alt={track.title}
          width={40}
          height={40}
          className="shrink-0 rounded object-cover"
          style={{ width: 40, height: 40 }}
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-zinc-800">
          <Music size={16} className="text-zinc-500" />
        </div>
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100">
          {truncate(track.title, 32)}
        </p>
        <p className="truncate text-xs text-zinc-400">{track.artist}</p>
      </div>

      {/* Cached badge */}
      {track.isCached && (
        <div title="In your library" className="shrink-0 text-emerald-400">
          <HardDrive size={13} />
        </div>
      )}

      {/* Duration */}
      <span className="shrink-0 text-xs tabular-nums text-zinc-500">
        {formatDuration(track.durationSeconds)}
      </span>

      {/* Add to playlist */}
      {onAddToPlaylist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(track);
          }}
          className="shrink-0 rounded p-1 text-zinc-500 opacity-0 transition-all hover:text-zinc-200 group-hover:opacity-100"
          title="Add to playlist"
        >
          <Plus size={15} />
        </button>
      )}

      {/* Play — no stopPropagation; parent wrapper in MusicSearchBar closes dropdown */}
      <button
        onClick={handlePlay}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 opacity-0 shadow transition-all hover:scale-105 group-hover:opacity-100"
        title={track.isCached ? "Play" : "Download & play"}
      >
        <Play size={12} fill="currentColor" className="translate-x-px" />
      </button>
    </div>
  );
};

export default DiscoveryTrackRow;
