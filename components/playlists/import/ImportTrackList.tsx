// ─────────────────────────────────────────────────────────────────────────────
// ImportTrackList
// ─────────────────────────────────────────────────────────────────────────────
// The full per-track list for an import, inside a collapsible so it stays out
// of the way until asked for. Paginated — the progress endpoint deliberately
// omits this list to stay cheap to poll, so it is fetched separately and only
// while the collapsible is open.
//
// No match-confidence review UI: matchConfidence is always 100 for YouTube
// imports (the video was named directly, nothing was guessed), so a review
// affordance would be dead code.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ImportStatusPill from "@/components/playlists/import/ImportStatusPill";
import { useGetImportItems } from "@/hooks/react-query/playlist-import/use-import-items.hook";
import { IMPORT_CONSTANTS } from "@/lib/constants/import.constants";
import type { TImportItemStatus } from "@/types/playlists/import.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  importId: string;
  /** Pre-filter the list, e.g. "FAILED" from a "3 failed" affordance. */
  initialStatusFilter?: TImportItemStatus;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ImportTrackList = ({ importId, initialStatusFilter }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { items, total, totalPages, hasNextPage, hasPrevPage, isLoading } =
    useGetImportItems(
      importId,
      {
        page,
        limit: IMPORT_CONSTANTS.ITEMS_PAGE_SIZE,
        status: initialStatusFilter,
      },
      isOpen, // only fetch once the user opens the list
    );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {/* This Collapsible renders its own <button>, so no asChild wrapper */}
      <CollapsibleTrigger className="flex w-full items-center gap-1.5 py-2 text-body-sm text-muted-foreground transition-colors hover:text-foreground">
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {initialStatusFilter === "FAILED"
          ? "View failed tracks"
          : "View all tracks"}
        {total > 0 && <span className="text-ink-faint">({total})</span>}
      </CollapsibleTrigger>

      <CollapsibleContent>
        {isLoading ? (
          <div className="space-y-1.5 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-md" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="py-3 text-body-sm text-muted-foreground">
            No tracks to show.
          </p>
        ) : (
          <>
            <div className="max-h-72 space-y-0.5 overflow-y-auto pt-1">
              {items.map((item) => (
                <div
                  key={`${item.position}-${item.sourceTitle}`}
                  className="flex items-start justify-between gap-3 rounded-md px-2 py-2 hover:bg-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm text-foreground">
                      <span className="text-ink-faint">
                        {item.position + 1}.
                      </span>{" "}
                      {item.sourceTitle}
                    </p>
                    {item.sourceArtist && (
                      <p className="truncate text-caption text-muted-foreground">
                        {item.sourceArtist}
                      </p>
                    )}
                    {/* Server error messages are written for users — show verbatim */}
                    {item.errorMessage && (
                      <p className="mt-0.5 text-caption text-destructive">
                        {item.errorMessage}
                      </p>
                    )}
                  </div>
                  <ImportStatusPill status={item.status} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-2 pt-3">
                <span className="text-caption text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasPrevPage}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ImportTrackList;
