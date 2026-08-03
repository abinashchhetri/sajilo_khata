// ─────────────────────────────────────────────────────────────────────────────
// DownloadPlaylistButton
// ─────────────────────────────────────────────────────────────────────────────
// The single mount point for playlist downloads — owns the trigger and the
// dialog together, so the playlist page only needs to render one thing.
//
// While a download is running the label switches to live progress, because the
// transfer outlives this component and the user needs a way back to it.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import DownloadPlaylistDialog from "@/components/playlists/download/DownloadPlaylistDialog";
import { useDownloadPlaylist } from "@/hooks/react-query/playlist-download/use-download-playlist.hook";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  playlistId: string;
  /** Disable when the playlist has no tracks at all. */
  disabled?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const DownloadPlaylistButton = ({ playlistId, disabled = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isRunning, percent, playlistId: activeId } = useDownloadPlaylist();

  // Only reflect progress for *this* playlist — another one may be downloading.
  const isDownloadingThis = isRunning && activeId === playlistId;

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
      >
        {isDownloadingThis ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Downloading {percent}%
          </>
        ) : (
          <>
            <Download size={14} />
            Download
          </>
        )}
      </Button>

      <DownloadPlaylistDialog
        playlistId={playlistId}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};

export default DownloadPlaylistButton;
