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
// - prepareNextFiredRef is an internal ref reset on each new track. Step 4's
//   player component reads it to avoid double-firing prepare-next mid-song.
// - advanceToNext reads nextTrack/nextStreamUrl via closure deps so it always
//   sees the latest queued track without stale closure issues.
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
} from "@/services/music/music.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { IDiscoveryTrack, ITrack } from "@/types/music/music.types";

const VOLUME_KEY = "music_volume";

// ─────── Types ───────────────────────────────────────────────────────────────

export interface IMusicPlayerContext {
  currentTrack: ITrack | null;
  streamUrl: string | null;
  nextTrack: ITrack | null;
  nextStreamUrl: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: ITrack) => Promise<void>;
  playDiscoveryTrack: (track: IDiscoveryTrack) => Promise<void>;
  pauseTrack: () => void;
  resumeTrack: () => void;
  setNextReady: (track: ITrack, streamUrl: string) => void;
  advanceToNext: () => void;
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
  const [nextTrack, setNextTrack] = useState<ITrack | null>(null);
  const [nextStreamUrl, setNextStreamUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Guards against prepare-next firing more than once per track (e.g. on
  // re-renders mid-song). Reset to false every time a new track starts.
  const prepareNextFiredRef = useRef(false);

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
    prepareNextFiredRef.current = false;
    try {
      const result = await playTrackService(track.id);
      const url =
        result.data.streamUrl ??
        `${process.env.NEXT_PUBLIC_API_URL}/music/stream/${result.data.track.id}`;
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
      prepareNextFiredRef.current = false;
      try {
        const result = await createAndPlayTrack(
          track.externalId,
          track.title,
          track.artist,
          track.coverUrl,
        );
        // Backend returns streamUrl=null when the track is not yet cached.
        // In that case, stream live via the /music/stream/:id endpoint which
        // authenticates with the httpOnly cookie (crossOrigin="use-credentials"
        // on the <audio> element ensures the cookie is sent cross-origin).
        const url =
          result.streamUrl ??
          `${process.env.NEXT_PUBLIC_API_URL}/music/stream/${result.track.id}`;
        setCurrentTrack(result.track);
        setStreamUrl(url);
        setIsPlaying(true);
      } catch {
        toast.error(TOAST_MESSAGES.MUSIC.PLAY_ERROR);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const pauseTrack = useCallback(() => setIsPlaying(false), []);

  const resumeTrack = useCallback(() => setIsPlaying(true), []);

  const setNextReady = useCallback((track: ITrack, url: string) => {
    setNextTrack(track);
    setNextStreamUrl(url);
  }, []);

  // Advances to the pre-cached next track. Clears the next slot so the
  // recommendation cycle can fill it with the next-next track.
  const advanceToNext = useCallback(() => {
    if (nextTrack && nextStreamUrl) {
      setCurrentTrack(nextTrack);
      setStreamUrl(nextStreamUrl);
      setIsPlaying(true);
      setNextTrack(null);
      setNextStreamUrl(null);
    } else {
      setIsPlaying(false);
    }
  }, [nextTrack, nextStreamUrl]);

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
        nextTrack,
        nextStreamUrl,
        isPlaying,
        isLoading,
        volume,
        currentTime,
        duration,
        playTrack,
        playDiscoveryTrack,
        pauseTrack,
        resumeTrack,
        setNextReady,
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
