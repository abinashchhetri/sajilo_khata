// ─────────────────────────────────────────────────────────────────────────────
// NowPlayingWidget
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard card that surfaces playback state. Uses the same dark-pocket
// treatment as the MusicPlayer bar so the music context is visually consistent
// even when embedded in the Notion-light finance dashboard.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import Image from "next/image";
import { Music, Pause, Play } from "lucide-react";

import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { truncate } from "@/utils/format.utils";
import { ROUTES } from "@/lib/constants/routes.constants";

// ─────── Component ───────────────────────────────────────────────────────────

const NowPlayingWidget = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    pauseTrack,
    resumeTrack,
  } = useMusicPlayer();

  const progressPct =
    duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;

  // ── Idle state ────────────────────────────────────────────────────────────

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-800">
            <Music size={15} className="text-zinc-500" />
          </div>
          <p className="text-sm text-zinc-400">Nothing playing</p>
        </div>
        <Link
          href={ROUTES.MUSIC}
          className="shrink-0 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
        >
          Browse library →
        </Link>
      </div>
    );
  }

  // ── Active state ──────────────────────────────────────────────────────────

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Cover with playing ring */}
        <div className={[
          "shrink-0 rounded-md overflow-hidden transition-all",
          isPlaying ? "ring-2 ring-accent-teal ring-offset-1 ring-offset-zinc-950" : "",
        ].join(" ")}>
          {currentTrack.coverUrl ? (
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-800">
              <Music size={14} className="text-zinc-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">
            {truncate(currentTrack.title, 22)}
          </p>
          <p className="truncate text-xs text-zinc-400">
            {truncate(currentTrack.artist, 28)}
          </p>
        </div>

        {/* Play / Pause */}
        <button
          onClick={isPlaying ? pauseTrack : resumeTrack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={13} fill="currentColor" />
          ) : (
            <Play size={13} fill="currentColor" className="translate-x-px" />
          )}
        </button>
      </div>

      {/* Progress bar — flush to bottom edge, no padding */}
      <div className="h-0.5 w-full bg-zinc-800">
        <div
          className="h-full bg-accent-teal transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex justify-end px-4 py-1.5">
        <Link
          href={ROUTES.MUSIC}
          className="text-[11px] text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Open library →
        </Link>
      </div>
    </div>
  );
};

export default NowPlayingWidget;
