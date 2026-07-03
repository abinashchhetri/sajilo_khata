// ─────────────────────────────────────────────────────────────────────────────
// MusicPlayer
// ─────────────────────────────────────────────────────────────────────────────
// Persistent bottom bar — dark Spotify-pocket inside the Notion-light app.
// Owns the <audio> element and all playback logic. The dark surface (#09090b)
// creates a deliberate contrast moment: the app recedes, the music comes forward.
//
// Key invariants:
// - prepareNextFiredRef is a useRef so onTimeUpdate (~4×/s) never re-renders.
// - isPlaying→play/pause useEffect is the sole audio controller.
// - streamUrl change resets counters + fire guard for a clean start.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Loader2,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";

import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { useHandlePrepareNext } from "@/hooks/react-query/music/post-prepare-next.hook";
import { formatDuration, truncate } from "@/utils/format.utils";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

// ─────── Component ───────────────────────────────────────────────────────────

const MusicPlayer = () => {
  const {
    currentTrack,
    streamUrl,
    nextTrack,
    isPlaying,
    isLoading,
    volume,
    pauseTrack,
    resumeTrack,
    setNextReady,
    advanceToNext,
    setVolume,
    setIsLoading,
    setPlaybackPosition,
  } = useMusicPlayer();

  const { handlePrepareNext } = useHandlePrepareNext();
  const audioRef = useRef<HTMLAudioElement>(null);
  const prepareNextFiredRef = useRef(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    prepareNextFiredRef.current = false;
  }, [streamUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentTrack) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center border-t border-zinc-800 bg-zinc-950 px-4"
      style={{ boxShadow: "0 -8px 32px rgba(0,0,0,0.45)" }}
    >
      <audio
        ref={audioRef}
        src={streamUrl ?? undefined}
        onTimeUpdate={() => {
          const t = audioRef.current?.currentTime ?? 0;
          const d = audioRef.current?.duration ?? 0;
          setCurrentTime(t);
          setDuration(d);
          setPlaybackPosition(t, d);
          if (d > 0 && d - t <= 30 && !prepareNextFiredRef.current) {
            prepareNextFiredRef.current = true;
            handlePrepareNext(currentTrack.id)
              .then((res) => {
                if (res?.data?.ready && res.data.track && res.data.streamUrl) {
                  setNextReady(res.data.track, res.data.streamUrl);
                }
              })
              .catch(() => {});
          }
        }}
        onEnded={() => { prepareNextFiredRef.current = false; advanceToNext(); }}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onCanPlay={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onError={() => { toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR); setIsLoading(false); }}
      />

      {/* ── Left: cover + track info ─────────────────────────────────────── */}
      <div className="flex w-1/3 min-w-0 items-center gap-3">
        <div className="relative shrink-0">
          {currentTrack.coverUrl ? (
            <Image
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              width={44}
              height={44}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-zinc-800">
              <Music size={20} className="text-zinc-500" />
            </div>
          )}
          {isPlaying && (
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-zinc-950 bg-accent-teal" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-100">
            {truncate(currentTrack.title, 26)}
          </p>
          <p className="truncate text-xs text-zinc-400">
            {truncate(currentTrack.artist, 22)}
          </p>
        </div>
      </div>

      {/* ── Center: controls + progress ───────────────────────────────────── */}
      <div className="flex w-1/3 flex-col items-center gap-2">
        <div className="flex items-center gap-5">
          <button
            disabled
            className="text-zinc-600 transition-colors"
            title="Previous (coming soon)"
          >
            <SkipBack size={17} />
          </button>

          <button
            onClick={isPlaying ? pauseTrack : resumeTrack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin text-zinc-950" />
            ) : isPlaying ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" className="translate-x-px" />
            )}
          </button>

          <button
            onClick={advanceToNext}
            disabled={!nextTrack}
            className="text-zinc-400 transition-colors hover:text-zinc-100 disabled:text-zinc-700"
            title={nextTrack ? "Skip to next" : "No next track"}
          >
            <SkipForward size={17} />
          </button>
        </div>

        {/* Progress */}
        <div className="flex w-full max-w-xs items-center gap-2">
          <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-zinc-500">
            {formatDuration(currentTime)}
          </span>
          <div className="relative flex-1">
            <input
              type="range"
              min={0}
              max={duration || 1}
              value={currentTime}
              onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = Number(e.target.value);
                }
              }}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-700
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm
                [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:bg-white"
              style={{
                background: `linear-gradient(to right, #2a9d99 ${progressPct}%, #3f3f46 ${progressPct}%)`,
              }}
            />
          </div>
          <span className="w-8 shrink-0 text-[10px] tabular-nums text-zinc-500">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* ── Right: volume ─────────────────────────────────────────────────── */}
      <div className="flex w-1/3 items-center justify-end gap-2">
        <Volume2 size={14} className="shrink-0 text-zinc-500" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 cursor-pointer appearance-none rounded-full bg-zinc-700
            [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-white
            [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:bg-white h-1"
          style={{
            background: `linear-gradient(to right, #2a9d99 ${volume * 100}%, #3f3f46 ${volume * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
