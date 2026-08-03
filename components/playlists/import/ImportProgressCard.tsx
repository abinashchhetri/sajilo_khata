// ─────────────────────────────────────────────────────────────────────────────
// ImportProgressCard
// ─────────────────────────────────────────────────────────────────────────────
// Live view of one import: progress bar, counters, what is downloading right
// now, cancel while running, and retry once finished with failures.
//
// Two rules this component exists to enforce:
//   1. `percentComplete` is read straight from the server. It counts RESOLVED
//      tracks (completed + failed + skipped), so it reaches 100 even when some
//      tracks fail. Recomputing it as completed/total would leave the bar
//      stuck below 100 forever on any import with a failure.
//   2. Progress is never faked or animated ahead of the server. If the server
//      says 4%, we show 4%.
//
// `compact` renders the page-level strip; the full card is used in the dialog.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ImportStatusPill from "@/components/playlists/import/ImportStatusPill";
import ImportTrackList from "@/components/playlists/import/ImportTrackList";
import { useGetImportProgress } from "@/hooks/react-query/playlist-import/use-import-progress.hook";
import { useHandleCancelImport } from "@/hooks/react-query/playlist-import/use-cancel-import.hook";
import { useHandleRetryImport } from "@/hooks/react-query/playlist-import/use-retry-import.hook";
import { cn } from "@/lib/utils";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  importId: string;
  /** Slim single-line variant for the playlists page. */
  compact?: boolean;
  /** Match the dark music-page surface. */
  darkSurface?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ImportProgressCard = ({
  importId,
  compact = false,
  darkSurface = false,
}: Props) => {
  const { progress, isLoading, isError, isTerminal } =
    useGetImportProgress(importId);
  const { handleCancelImport, isPending: cancelPending } =
    useHandleCancelImport();
  const { handleRetryImport, isPending: retryPending } =
    useHandleRetryImport();

  if (isLoading) {
    return <Skeleton className={cn("rounded-lg", compact ? "h-14" : "h-40")} />;
  }

  // A 404 here means the import id is stale (e.g. deleted). Say so plainly
  // rather than leaving a dead card on screen.
  if (isError || !progress) {
    return (
      <div
        className={cn(
          "rounded-lg border p-4",
          darkSurface ? "border-zinc-800" : "border-hairline",
        )}
      >
        <p className="text-body-sm text-muted-foreground">
          Couldn&apos;t load this import.
        </p>
      </div>
    );
  }

  const { progress: counts, status, currentlyProcessing } = progress;
  const isRunning = !isTerminal;

  // Straight from the server — see header note 1.
  const percent = counts.percentComplete;

  const hasFailures = counts.failed > 0;
  const allSkipped = counts.total > 0 && counts.skipped === counts.total;

  // ── Compact strip (playlists page) ────────────────────────────────────────
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border px-4 py-3",
          darkSurface ? "border-zinc-800 bg-zinc-900" : "border-hairline bg-canvas",
        )}
      >
        {isRunning && (
          <Loader2
            size={14}
            className="shrink-0 animate-spin text-accent-sky"
          />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-body-sm",
              darkSurface ? "text-zinc-100" : "text-foreground",
            )}
          >
            {progress.sourcePlaylistName}
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent-green transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <span className="shrink-0 text-caption text-muted-foreground">
          {counts.completed}/{counts.total}
        </span>
        <ImportStatusPill status={status} />
      </div>
    );
  }

  // ── Full card (dialog) ────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-title text-foreground">
            {progress.sourcePlaylistName}
          </p>
          <p className="text-body-sm text-muted-foreground">
            {isRunning
              ? "Downloading in the background — you can close this window."
              : "Import finished."}
          </p>
        </div>
        <ImportStatusPill status={status} />
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-accent-green transition-[width] duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-caption text-muted-foreground">
          <span>{percent}% complete</span>
          <span>
            {counts.completed + counts.failed + counts.skipped} of{" "}
            {counts.total} resolved
          </span>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Added", value: counts.completed },
          { label: "Already in", value: counts.skipped },
          { label: "Failed", value: counts.failed },
          { label: "Waiting", value: counts.pending },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-hairline px-3 py-2"
          >
            <p className="text-eyebrow text-ink-faint">{stat.label}</p>
            <p className="text-title text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Edge case: every track was already in the target playlist */}
      {isTerminal && allSkipped && (
        <p className="rounded-md bg-muted px-3 py-2 text-body-sm text-muted-foreground">
          Every track was already in this playlist — nothing new to add.
        </p>
      )}

      {/* Currently downloading — max 2, matching server concurrency */}
      {isRunning && currentlyProcessing.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-eyebrow text-ink-faint">Downloading now</p>
          {currentlyProcessing.map((track) => (
            <div
              key={track.title}
              className="flex items-center gap-2 rounded-md border border-hairline px-3 py-2"
            >
              <Loader2 size={13} className="shrink-0 animate-spin text-accent-sky" />
              <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">
                {track.title}
              </span>
              <ImportStatusPill status={track.status} />
            </div>
          ))}
        </div>
      )}

      {/* Import-level failure message, verbatim from the server */}
      {progress.errorMessage && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
          {progress.errorMessage}
        </p>
      )}

      {/* Recent failures — server caps this at 5; full list is in the collapsible */}
      {progress.recentFailures.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-eyebrow text-ink-faint">Recent failures</p>
          {progress.recentFailures.map((failure) => (
            <div
              key={`${failure.position}-${failure.title}`}
              className="rounded-md border border-hairline px-3 py-2"
            >
              <p className="truncate text-body-sm text-foreground">
                {failure.title}
              </p>
              <p className="text-caption text-destructive">
                {failure.errorMessage}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Full track list */}
      <ImportTrackList importId={importId} />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isRunning && (
          <Button
            variant="outline"
            size="sm"
            disabled={cancelPending}
            onClick={() => handleCancelImport(importId)}
          >
            <X size={13} />
            {cancelPending ? "Cancelling…" : "Cancel import"}
          </Button>
        )}

        {/* Retry is a 400 when nothing failed, so only offer it when it applies */}
        {isTerminal && hasFailures && (
          <Button
            size="sm"
            disabled={retryPending}
            onClick={() => handleRetryImport(importId)}
          >
            {retryPending
              ? "Retrying…"
              : `Retry ${counts.failed} failed track${counts.failed === 1 ? "" : "s"}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportProgressCard;
