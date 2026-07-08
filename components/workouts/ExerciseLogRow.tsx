// Single editable exercise row in the workout log form.
// Shows the planned target as a faint chip; compact number inputs for actuals.

"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatTarget } from "@/utils/health-format.utils";
import type { UseFormRegister } from "react-hook-form";

interface ExerciseLogRowProps {
  index: number;
  exerciseName?: string;
  plannedSets?: number | null;
  plannedReps?: number | null;
  plannedWeight?: number | null;
  isPreFilled: boolean;
  skipped?: boolean;
  onToggleSkip: () => void;
  onRemove?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export function ExerciseLogRow({
  index,
  exerciseName,
  plannedSets,
  plannedReps,
  plannedWeight,
  isPreFilled,
  skipped,
  onToggleSkip,
  onRemove,
  register,
}: ExerciseLogRowProps) {
  const target = formatTarget(plannedSets, plannedReps, plannedWeight);

  return (
    <div
      className={cn(
        "rounded-md border border-hairline bg-card p-3 transition-opacity",
        skipped && "opacity-55",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          {isPreFilled ? (
            <div className="flex items-center gap-2">
              <input type="hidden" {...register(`exercises.${index}.exerciseName`)} />
              <span className="truncate text-body-sm font-medium text-foreground">
                {exerciseName}
              </span>
              {target !== "—" && (
                <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-eyebrow text-ink-muted tabular-nums">
                  {target}
                </span>
              )}
            </div>
          ) : (
            <Input
              {...register(`exercises.${index}.exerciseName`)}
              placeholder="Exercise name"
              className="h-8"
            />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggleSkip}
            className={cn(
              "rounded-md px-2 py-1 text-eyebrow font-medium transition-colors",
              skipped
                ? "bg-destructive/10 text-destructive"
                : "text-ink-faint hover:bg-muted hover:text-ink-secondary",
            )}
          >
            {skipped ? "Skipped" : "Skip"}
          </button>
          {onRemove && !isPreFilled && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md p-1 text-ink-faint transition-colors hover:bg-muted hover:text-destructive"
              aria-label="Remove exercise"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {!skipped && (
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <label className="space-y-1">
            <span className="text-eyebrow text-ink-faint">Sets</span>
            <Input
              {...register(`exercises.${index}.completedSets`)}
              type="number"
              inputMode="numeric"
              placeholder={plannedSets != null ? String(plannedSets) : "—"}
              className="h-8 text-center tabular-nums"
            />
          </label>
          <label className="space-y-1">
            <span className="text-eyebrow text-ink-faint">Reps</span>
            <Input
              {...register(`exercises.${index}.actualReps`)}
              type="number"
              inputMode="numeric"
              placeholder={plannedReps != null ? String(plannedReps) : "—"}
              className="h-8 text-center tabular-nums"
            />
          </label>
          <label className="space-y-1">
            <span className="text-eyebrow text-ink-faint">Weight</span>
            <Input
              {...register(`exercises.${index}.actualWeight`)}
              type="number"
              inputMode="decimal"
              placeholder={plannedWeight != null ? String(plannedWeight) : "—"}
              className="h-8 text-center tabular-nums"
            />
          </label>
        </div>
      )}
    </div>
  );
}
