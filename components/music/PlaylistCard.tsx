// ─────────────────────────────────────────────────────────────────────────────
// PlaylistCard
// ─────────────────────────────────────────────────────────────────────────────
// Grid card for a single playlist. Cover fills the full card width (aspect-square)
// at the top — Spotify-style album art presence — then info below. Gradient is
// derived deterministically from the playlist id.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ROUTES } from "@/lib/constants/routes.constants";
import { truncate } from "@/utils/format.utils";
import type { IPlaylist } from "@/types/playlists/playlists.types";

// ─────── Gradient helpers ─────────────────────────────────────────────────────

const GRADIENTS: [string, string][] = [
  ["#7c3aed", "#4f46e5"],
  ["#0ea5e9", "#06b6d4"],
  ["#10b981", "#0d9488"],
  ["#f97316", "#eab308"],
  ["#ec4899", "#f43f5e"],
];

function getGradient(id: string): [string, string] {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  playlist: IPlaylist;
  onEdit: () => void;
  onDelete: () => void;
  darkSurface?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const PlaylistCard = ({ playlist, onEdit, onDelete, darkSurface = false }: Props) => {
  const router = useRouter();
  const [from, to] = getGradient(playlist.id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(ROUTES.PLAYLIST_DETAIL(playlist.id))}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(ROUTES.PLAYLIST_DETAIL(playlist.id));
        }
      }}
      className={[
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl shadow-level-1 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-level-2",
        darkSurface ? "border border-zinc-800 bg-zinc-900" : "border bg-card",
      ].join(" ")}
    >
      {/* Full-width cover — fixed height so cards stay compact */}
      <div className="relative h-28 w-full overflow-hidden">
        {playlist.coverUrl ? (
          <Image
            src={playlist.coverUrl}
            alt={playlist.name}
            fill
            className="object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background: `linear-gradient(135deg, ${from}, ${to})`,
            }}
          />
        )}
        {/* Gradient scrim for legibility if there's a cover image */}
        {playlist.coverUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 p-2.5">
        <p className={["truncate text-sm font-semibold", darkSurface ? "text-zinc-100" : "text-foreground"].join(" ")}>
          {truncate(playlist.name, 28)}
        </p>
        <p className={["text-xs", darkSurface ? "text-zinc-400" : "text-muted-foreground"].join(" ")}>
          {playlist.trackCount} {playlist.trackCount === 1 ? "track" : "tracks"}
        </p>
        {playlist.description && (
          <p className={["mt-0.5 truncate text-xs", darkSurface ? "text-zinc-500" : "text-muted-foreground"].join(" ")}>
            {playlist.description}
          </p>
        )}
      </div>

      {/* Three-dot menu — stopPropagation so card click doesn't also navigate */}
      <div
        className="absolute right-2 top-2"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 focus:opacity-100"
              aria-label="Playlist options"
            >
              <MoreHorizontal size={15} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil size={13} />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 size={13} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default PlaylistCard;
