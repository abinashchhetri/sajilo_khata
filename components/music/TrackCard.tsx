// ─────────────────────────────────────────────────────────────────────────────
// TrackCard
// ─────────────────────────────────────────────────────────────────────────────
// Reusable row for a cached ITrack. Used in history, playlist detail, and the
// dashboard recently-played list. Playing state is read from context so callers
// never pass an isCurrentlyPlaying prop.
//
// Active row gets a teal left-border + tinted background and an animated
// 3-bar equalizer that replaces the static position number in playlist context.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Image from "next/image";
import { BarChart2, HardDrive, Music, Plus } from "lucide-react";

import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { formatDuration, truncate } from "@/utils/format.utils";
import type { ITrack } from "@/types/music/music.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  track: ITrack;
  onAddToPlaylist?: (track: ITrack) => void;
  showPlayCount?: boolean;
  compact?: boolean;
  darkContext?: boolean;
}

// ─────── Equalizer bars — rendered when the track is actively playing ─────────

const EqualizerBars = () => (
  <span className="flex items-end gap-[2px]" aria-hidden>
    <span className="music-eq-bar bg-accent-teal" />
    <span className="music-eq-bar bg-accent-teal" />
    <span className="music-eq-bar bg-accent-teal" />
  </span>
);

// ─────── Component ───────────────────────────────────────────────────────────

const TrackCard = ({
  track,
  onAddToPlaylist,
  showPlayCount = false,
  compact = false,
  darkContext = false,
}: Props) => {
  const { currentTrack, playTrack } = useMusicPlayer();

  const isCurrentlyPlaying = currentTrack?.id === track.id;
  const imageSize = compact ? 40 : 48;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => playTrack(track)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          playTrack(track);
        }
      }}
      className={[
        "group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors",
        isCurrentlyPlaying
          ? darkContext
            ? "bg-zinc-800"
            : "bg-[color:var(--accent-teal)]/5"
          : darkContext
          ? "hover:bg-zinc-800/60"
          : "hover:bg-muted/60",
      ].join(" ")}
    >
      {/* Cover image */}
      <div className="relative shrink-0" style={{ width: imageSize, height: imageSize }}>
        {track.coverUrl ? (
          <Image
            src={track.coverUrl}
            alt={track.title}
            width={imageSize}
            height={imageSize}
            className="rounded object-cover"
            style={{ width: imageSize, height: imageSize }}
          />
        ) : (
          <div
            className={[
              "flex items-center justify-center rounded",
              darkContext ? "bg-zinc-800" : "bg-muted",
            ].join(" ")}
            style={{ width: imageSize, height: imageSize }}
          >
            <Music
              size={compact ? 16 : 20}
              className={darkContext ? "text-zinc-500" : "text-muted-foreground"}
            />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {isCurrentlyPlaying && <EqualizerBars />}
          <p
            className={[
              "truncate text-sm font-medium",
              isCurrentlyPlaying
                ? "text-accent-teal"
                : darkContext
                ? "text-zinc-100"
                : "text-foreground",
            ].join(" ")}
          >
            {truncate(track.title, compact ? 28 : 40)}
          </p>
        </div>
        <p className={["truncate text-xs", darkContext ? "text-zinc-500" : "text-muted-foreground"].join(" ")}>
          {truncate(track.artist, compact ? 24 : 36)}
        </p>
      </div>

      {/* Play count */}
      {showPlayCount && (
        <div className={["flex shrink-0 items-center gap-1 text-xs", darkContext ? "text-zinc-500" : "text-muted-foreground"].join(" ")}>
          <BarChart2 size={12} />
          <span>{track.playCount}</span>
        </div>
      )}

      {/* Cached indicator */}
      {track.isCached && (
        <div title="Saved to library" className="shrink-0 text-emerald-500">
          <HardDrive size={13} />
        </div>
      )}

      {/* Duration */}
      <span className={["shrink-0 text-xs tabular-nums", darkContext ? "text-zinc-500" : "text-muted-foreground"].join(" ")}>
        {formatDuration(track.duration)}
      </span>

      {/* Add to playlist */}
      {onAddToPlaylist && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(track);
          }}
          className={[
            "shrink-0 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100",
            darkContext
              ? "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          ].join(" ")}
          title="Add to playlist"
        >
          <Plus size={15} />
        </button>
      )}
    </div>
  );
};

export default TrackCard;
