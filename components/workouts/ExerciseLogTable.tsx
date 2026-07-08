// Simple table-like exercise logger. One row per exercise, fill → save.

"use client";

import { useState } from "react";
import { Save, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useHandleCreateWorkoutSession } from "@/hooks/react-query/workouts/post-workout-session.hook";
import type { IWorkoutPlanExercise } from "@/types/fitness/workouts.types";

interface ExerciseLogTableProps {
  plan: IWorkoutPlanExercise[];
  dayName: string;
}

interface LogState {
  [exerciseId: string]: {
    sets?: number;
    reps?: number;
    weight?: number;
    notes?: string;
    skipped: boolean;
    isSaving?: boolean;
  };
}

export function ExerciseLogTable({ plan, dayName }: ExerciseLogTableProps) {
  const [logState, setLogState] = useState<LogState>(
    Object.fromEntries(plan.map((ex) => [ex.id, { skipped: false }]))
  );

  const { handleCreate, isPending } = useHandleCreateWorkoutSession();

  const updateExercise = (
    id: string,
    field: keyof LogState[string],
    value: number | string | boolean | undefined
  ) => {
    setLogState((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveExercise = async (exercise: IWorkoutPlanExercise) => {
    const state = logState[exercise.id];
    setLogState((prev) => ({
      ...prev,
      [exercise.id]: { ...prev[exercise.id], isSaving: true },
    }));

    await handleCreate({
      exercises: [
        {
          exerciseName: exercise.exerciseName,
          plannedSets: exercise.targetSets ?? undefined,
          plannedReps: exercise.targetReps ?? undefined,
          plannedWeight: exercise.targetWeight ?? undefined,
          completedSets: state.skipped ? undefined : state.sets,
          actualReps: state.skipped ? undefined : state.reps,
          actualWeight: state.skipped ? undefined : state.weight,
          skipped: state.skipped,
        },
      ],
      entryMethod: "form",
    });

    setLogState((prev) => ({
      ...prev,
      [exercise.id]: { skipped: false, isSaving: false },
    }));
  };

  return (
    <div className="space-y-2">
      <div className="rounded-lg border border-hairline bg-canvas-soft p-3">
        <div className="text-eyebrow uppercase tracking-wide text-ink-faint">
          {dayName}
        </div>
        <div className="mt-2 text-body-md font-semibold text-foreground">
          {plan.length} exercise{plan.length !== 1 ? "s" : ""} planned
        </div>
      </div>

      <div className="space-y-3">
        {plan.map((exercise) => {
          const state = logState[exercise.id];
          const isSaving = state.isSaving;

          return (
            <Card key={exercise.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Exercise name header */}
                <div className="border-b border-hairline bg-canvas-soft px-4 py-2.5">
                  <h3 className="text-body-sm font-semibold text-foreground">
                    {exercise.exerciseName}
                  </h3>
                </div>

                {/* Inputs */}
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Planned targets reference */}
                    {(exercise.targetSets ||
                      exercise.targetReps ||
                      exercise.targetWeight) && (
                      <div className="rounded-md border border-hairline bg-canvas-soft px-3 py-2 text-caption text-ink-muted">
                        <span className="font-medium">Target:</span>{" "}
                        {exercise.targetSets && `${exercise.targetSets}×`}
                        {exercise.targetReps && `${exercise.targetReps}r`}
                        {exercise.targetWeight && ` @ ${exercise.targetWeight}kg`}
                      </div>
                    )}

                    {/* Main log inputs */}
                    {!state.skipped && (
                      <div className="grid grid-cols-3 gap-3">
                        <label className="space-y-1">
                          <span className="text-eyebrow text-ink-faint">
                            Sets
                          </span>
                          <Input
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g. 4"
                            value={state.sets ?? ""}
                            onChange={(e) =>
                              updateExercise(
                                exercise.id,
                                "sets",
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                            className="tabular-nums"
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-eyebrow text-ink-faint">
                            Reps
                          </span>
                          <Input
                            type="number"
                            inputMode="numeric"
                            placeholder="e.g. 8"
                            value={state.reps ?? ""}
                            onChange={(e) =>
                              updateExercise(
                                exercise.id,
                                "reps",
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                            className="tabular-nums"
                          />
                        </label>
                        <label className="space-y-1">
                          <span className="text-eyebrow text-ink-faint">
                            Weight (kg)
                          </span>
                          <Input
                            type="number"
                            inputMode="decimal"
                            placeholder="e.g. 80"
                            value={state.weight ?? ""}
                            onChange={(e) =>
                              updateExercise(
                                exercise.id,
                                "weight",
                                e.target.value ? parseFloat(e.target.value) : undefined
                              )
                            }
                            className="tabular-nums"
                          />
                        </label>
                      </div>
                    )}

                    {/* Skipped state */}
                    {state.skipped && (
                      <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-caption font-medium text-destructive">
                        Marked as skipped
                      </div>
                    )}

                    {/* Notes */}
                    <label className="space-y-1">
                      <span className="text-eyebrow text-ink-faint">
                        Notes (optional)
                      </span>
                      <Input
                        placeholder="How it felt, anything else?"
                        value={state.notes ?? ""}
                        onChange={(e) =>
                          updateExercise(exercise.id, "notes", e.target.value || undefined)
                        }
                      />
                    </label>

                    {/* Actions row */}
                    <div className="flex items-center gap-2 border-t border-hairline pt-3">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={state.skipped}
                          onCheckedChange={(checked) =>
                            updateExercise(exercise.id, "skipped", checked === true)
                          }
                        />
                        <span className="text-caption text-ink-muted">Skip this exercise</span>
                      </label>
                      <div className="flex-1" />
                      <Button
                        size="sm"
                        onClick={() => handleSaveExercise(exercise)}
                        disabled={isSaving || isPending}
                        className="gap-1.5"
                      >
                        <Save size={14} />
                        {isSaving ? "Saving…" : "Save & next"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
