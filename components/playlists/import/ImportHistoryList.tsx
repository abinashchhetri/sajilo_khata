// ─────────────────────────────────────────────────────────────────────────────
// ImportHistoryList
// ─────────────────────────────────────────────────────────────────────────────
// Past imports, newest first. Read-only — retry and cancel live on the
// progress card, where the live counts are.
//
// Rendered only when there is history to show, so an untouched account never
// sees an empty shell.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import ImportStatusPill from "@/components/playlists/import/ImportStatusPill";
import { useGetImportHistory } from "@/hooks/react-query/playlist-import/use-import-history.hook";
import { IMPORT_CONSTANTS } from "@/lib/constants/import.constants";
import { ROUTES } from "@/lib/constants/routes.constants";
import { getRelativeTime } from "@/utils/date.utils";
import { cn } from "@/lib/utils";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  darkSurface?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ImportHistoryList = ({ darkSurface = false }: Props) => {
  const { imports, isLoading, isError } = useGetImportHistory({
    page: 1,
    limit: IMPORT_CONSTANTS.HISTORY_PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <div className="space-y-1.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn("h-14 rounded-lg", darkSurface && "bg-zinc-800")}
          />
        ))}
      </div>
    );
  }

  // Nothing to show and nothing to explain — stay silent rather than render
  // an error or an empty shell on a page the user didn't ask this of.
  if (isError || imports.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {imports.map((item) => (
        <Link
          key={item.importId}
          href={ROUTES.PLAYLIST_DETAIL(item.playlistId)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
            darkSurface ? "hover:bg-zinc-900" : "hover:bg-muted",
          )}
        >
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "truncate text-body-sm",
                darkSurface ? "text-zinc-100" : "text-foreground",
              )}
            >
              {item.sourcePlaylistName}
            </p>
            <p className="truncate text-caption text-muted-foreground">
              {item.completedTracks} added
              {item.skippedTracks > 0 && ` · ${item.skippedTracks} already in`}
              {item.failedTracks > 0 && ` · ${item.failedTracks} failed`}
              {" · "}
              {getRelativeTime(item.createdAt)}
            </p>
          </div>
          <ImportStatusPill status={item.status} />
        </Link>
      ))}
    </div>
  );
};

export default ImportHistoryList;
