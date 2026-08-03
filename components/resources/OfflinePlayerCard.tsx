// ─────────────────────────────────────────────────────────────────────────────
// OfflinePlayerCard
// ─────────────────────────────────────────────────────────────────────────────
// Download card for the standalone offline player — a single HTML file the
// user keeps on their device and opens directly.
//
// The `download` attribute matters here: without it the browser would just
// render the file in a tab, where it is far less useful. The file is served
// from /public, so this is a plain link, not an API call.
//
// Used on the Resources page and, in compact form, beside the music library.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { Download, FolderOpen, Music, WifiOff } from "lucide-react";

import { DOWNLOAD_CONSTANTS } from "@/lib/constants/download.constants";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  /** Slim single-row variant for embedding beside an existing section. */
  compact?: boolean;
  /** Match the dark music-page surface. */
  darkSurface?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const OfflinePlayerCard = ({ compact = false, darkSurface = false }: Props) => {
  const downloadLink = (
    <a
      href={DOWNLOAD_CONSTANTS.OFFLINE_PLAYER_PATH}
      download={DOWNLOAD_CONSTANTS.OFFLINE_PLAYER_FILENAME}
      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 py-2 text-button text-primary-foreground transition-colors hover:bg-primary-active"
    >
      <Download size={14} />
      Download player
    </a>
  );

  // ── Compact: one row, for the music library page ──────────────────────────
  if (compact) {
    return (
      <div
        className={[
          "flex flex-wrap items-center gap-3 rounded-lg border p-4",
          darkSurface ? "border-zinc-800 bg-zinc-900" : "border-hairline bg-canvas",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
            darkSurface ? "bg-zinc-800" : "bg-canvas-soft",
          ].join(" ")}
        >
          <WifiOff
            size={17}
            className={darkSurface ? "text-zinc-400" : "text-muted-foreground"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={[
              "text-body-sm font-medium",
              darkSurface ? "text-zinc-100" : "text-foreground",
            ].join(" ")}
          >
            Offline player
          </p>
          <p className="text-caption text-muted-foreground">
            Play downloaded playlists with no internet connection.
          </p>
        </div>
        {downloadLink}
      </div>
    );
  }

  // ── Full card: the Resources page ─────────────────────────────────────────
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-canvas-soft">
          <Music size={20} className="text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-eyebrow uppercase text-ink-faint">Tool</p>
            <h3 className="mt-1 text-title text-foreground">Offline Player</h3>
            <p className="mt-1.5 text-body-sm text-muted-foreground">
              A single HTML file that plays your downloaded playlists straight
              from a folder on your device. No internet, no install, no account
              — open it and pick the folder you unzipped.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                icon: FolderOpen,
                text: "Reads playlist.json for titles, artists and order — or falls back to the numbered filenames.",
              },
              {
                icon: Music,
                text: "Continuous playback with shuffle, repeat, search, keyboard shortcuts and media-key support.",
              },
              {
                icon: WifiOff,
                text: "Runs entirely on your device. Nothing is uploaded and nothing is tracked.",
              },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-2.5">
                <item.icon
                  size={14}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <p className="text-body-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Accurate compatibility — WebM/Opus does not play on iOS Safari */}
          <p className="rounded-md bg-canvas-soft px-3 py-2 text-caption text-muted-foreground">
            Downloads are WebM/Opus. They play in Chrome, Edge, Firefox and on
            Android, but Safari on iPhone and iPad cannot decode them.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {downloadLink}
            <a
              href={DOWNLOAD_CONSTANTS.OFFLINE_PLAYER_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-sm text-primary hover:underline"
            >
              Open in a new tab first
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePlayerCard;
