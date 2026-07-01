// ─────────────────────────────────────────────────────────────────────────────
// Loader
// ─────────────────────────────────────────────────────────────────────────────
// Generic spinner with an optional text label. Used by auth guards, data
// fetching states, and any async action that needs visual feedback.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  label?: string;
  className?: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const Loader = ({ label, className }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
};

export default Loader;
