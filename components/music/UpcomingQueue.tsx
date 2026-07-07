// ─────────────────────────────────────────────────────────────────────────────
// UpcomingQueue
// ─────────────────────────────────────────────────────────────────────────────
// Displays the next 1-3 upcoming tracks from the server-side queue.
// Shown as a collapsible panel above the player bar — toggle with a
// "Up Next" button. Polling every 15s via useGetQueue so it updates
// as the backend fills tracks in the background.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Music, X } from "lucide-react";

import { useMusicPlayer } from "@/hooks/context/use-music-player.hook";
import { useGetQueue } from "@/hooks/react-query/music/get-queue.hook";
import { formatDuration, truncate } from "@/utils/format.utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// ─────── Component ───────────────────────────────────────────────────────────

const UpcomingQueue = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTrack } = useMusicPlayer();
  const { hasNext, queueLength, nextTrack, isLoading } = useGetQueue();

  if (!currentTrack) return null;

  return (
    <>
      {/* ── Collapsible panel ─────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 z-40 w-72 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-100">Up Next</span>
              {queueLength > 0 && (
                <span className="rounded-full bg-zinc-800 px-1.5 py-px text-[10px] tabular-nums text-zinc-400">
                  {queueLength}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 transition-colors hover:text-zinc-200"
              aria-label="Close queue"
            >
              <X size={14} />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-1 p-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md bg-zinc-800" />
                ))}
              </div>
            ) : queueLength === 0 ? (
              <div className="flex items-center gap-2 px-3 py-4 text-xs text-zinc-500">
                <Loader2 size={12} className="animate-spin shrink-0" />
                Preparing your queue...
              </div>
            ) : (
              <div className="p-2 space-y-0.5">
                {/* Show the next track from useGetQueue, then note queue length */}
                {nextTrack && (
                  <div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-zinc-800/60">
                    <span className="w-4 shrink-0 text-center text-[10px] tabular-nums text-zinc-600">
                      1
                    </span>
                    <div className="shrink-0">
                      {nextTrack.coverUrl ? (
                        <Image
                          src={nextTrack.coverUrl}
                          alt={nextTrack.title}
                          width={32}
                          height={32}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-800">
                          <Music size={13} className="text-zinc-500" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-zinc-100">
                        {truncate(nextTrack.title, 24)}
                      </p>
                      <p className="truncate text-[10px] text-zinc-500">
                        {truncate(nextTrack.artist, 22)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] tabular-nums text-zinc-600">
                      {formatDuration(nextTrack.duration)}
                    </span>
                  </div>
                )}
                {queueLength > 1 && (
                  <p className="px-2 py-1 text-[10px] text-zinc-600">
                    +{queueLength - 1} more in queue
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Toggle button (only when panel is closed) ─────────────────────── */}
      {!isOpen && (
        <div className="fixed bottom-40 right-4 z-40">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="h-7 gap-1.5 rounded-full border border-zinc-800 bg-zinc-950 px-2.5 text-[11px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Up Next
            {queueLength > 0 && (
              <span className="rounded-full bg-zinc-800 px-1.5 py-px text-[10px] tabular-nums">
                {queueLength}
              </span>
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default UpcomingQueue;
