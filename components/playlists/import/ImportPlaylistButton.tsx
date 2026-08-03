// ─────────────────────────────────────────────────────────────────────────────
// ImportPlaylistButton
// ─────────────────────────────────────────────────────────────────────────────
// The single mount point for the whole import feature — the only thing the
// playlists page needs to render.
//
// It owns three things:
//   1. the "Import playlist" trigger
//   2. the dialog
//   3. the compact progress strip for a running import
//
// The server permits one import at a time (a second start is a 409), so the
// trigger is disabled while one is live. The strip stays clickable so the user
// can still open the dialog and watch progress or cancel.
//
// Whether an import is running is read from the server via import history —
// never from component state — so it survives reloads and navigation.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import ImportProgressCard from "@/components/playlists/import/ImportProgressCard";
import ImportPlaylistDialog from "@/components/playlists/import/ImportPlaylistDialog";
import { useGetImportHistory } from "@/hooks/react-query/playlist-import/use-import-history.hook";
import { IMPORT_CONSTANTS } from "@/lib/constants/import.constants";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  /** Match the dark music-page surface. */
  darkSurface?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ImportPlaylistButton = ({ darkSurface = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { activeImport, isLoading } = useGetImportHistory({
    page: 1,
    limit: IMPORT_CONSTANTS.HISTORY_PAGE_SIZE,
  });

  const hasActiveImport = !!activeImport;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={isLoading || hasActiveImport}
        title={
          hasActiveImport
            ? "An import is already running — wait for it to finish or cancel it"
            : undefined
        }
      >
        <Download size={14} />
        Import playlist
      </Button>

      {/* Compact strip — clicking it opens the dialog straight at progress */}
      {hasActiveImport && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-3 block w-full text-left"
        >
          <ImportProgressCard
            importId={activeImport.importId}
            compact
            darkSurface={darkSurface}
          />
        </button>
      )}

      <ImportPlaylistDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        activeImportId={activeImport?.importId ?? null}
      />
    </>
  );
};

export default ImportPlaylistButton;
