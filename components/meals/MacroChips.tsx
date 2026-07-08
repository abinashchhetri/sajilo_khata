// Inline macro readout — only renders chips for non-null values (never shows 0
// for a missing macro, per the "macros are optional" rule).

import { cn } from "@/lib/utils";

interface Props {
  calories?: number | null;
  proteinG?: number | null;
  carbsG?: number | null;
  fatG?: number | null;
  className?: string;
}

export function MacroChips({
  calories,
  proteinG,
  carbsG,
  fatG,
  className,
}: Props) {
  const hasAny =
    calories != null || proteinG != null || carbsG != null || fatG != null;
  if (!hasAny) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted tabular-nums",
        className,
      )}
    >
      {calories != null && (
        <span className="font-medium text-ink-secondary">{calories} cal</span>
      )}
      {proteinG != null && <span>P {proteinG}g</span>}
      {carbsG != null && <span>C {carbsG}g</span>}
      {fatG != null && <span>F {fatG}g</span>}
    </div>
  );
}
