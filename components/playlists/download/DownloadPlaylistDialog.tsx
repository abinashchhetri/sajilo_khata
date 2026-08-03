// ─────────────────────────────────────────────────────────────────────────────
// DownloadPlaylistDialog
// ─────────────────────────────────────────────────────────────────────────────
// The whole download flow in one dialog: what you're about to get, progress
// while it runs, and where it went afterwards.
//
// The manifest is fetched when this opens, before any download button is
// enabled — it is the only honest source for the size, the track count, and
// how many tracks aren't ready yet.
//
// Closing mid-download does not cancel it. The transfer lives in a module
// store, so it keeps running and reopening this dialog re-attaches to it.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import { AlertTriangle, Check, Download, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetDownloadManifest } from "@/hooks/react-query/playlist-download/use-download-manifest.hook";
import {
  canStreamToDisk,
  useDownloadPlaylist,
} from "@/hooks/react-query/playlist-download/use-download-playlist.hook";
import { DOWNLOAD_CONSTANTS } from "@/lib/constants/download.constants";
import { getApiErrorMessage } from "@/utils/api-error.utils";
import {
  formatBytes,
  formatLongDuration,
} from "@/utils/download-format.utils";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  playlistId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const DownloadPlaylistDialog = ({ playlistId, open, onOpenChange }: Props) => {
  const { manifest, isFetching, isError, error } = useGetDownloadManifest(
    playlistId,
    open, // fetch only once the dialog is actually open
  );

  const {
    phase,
    percent,
    received,
    total,
    errorMessage,
    isRunning,
    start,
    cancel,
    reset,
  } = useDownloadPlaylist();

  // Clear a finished result when reopening, so a previous success or error
  // doesn't greet the user instead of a fresh idle state.
  useEffect(() => {
    if (open && !isRunning && (phase === "done" || phase === "cancelled")) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Derived ───────────────────────────────────────────────────────────────

  const manifestError = isError
    ? getApiErrorMessage(error, "Couldn't read this playlist's download size.")
    : null;

  const hasUnavailable = !!manifest && manifest.unavailableTracks > 0;
  const nothingToDownload = !!manifest && manifest.downloadableTracks === 0;

  const streamable = canStreamToDisk();
  const isOversizeForBlob =
    !!manifest &&
    !streamable &&
    manifest.totalBytes > DOWNLOAD_CONSTANTS.BLOCK_BLOB_BYTES;
  const isLargeForBlob =
    !!manifest &&
    !streamable &&
    !isOversizeForBlob &&
    manifest.totalBytes > DOWNLOAD_CONSTANTS.WARN_BYTES;

  const showResult = phase === "done" || phase === "error";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-level-2">
        <DialogHeader>
          <DialogTitle className="text-title">
            {phase === "done" ? "Download saved" : "Download playlist"}
          </DialogTitle>
          {!showResult && !isRunning && (
            <DialogDescription className="text-body-sm text-muted-foreground">
              Save every ready track as a ZIP you can play offline.
            </DialogDescription>
          )}
        </DialogHeader>

        {/* ── Loading the manifest ──────────────────────────────────────── */}
        {isFetching && !manifest && (
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        )}

        {/* ── Manifest failed ───────────────────────────────────────────── */}
        {manifestError && !manifest && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
            {manifestError}
          </p>
        )}

        {/* ── Idle: what you're about to download ───────────────────────── */}
        {manifest && !isRunning && !showResult && (
          <div className="space-y-4">
            <div>
              <p className="truncate text-title text-foreground">
                {manifest.name}
              </p>
              <p className="text-body-sm text-muted-foreground">
                {formatBytes(manifest.totalBytes)} ·{" "}
                {manifest.downloadableTracks} track
                {manifest.downloadableTracks === 1 ? "" : "s"} ·{" "}
                {formatLongDuration(manifest.totalDurationSeconds)}
              </p>
            </div>

            {/* Partial archive — normal while an import is still running */}
            {hasUnavailable && (
              <p className="flex gap-2 rounded-md bg-muted px-3 py-2 text-body-sm text-muted-foreground">
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-accent-orange"
                />
                <span>
                  {manifest.unavailableTracks} of {manifest.totalTracks} tracks
                  aren&apos;t ready yet and won&apos;t be included.
                </span>
              </p>
            )}

            {nothingToDownload && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
                No tracks are ready to download yet.
              </p>
            )}

            {/* Size guidance for browsers without the streaming API */}
            {isOversizeForBlob && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
                This playlist is too large for your browser to download in one
                piece. Use Chrome or Edge on desktop for playlists this size.
              </p>
            )}
            {isLargeForBlob && (
              <p className="rounded-md bg-muted px-3 py-2 text-body-sm text-muted-foreground">
                This is a large download for your browser and will be held in
                memory while it saves. Chrome or Edge on desktop handles large
                playlists more comfortably.
              </p>
            )}

            <p className="text-caption text-muted-foreground">
              {DOWNLOAD_CONSTANTS.FORMAT_HINT}
            </p>

            <Button
              className="w-full"
              onClick={() => start(manifest)}
              disabled={nothingToDownload || isOversizeForBlob}
            >
              <Download size={14} />
              Download {formatBytes(manifest.totalBytes)}
            </Button>
          </div>
        )}

        {/* ── Downloading ───────────────────────────────────────────────── */}
        {isRunning && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-accent-sky" />
              <span className="text-body-sm text-foreground">
                {phase === "preparing"
                  ? "Preparing your download…"
                  : "Downloading…"}
              </span>
            </div>

            {/* An unknown total gets an indeterminate bar rather than a lie */}
            <div className="space-y-1.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent-green transition-[width] duration-300"
                  style={{ width: total > 0 ? `${percent}%` : "35%" }}
                />
              </div>
              <p className="text-caption text-muted-foreground">
                {total > 0
                  ? `${formatBytes(received)} of ${formatBytes(total)}`
                  : `${formatBytes(received)} downloaded`}
              </p>
            </div>

            <p className="text-caption text-muted-foreground">
              You can close this window — the download keeps going.
            </p>

            <Button variant="outline" size="sm" onClick={cancel}>
              <X size={13} />
              Cancel download
            </Button>
          </div>
        )}

        {/* ── Done ──────────────────────────────────────────────────────── */}
        {phase === "done" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2.5">
              <Check
                size={16}
                className="mt-0.5 shrink-0 text-accent-green"
              />
              <div>
                <p className="text-body-sm text-foreground">
                  Your playlist has been saved.
                </p>
                <p className="mt-1 text-body-sm text-muted-foreground">
                  {DOWNLOAD_CONSTANTS.UNZIP_HINT}
                </p>
              </div>
            </div>
            <p className="text-caption text-muted-foreground">
              {DOWNLOAD_CONSTANTS.FORMAT_HINT}
            </p>
            <Button className="w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        )}

        {/* ── Error — the server's own words ────────────────────────────── */}
        {phase === "error" && (
          <div className="space-y-4">
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
              {errorMessage}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              {manifest && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => start(manifest)}
                >
                  Try again
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadPlaylistDialog;
