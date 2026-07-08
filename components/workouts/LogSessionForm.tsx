// Workout session log form (react-hook-form + zod). The <60-second hot path is
// the "Log all as planned" button that copies planned values into actuals and
// submits in one tap. Manual actuals + feeling/notes are the fuller path.

"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ExerciseLogRow } from "./ExerciseLogRow";
import { FEELING_OPTIONS } from "@/utils/health-format.utils";
import {
  LogSessionSchema,
  type TLogSession,
} from "@/lib/validations/log-session.validation";
import type {
  IWorkoutPlanExercise,
  ICreateSession,
} from "@/types/fitness/workouts.types";

interface LogSessionFormProps {
  plan: IWorkoutPlanExercise[];
  onSubmit: (session: ICreateSession) => void;
  isLoading?: boolean;
}

export function LogSessionForm({
  plan,
  onSubmit,
  isLoading = false,
}: LogSessionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TLogSession>({
    resolver: zodResolver(LogSessionSchema),
    defaultValues: {
      exercises: plan.map((ex) => ({
        exerciseName: ex.exerciseName,
        plannedSets: ex.targetSets ?? undefined,
        plannedReps: ex.targetReps ?? undefined,
        plannedWeight: ex.targetWeight ?? undefined,
        skipped: false,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const exercises = watch("exercises");
  const feeling = watch("feeling");

  // Build ICreateSession, dropping empty optional numbers (never send NaN/0).
  const buildSession = (data: TLogSession): ICreateSession => ({
    title: data.title || undefined,
    feeling: data.feeling ?? undefined,
    durationMinutes: data.durationMinutes ?? undefined,
    notes: data.notes || undefined,
    entryMethod: "form",
    exercises: data.exercises.map((ex) => ({
      exerciseName: ex.exerciseName,
      plannedSets: ex.plannedSets ?? undefined,
      plannedReps: ex.plannedReps ?? undefined,
      plannedWeight: ex.plannedWeight ?? undefined,
      completedSets: ex.completedSets ?? undefined,
      actualReps: ex.actualReps ?? undefined,
      actualWeight: ex.actualWeight ?? undefined,
      skipped: ex.skipped,
    })),
  });

  const handleFormSubmit = (data: TLogSession) => onSubmit(buildSession(data));

  // Hot path: copy planned → actual for every non-skipped row, then submit.
  const handleLogAllAsPlanned = () => {
    const current = watch();
    const session: ICreateSession = {
      entryMethod: "form",
      feeling: current.feeling ?? undefined,
      exercises: current.exercises.map((ex) => ({
        exerciseName: ex.exerciseName,
        plannedSets: ex.plannedSets ?? undefined,
        plannedReps: ex.plannedReps ?? undefined,
        plannedWeight: ex.plannedWeight ?? undefined,
        completedSets: ex.skipped ? undefined : ex.plannedSets ?? undefined,
        actualReps: ex.skipped ? undefined : ex.plannedReps ?? undefined,
        actualWeight: ex.skipped ? undefined : ex.plannedWeight ?? undefined,
        skipped: ex.skipped,
      })),
    };
    onSubmit(session);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Hot path */}
      <Button
        type="button"
        onClick={handleLogAllAsPlanned}
        disabled={isLoading}
        className="h-11 w-full text-button"
      >
        <Zap size={16} />
        Log all as planned
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-hairline" />
        <span className="text-eyebrow text-ink-faint">or adjust below</span>
        <div className="h-px flex-1 bg-hairline" />
      </div>

      {/* Exercises */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <ExerciseLogRow
            key={field.id}
            index={index}
            exerciseName={exercises[index]?.exerciseName}
            plannedSets={exercises[index]?.plannedSets ?? plan[index]?.targetSets}
            plannedReps={exercises[index]?.plannedReps ?? plan[index]?.targetReps}
            plannedWeight={
              exercises[index]?.plannedWeight ?? plan[index]?.targetWeight
            }
            isPreFilled={index < plan.length}
            skipped={exercises[index]?.skipped}
            onToggleSkip={() =>
              setValue(
                `exercises.${index}.skipped`,
                !exercises[index]?.skipped,
                { shouldDirty: true },
              )
            }
            onRemove={() => remove(index)}
            register={register}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ exerciseName: "", skipped: false })}
      >
        <Plus size={14} />
        Add exercise
      </Button>

      {errors.exercises && (
        <p className="text-caption text-destructive">
          {errors.exercises.message}
        </p>
      )}

      {/* Feeling */}
      <div className="space-y-2">
        <span className="text-eyebrow text-ink-faint">How did it feel?</span>
        <div className="flex gap-2">
          {FEELING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setValue("feeling", feeling === opt.value ? undefined : opt.value, {
                  shouldDirty: true,
                })
              }
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md border py-2 transition-colors",
                feeling === opt.value
                  ? "border-primary bg-muted"
                  : "border-hairline hover:bg-muted",
              )}
              title={opt.label}
            >
              <span className="text-lg leading-none">{opt.emoji}</span>
              <span className="text-eyebrow text-ink-muted">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Optional meta */}
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-eyebrow text-ink-faint">Title</span>
          <Input {...register("title")} placeholder="Push day" />
        </label>
        <label className="space-y-1">
          <span className="text-eyebrow text-ink-faint">Duration (min)</span>
          <Input
            {...register("durationMinutes")}
            type="number"
            inputMode="numeric"
            placeholder="45"
            className="tabular-nums"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-eyebrow text-ink-faint">Notes</span>
        <Textarea {...register("notes")} placeholder="How it went…" rows={2} />
      </label>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Logging…" : "Log workout"}
      </Button>
    </form>
  );
}
