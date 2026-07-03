// ─────────────────────────────────────────────────────────────────────────────
// MusicSearchBar
// ─────────────────────────────────────────────────────────────────────────────
// Pill-shaped dark search input (Spotify feel) with a live YouTube discovery
// dropdown. Debounced 400 ms so yt-dlp isn't hit on every keystroke.
//
// isOpen is tracked independently from query.length so click-outside closes
// the dropdown even while the user still has text typed.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { useDiscoverMusic } from "@/hooks/react-query/music/get-find-music.hook";
import { useDebounce } from "@/hooks/use-debounce.hook";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import DiscoveryTrackRow from "@/components/music/DiscoveryTrackRow";
import type { IDiscoveryTrack } from "@/types/music/music.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  onTrackSelect?: (track: IDiscoveryTrack) => void;
  placeholder?: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const MusicSearchBar = ({
  onTrackSelect,
  placeholder = "Search for any song or artist…",
}: Props) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 400);
  const { results, isLoading } = useDiscoverMusic(debouncedQuery);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = isOpen && query.length >= 2;

  // Clicking anywhere on a result row (including play button, which does NOT
  // stopPropagation) closes the dropdown. "+" button stops propagation so
  // adding to a playlist keeps it open for further adds.
  const handleRowClick = () => setIsOpen(false);

  const handleAddToPlaylist = onTrackSelect
    ? (track: IDiscoveryTrack) => onTrackSelect(track)
    : undefined;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Input — pill shape, dark surface ─────────────────────────────── */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setQuery("");
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-full border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-0 transition-colors"
        />
      </div>

      {/* ── Dropdown — dark surface, heavy shadow ─────────────────────────── */}
      {showDropdown && (
        <div
          className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.5)", maxHeight: "22rem", overflowY: "auto" }}
        >
          {isLoading ? (
            <div className="flex flex-col gap-2 p-3">
              <p className="px-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Searching YouTube…
              </p>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-1">
                  <Skeleton className="h-10 w-10 shrink-0 rounded bg-zinc-800" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-3/4 rounded bg-zinc-800" />
                    <Skeleton className="h-3 w-1/2 rounded bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              message="No results found. Try a different search."
              className="border-none bg-transparent py-10 text-zinc-400"
            />
          ) : (
            <div className="p-2">
              <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                YouTube results
              </p>
              {results.map((track, i) => (
                <div key={track.externalId ?? i} onClick={handleRowClick}>
                  <DiscoveryTrackRow
                    track={track}
                    onAddToPlaylist={handleAddToPlaylist}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MusicSearchBar;
