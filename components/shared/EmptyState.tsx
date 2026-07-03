// ─────────────────────────────────────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────────────────────────────────────
// Shown when a list view returns zero results. Accepts an icon, a message, and
// an optional CTA button so each feature can customise the call to action
// (e.g., "Add your first account") without duplicating the empty-state layout.
// ─────────────────────────────────────────────────────────────────────────────

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  icon?: React.ReactNode;
  message: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  className?: string;
  darkSurface?: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const EmptyState = ({
  icon,
  message,
  description,
  ctaLabel,
  onCta,
  className,
  darkSurface = false,
}: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center",
        darkSurface ? "border-zinc-800" : "",
        className,
      )}
    >
      {icon && (
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          darkSurface ? "bg-zinc-800 text-zinc-500" : "bg-muted text-muted-foreground",
        )}>
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className={cn("text-sm font-medium", darkSurface ? "text-zinc-400" : "")}>{message}</p>
        {description && (
          <p className={cn("text-xs", darkSurface ? "text-zinc-500" : "text-muted-foreground")}>{description}</p>
        )}
      </div>
      {ctaLabel && onCta && (
        <Button size="sm" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
