// ─────────────────────────────────────────────────────────────────────────────
// ShuffleButton
// ─────────────────────────────────────────────────────────────────────────────
// Toggles shuffle on the live queue. Each press reshuffles — that is intended.
//
// Disabled unless something is playing from a playlist, because the endpoint
// 400s otherwise; gating the control is friendlier than letting every press
// produce an error toast.
//
// Optimistic on press, reconciled against the server's returned `shuffle`
// value — if the toggle is rejected the button snaps back rather than
// claiming a state the queue isn't in.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { Shuffle } from "lucide-react";
import toast from "react-hot-toast";

import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { useHandleToggleShuffle } from "@/hooks/react-query/playlist-share/use-shuffle.hook";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  size?: number;
  darkContext?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ShuffleButton = ({ size = 16, darkContext = false }: Props) => {
  const { currentPlaylistId, isShuffled, setIsShuffled } = useMusicPlayer();
  const { handleToggleShuffle, isPending } = useHandleToggleShuffle();

  const inPlaylist = !!currentPlaylistId;

  const onClick = async () => {
    if (!inPlaylist) {
      toast.error(TOAST_MESSAGES.SHUFFLE.NOT_IN_PLAYLIST);
      return;
    }

    const next = !isShuffled;
    setIsShuffled(next); // optimistic

    try {
      const response = await handleToggleShuffle(next);
      // Server wins.
      setIsShuffled(response.data.shuffle);
    } catch {
      setIsShuffled(!next); // roll back
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isPending || !inPlaylist}
      aria-pressed={isShuffled}
      aria-label={isShuffled ? "Turn shuffle off" : "Turn shuffle on"}
      title={
        inPlaylist
          ? isShuffled
            ? "Shuffle on — press to reshuffle"
            : "Shuffle"
          : TOAST_MESSAGES.SHUFFLE.NOT_IN_PLAYLIST
      }
      className={[
        "shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-40",
        isShuffled
          ? "text-primary"
          : darkContext
          ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      ].join(" ")}
    >
      <Shuffle size={size} />
    </button>
  );
};

export default ShuffleButton;
