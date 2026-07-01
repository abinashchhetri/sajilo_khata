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
}

// ─────── Component ───────────────────────────────────────────────────────────

const EmptyState = ({
  icon,
  message,
  description,
  ctaLabel,
  onCta,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium">{message}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
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
