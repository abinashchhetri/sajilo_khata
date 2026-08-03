// ─────────────────────────────────────────────────────────────────────────────
// SharePlaylistButton
// ─────────────────────────────────────────────────────────────────────────────
// Single mount point for playlist sharing — owns the trigger and the dialog,
// so the playlist page renders one thing.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import SharePlaylistDialog from "@/components/playlists/share/SharePlaylistDialog";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  playlistId: string;
  playlistName: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const SharePlaylistButton = ({ playlistId, playlistName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
        <Share2 size={14} />
        Share
      </Button>

      <SharePlaylistDialog
        playlistId={playlistId}
        playlistName={playlistName}
        open={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};

export default SharePlaylistButton;
