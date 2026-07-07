// ─────────────────────────────────────────────────────────────────────────────
// MusicPlayerProvider
// ─────────────────────────────────────────────────────────────────────────────
// Global brain of the music feature. Owns all playback state and exposes it
// to every component inside the dashboard layout via context.
//
// Design notes:
// - playTrack calls the service directly (not useHandlePlayTrack) because hooks
//   cannot be called inside a non-hook function — the provider's playTrack is a
//   plain async function, not a hook.
// - volume is the only piece of state persisted to localStorage. Everything else
//   resets on navigation/refresh intentionally (no ghost players across sessions).
// - advanceToNext is async and calls advanceQueue() service. A ref guards against
//   concurrent calls (e.g. track-end races with user skip).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  playTrack as playTrackService,
  createAndPlayTrack,
  advanceQueue,
} from "@/services/music/music.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { ACCESS_TOKEN_KEY } from "@/lib/constants/auth-storage.constants";
import type { IDiscoveryTrack, ITrack } from "@/types/music/music.types";

// Appends the JWT as ?token= so the <audio> element can authenticate
// even on Safari where cross-origin httpOnly cookies are blocked by ITP.
const buildStreamUrl = (trackId: string): string => {
  const base = `${process.env.NEXT_PUBLIC_API_URL}/music/stream/${trackId}`;
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(ACCESS_TOKEN_KEY)
      : null;
  return token ? `${base}?token=${encodeURIComponent(token)}` : base;
};

const VOLUME_KEY = "music_volume";

// ─────── Types ───────────────────────────────────────────────────────────────

export interface IMusicPlayerContext {
  currentTrack: ITrack | null;
  streamUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  isAdvancing: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: ITrack) => Promise<void>;
  playDiscoveryTrack: (track: IDiscoveryTrack) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  advanceToNext: () => Promise<void>;
  setVolume: (v: number) => void;
  setIsLoading: (loading: boolean) => void;
  setPlaybackPosition: (t: number, d: number) => void;
}

// ─────── Context ─────────────────────────────────────────────────────────────

export const MusicPlayerContext = createContext<IMusicPlayerContext | null>(
  null,
);

// ─────── Component ───────────────────────────────────────────────────────────

const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<ITrack | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Ref guard prevents concurrent advance calls (track-end race with manual skip)
  const isAdvancingRef = useRef(false);

  // Restore persisted volume on mount
  useEffect(() => {
    const saved = localStorage.getItem(VOLUME_KEY);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) setVolumeState(parsed);
    }
  }, []);

  const playTrack = useCallback(async (track: ITrack) => {
    setIsLoading(true);
    try {
      const result = await playTrackService(track.id);
      const url = result.data.streamUrl ?? buildStreamUrl(result.data.track.id);
      setCurrentTrack(result.data.track);
      setStreamUrl(url);
      setIsPlaying(true);
    } catch {
      toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playDiscoveryTrack = useCallback(
    async (track: IDiscoveryTrack) => {
      setIsLoading(true);
      // Show a persistent toast so the user knows why nothing is playing yet.
      // The backend now blocks until the file is on S3 (5–30 s for new tracks).
      const toastId = toast.loading(`Downloading "${track.title.slice(0, 30)}"…`);
      try {
        const result = await createAndPlayTrack(
          track.externalId,
          track.title,
          track.artist,
          track.coverUrl,
        );
        const url = result.streamUrl ?? buildStreamUrl(result.track.id);
        setCurrentTrack(result.track);
        setStreamUrl(url);
        setIsPlaying(true);
        toast.success("Now playing!", { id: toastId, duration: 2000 });
        // Refresh Recently Played so the new track appears without a page reload
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MUSIC.HISTORY(),
        });
      } catch {
        toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR, { id: toastId });
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const pauseTrack = useCallback(() => setIsPlaying(false), []);

  const resumeTrack = useCallback(() => setIsPlaying(true), []);

  const advanceToNext = useCallback(async () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    setIsAdvancing(true);
    try {
      const result = await advanceQueue();
      const url = result.streamUrl ?? buildStreamUrl(result.track.id);
      setCurrentTrack(result.track);
      setStreamUrl(url);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
      toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR);
    } finally {
      isAdvancingRef.current = false;
      setIsAdvancing(false);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    localStorage.setItem(VOLUME_KEY, String(v));
  }, []);

  const setPlaybackPosition = useCallback((t: number, d: number) => {
    setCurrentTime(t);
    setDuration(d);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        streamUrl,
        isPlaying,
        isLoading,
        isAdvancing,
        volume,
        currentTime,
        duration,
        playTrack,
        playDiscoveryTrack,
        pauseTrack,
        resumeTrack,
        advanceToNext,
        setVolume,
        setIsLoading,
        setPlaybackPosition,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = (): IMusicPlayerContext => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};

export default MusicPlayerProvider;
