// ─────────────────────────────────────────────────────────────────────────────
// useMusicPlayer
// ─────────────────────────────────────────────────────────────────────────────
// Thin hook that reads from MusicPlayerProvider's context.
// Returns the full IMusicPlayerContext shape.
// Throws if used outside of MusicPlayerProvider.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

export { useMusicPlayer } from "@/providers/music-player.provider";
