"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import SetCell from "@/components/workout/SetCell";
import { cn } from "@/lib/utils";
import type {
  IWorkoutTableRow,
  TDayOfWeek,
  TFeeling,
} from "@/types/workout/workout.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  rows: IWorkoutTableRow[];
  mode: "plan" | "session";
  onSetChange?: (
    exerciseName: string,
    setNumber: number,
    field: "weightKg" | "reps" | "feeling",
    value: number | string | null,
  ) => void;
  onAddSet?: (exerciseName: string, bodyPart: string) => void;
  isLoading: boolean;
}

// ─────── Helpers ─────────────────────────────────────────────────────────────

// Group rows by day → bodyPart → exerciseName
type GroupedExercise = {
  bodyPart: string;
  exerciseName: string;
  row: IWorkoutTableRow;
};
type GroupedDay = { day: TDayOfWeek; exercises: GroupedExercise[] };

const groupRows = (rows: IWorkoutTableRow[]): GroupedDay[] => {
  const dayMap = new Map<TDayOfWeek, GroupedExercise[]>();
  for (const row of rows) {
    if (!dayMap.has(row.day)) dayMap.set(row.day, []);
    dayMap.get(row.day)!.push({
      bodyPart: row.bodyPart,
      exerciseName: row.exerciseName,
      row,
    });
  }
  return Array.from(dayMap.entries()).map(([day, exercises]) => ({
    day,
    exercises,
  }));
};

// Max set count across all rows
const maxSets = (rows: IWorkoutTableRow[]) =>
  rows.reduce((m, r) => Math.max(m, r.sets.length), 0);

// ─────── Component ───────────────────────────────────────────────────────────

const WorkoutTable = ({
  rows,
  mode,
  onSetChange,
  onAddSet,
  isLoading,
}: Props) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        message="No exercises"
        description="No exercises are scheduled."
      />
    );
  }

  const grouped = groupRows(rows);
  const colCount = maxSets(rows);

  return (
    <div className="overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full min-w-max border-collapse text-sm">
        {/* Header */}
        <thead>
          <tr className="border-b border-hairline bg-muted/40">
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
              Day
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
              Body Part
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
              Exercise
            </th>
            {Array.from({ length: colCount }).map((_, i) => (
              <th
                key={i}
                className="px-2 py-2 text-center text-xs font-medium text-muted-foreground whitespace-nowrap"
              >
                Set {i + 1}
                <span className="block text-[9px] font-normal text-muted-foreground/60">
                  Wt · Reps · Feel
                </span>
              </th>
            ))}
            {mode === "session" && (
              <th className="px-2 py-2 text-xs font-medium text-muted-foreground" />
            )}
          </tr>
        </thead>

        <tbody>
          {grouped.map(({ day, exercises }) =>
            exercises.map(({ bodyPart, exerciseName, row }, exIdx) => {
              const isFirstDay = exIdx === 0;
              // Count how many exercises are in this day group
              const dayRowCount = exercises.length;

              return (
                <tr
                  key={`${day}-${exerciseName}`}
                  className={cn(
                    "border-b border-hairline last:border-0",
                    exIdx === 0 && "border-t-2 border-t-border",
                  )}
                >
                  {/* Day — shown only on first row of each day group */}
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2 align-top text-xs font-medium text-foreground",
                      !isFirstDay && "text-transparent select-none",
                    )}
                  >
                    {isFirstDay ? day : ""}
                    {isFirstDay && (
                      <span className="block text-[9px] font-normal text-muted-foreground">
                        {dayRowCount} exercise{dayRowCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </td>

                  {/* Body part */}
                  <td className="whitespace-nowrap px-3 py-2 align-top text-xs text-muted-foreground">
                    {bodyPart}
                  </td>

                  {/* Exercise name */}
                  <td className="whitespace-nowrap px-3 py-2 align-top text-xs font-medium text-foreground max-w-[160px] truncate">
                    {exerciseName}
                  </td>

                  {/* Set columns */}
                  {Array.from({ length: colCount }).map((_, setIdx) => {
                    const set = row.sets[setIdx];
                    return (
                      <td key={setIdx} className="px-1 py-1 align-top">
                        {set ? (
                          <SetCell
                            set={set}
                            mode={mode}
                            onChange={
                              mode === "session"
                                ? (field, value) =>
                                    onSetChange?.(
                                      exerciseName,
                                      set.setNumber,
                                      field,
                                      value,
                                    )
                                : undefined
                            }
                          />
                        ) : (
                          <div className="min-w-[88px]" />
                        )}
                      </td>
                    );
                  })}

                  {/* Add Set — session mode only */}
                  {mode === "session" && (
                    <td className="px-2 py-1 align-middle">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                        onClick={() => onAddSet?.(exerciseName, bodyPart)}
                      >
                        <Plus size={12} />
                      </Button>
                    </td>
                  )}
                </tr>
              );
            }),
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WorkoutTable;
