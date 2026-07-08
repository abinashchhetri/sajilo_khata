// Workout session log form with react-hook-form

"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExerciseLogRow } from "./ExerciseLogRow";
import { LogSessionSchema, type TLogSession } from "@/lib/validations/log-session.validation";
import type { IWorkoutPlanExercise, ICreateSession } from "@/types/fitness/workouts.types";

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
    formState: { errors, isSubmitting },
  } = useForm<TLogSession>({
    resolver: zodResolver(LogSessionSchema),
    defaultValues: {
      exercises: plan.map((ex) => ({
        exerciseName: ex.exerciseName,
        plannedSets: ex.targetSets ?? undefined,
        plannedReps: ex.targetReps ?? undefined,
        plannedWeight: ex.targetWeight ?? undefined,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const exercises = watch("exercises");

  const handleLogAllAsPlanned = async () => {
    // Copy planned values into actual fields
    const filledExercises = exercises.map((ex, idx) => ({
      ...ex,
      completedSets: ex.plannedSets ?? ex.completedSets,
      actualReps: ex.plannedReps ?? ex.actualReps,
      actualWeight: ex.plannedWeight ?? ex.actualWeight,
    }));

    // Build the session body, dropping empty optional numeric fields
    const session: ICreateSession = {
      exercises: filledExercises.map((ex) => ({
        exerciseName: ex.exerciseName,
        plannedSets: ex.plannedSets ?? undefined,
        plannedReps: ex.plannedReps ?? undefined,
        plannedWeight: ex.plannedWeight ?? undefined,
        completedSets: ex.completedSets ?? undefined,
        actualReps: ex.actualReps ?? undefined,
        actualWeight: ex.actualWeight ?? undefined,
        skipped: ex.skipped,
      })),
      entryMethod: "form",
    };

    onSubmit(session);
  };

  const handleFormSubmit = (data: TLogSession) => {
    const session: ICreateSession = {
      title: data.title ?? undefined,
      feeling: data.feeling ?? undefined,
      durationMinutes: data.durationMinutes ?? undefined,
      notes: data.notes ?? undefined,
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
      entryMethod: "form",
    };

    onSubmit(session);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input {...register("title")} placeholder="Chest day" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="feeling">How did you feel?</Label>
          <select
            {...register("feeling")}
            className="w-full border rounded-md p-2 text-sm"
          >
            <option value="">–</option>
            <option value="1">😫 Bad</option>
            <option value="2">😐 Okay</option>
            <option value="3">😊 Good</option>
            <option value="4">😄 Great</option>
            <option value="5">🔥 Amazing</option>
          </select>
        </div>
        <div>
          <Label htmlFor="durationMinutes">Duration (min)</Label>
          <Input
            {...register("durationMinutes")}
            type="number"
            placeholder="45"
            className="text-sm"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea {...register("notes")} placeholder="How it went..." rows={2} />
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-2">Exercises</h3>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <ExerciseLogRow
              key={field.id}
              index={index}
              field={field}
              plannedSets={
                exercises[index]?.plannedSets ??
                plan[index]?.targetSets
              }
              plannedReps={
                exercises[index]?.plannedReps ??
                plan[index]?.targetReps
              }
              plannedWeight={
                exercises[index]?.plannedWeight ??
                plan[index]?.targetWeight
              }
              isPreFilled={index < plan.length}
              register={register}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ exerciseName: "" })}
          className="mt-2"
        >
          + Add Exercise
        </Button>
      </div>

      {errors.exercises && (
        <p className="text-sm text-red-600">{errors.exercises.message}</p>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={handleLogAllAsPlanned}
          disabled={isSubmitting || isLoading}
        >
          Log All as Planned
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Logging..." : "Log Workout"}
        </Button>
      </div>
    </form>
  );
}
