"use client";

import { CheckCircle2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import SetCell from "@/components/workout/SetCell";
import { cn } from "@/lib/utils";
import type {
  ISetData,
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

const maxSets = (rows: IWorkoutTableRow[]) =>
  rows.reduce((m, r) => Math.max(m, r.sets.length), 0);

const FEELINGS: TFeeling[] = ["light", "average", "medium", "hard"];

// ─────── Mobile set row ───────────────────────────────────────────────────────

const MobileSetRow = ({
  set,
  mode,
  exerciseName,
  onSetChange,
}: {
  set: ISetData;
  mode: "plan" | "session";
  exerciseName: string;
  onSetChange?: Props["onSetChange"];
}) => {
  if (mode === "plan") {
    return (
      <div className="flex items-center gap-3 px-3 py-2 text-xs">
        <span className="w-6 shrink-0 font-medium text-muted-foreground">
          S{set.setNumber}
        </span>
        <span className="tabular-nums font-medium text-foreground">
          {set.weightKg ?? "—"}kg
        </span>
        <span className="tabular-nums text-muted-foreground">
          {set.reps ?? "—"} reps
        </span>
        <span className="text-muted-foreground">{set.feeling ?? "—"}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 border-l-2 px-3 py-2",
        set.isCompleted
          ? "border-l-green-500 bg-green-500/5"
          : "border-l-transparent",
      )}
    >
      <span className="w-6 shrink-0 text-[10px] font-medium text-muted-foreground">
        S{set.setNumber}
      </span>
      <Input
        type="number"
        min={0}
        step={0.5}
        placeholder="—"
        value={set.weightKg ?? ""}
        onChange={(e) =>
          onSetChange?.(
            exerciseName,
            set.setNumber,
            "weightKg",
            e.target.value === "" ? null : Number(e.target.value),
          )
        }
        className="h-7 w-14 px-1.5 text-xs tabular-nums"
      />
      <span className="text-[10px] text-muted-foreground">kg</span>
      <Input
        type="number"
        min={0}
        placeholder="—"
        value={set.reps ?? ""}
        onChange={(e) =>
          onSetChange?.(
            exerciseName,
            set.setNumber,
            "reps",
            e.target.value === "" ? null : Number(e.target.value),
          )
        }
        className="h-7 w-12 px-1.5 text-xs tabular-nums"
      />
      <span className="text-[10px] text-muted-foreground">reps</span>
      <Select
        value={set.feeling ?? ""}
        onValueChange={(v) =>
          onSetChange?.(exerciseName, set.setNumber, "feeling", v as TFeeling)
        }
      >
        <SelectTrigger className="h-7 min-w-[68px] flex-1 px-1.5 text-xs">
          <SelectValue placeholder="feel" />
        </SelectTrigger>
        <SelectContent>
          {FEELINGS.map((f) => (
            <SelectItem key={f} value={f} className="text-xs">
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {set.isCompleted && (
        <CheckCircle2 size={14} className="shrink-0 text-green-500" />
      )}
    </div>
  );
};

// ─────── Mobile card layout ───────────────────────────────────────────────────

const MobileLayout = ({
  grouped,
  mode,
  onSetChange,
  onAddSet,
}: {
  grouped: GroupedDay[];
  mode: "plan" | "session";
  onSetChange?: Props["onSetChange"];
  onAddSet?: Props["onAddSet"];
}) => (
  <div className="space-y-4 md:hidden">
    {grouped.map(({ day, exercises }) => (
      <div key={day} className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {day}
        </p>
        {exercises.map(({ bodyPart, exerciseName, row }) => (
          <div
            key={exerciseName}
            className="overflow-hidden rounded-lg border border-hairline"
          >
            {/* Exercise header */}
            <div className="border-b border-hairline bg-muted/30 px-3 py-2">
              <p className="text-xs font-medium text-foreground">
                {exerciseName}
              </p>
              <p className="text-[10px] text-muted-foreground">{bodyPart}</p>
            </div>

            {/* Sets */}
            <div className="divide-y divide-hairline">
              {row.sets.map((set) => (
                <MobileSetRow
                  key={set.setNumber}
                  set={set}
                  mode={mode}
                  exerciseName={exerciseName}
                  onSetChange={onSetChange}
                />
              ))}
            </div>

            {/* Add Set */}
            {mode === "session" && (
              <div className="border-t border-hairline px-3 py-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => onAddSet?.(exerciseName, bodyPart)}
                >
                  <Plus size={12} className="mr-1" />
                  Add Set
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ─────── Desktop table layout ─────────────────────────────────────────────────

const DesktopLayout = ({
  grouped,
  rows,
  mode,
  onSetChange,
  onAddSet,
}: {
  grouped: GroupedDay[];
  rows: IWorkoutTableRow[];
  mode: "plan" | "session";
  onSetChange?: Props["onSetChange"];
  onAddSet?: Props["onAddSet"];
}) => {
  const colCount = maxSets(rows);
  return (
    <div className="hidden overflow-x-auto rounded-lg border border-hairline md:block">
      <table className="w-full min-w-max border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline bg-muted/40">
            <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              Day
            </th>
            <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              Body Part
            </th>
            <th className="whitespace-nowrap px-3 py-2 text-left text-xs font-medium text-muted-foreground">
              Exercise
            </th>
            {Array.from({ length: colCount }).map((_, i) => (
              <th
                key={i}
                className="whitespace-nowrap px-2 py-2 text-center text-xs font-medium text-muted-foreground"
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
              const dayRowCount = exercises.length;

              return (
                <tr
                  key={`${day}-${exerciseName}`}
                  className={cn(
                    "border-b border-hairline last:border-0",
                    exIdx === 0 && "border-t-2 border-t-border",
                  )}
                >
                  <td
                    className={cn(
                      "whitespace-nowrap px-3 py-2 align-top text-xs font-medium text-foreground",
                      !isFirstDay && "select-none text-transparent",
                    )}
                  >
                    {isFirstDay ? day : ""}
                    {isFirstDay && (
                      <span className="block text-[9px] font-normal text-muted-foreground">
                        {dayRowCount} exercise{dayRowCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-3 py-2 align-top text-xs text-muted-foreground">
                    {bodyPart}
                  </td>

                  <td className="max-w-[160px] truncate whitespace-nowrap px-3 py-2 align-top text-xs font-medium text-foreground">
                    {exerciseName}
                  </td>

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

  return (
    <>
      <MobileLayout
        grouped={grouped}
        mode={mode}
        onSetChange={onSetChange}
        onAddSet={onAddSet}
      />
      <DesktopLayout
        grouped={grouped}
        rows={rows}
        mode={mode}
        onSetChange={onSetChange}
        onAddSet={onAddSet}
      />
    </>
  );
};

export default WorkoutTable;
