// ─────────────────────────────────────────────────────────────────────────────
// ImportStatusPill
// ─────────────────────────────────────────────────────────────────────────────
// Small status label for an import or one of its tracks. There is no `badge`
// component in this repo, so this is a styled span.
//
// Colour comes from the sticker palette, never primary blue — per the design
// system, blue is reserved for CTAs and links, and status is carried by the
// decorative palette. SKIPPED is deliberately neutral, not an error colour:
// it means the track was already in the target playlist.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";
import type {
  TImportItemStatus,
  TImportStatus,
} from "@/types/playlists/import.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  status: TImportStatus | TImportItemStatus;
  className?: string;
}

// ─────── Config ──────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  // Import-level
  PENDING: { label: "Queued", className: "text-ink-faint bg-muted" },
  PROCESSING: {
    label: "Importing",
    className: "text-accent-sky bg-accent-sky/10",
  },
  COMPLETED: {
    label: "Done",
    className: "text-accent-green bg-accent-green/10",
  },
  FAILED: { label: "Failed", className: "text-destructive bg-destructive/10" },
  CANCELLED: { label: "Cancelled", className: "text-ink-faint bg-muted" },
  // Item-level extras
  SEARCHING: {
    label: "Searching",
    className: "text-accent-sky bg-accent-sky/10",
  },
  DOWNLOADING: {
    label: "Downloading",
    className: "text-accent-sky bg-accent-sky/10",
  },
  // Not an error — the track was already in the playlist.
  SKIPPED: { label: "Already added", className: "text-ink-muted bg-muted" },
};

// ─────── Component ───────────────────────────────────────────────────────────

const ImportStatusPill = ({ status, className }: Props) => {
  const config = STATUS_STYLES[status] ?? {
    label: status,
    className: "text-ink-faint bg-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-eyebrow",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};

export default ImportStatusPill;
