// ─────────────────────────────────────────────────────────────────────────────
// DownloadTrackButton
// ─────────────────────────────────────────────────────────────────────────────
// Saves one track. Small icon button sized to sit inside a track row.
//
// Only meaningful for tracks whose audio is already on the server — an
// uncached track has nothing to hand out a link for, so callers should not
// render this for one.
//
// stopPropagation matters: track rows are themselves clickable (they start
// playback), so without it downloading would also begin playing the track.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { Download, Loader2 } from "lucide-react";

import { useHandleDownloadTrack } from "@/hooks/react-query/playlist-download/use-download-track.hook";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  trackId: string;
  /** Dark music-page surface vs the default light one. */
  darkContext?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const DownloadTrackButton = ({ trackId, darkContext = false }: Props) => {
  const { handleDownloadTrack, isPending } = useHandleDownloadTrack();

  return (
    <button
      type="button"
      aria-label="Download track"
      title="Download track"
      disabled={isPending}
      onClick={(e) => {
        // The parent row starts playback on click — don't do both.
        e.stopPropagation();
        handleDownloadTrack(trackId);
      }}
      className={[
        "shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-50",
        darkContext
          ? "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-100"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Download size={14} />
      )}
    </button>
  );
};

export default DownloadTrackButton;
