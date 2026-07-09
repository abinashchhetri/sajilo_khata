"use client";

import { useCallback } from "react";
import { format } from "date-fns";
import { CheckCircle2, Dumbbell, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import WorkoutTable from "@/components/workout/WorkoutTable";
import { useGetTodaySession } from "@/hooks/react-query/workout/get-today-session.hook";
import { useGetActivePlan } from "@/hooks/react-query/workout/get-active-plan.hook";
import { useHandleStartSession } from "@/hooks/react-query/workout/start-session.hook";
import { useHandleLogSet } from "@/hooks/react-query/workout/log-set.hook";
import { useHandleAddSet } from "@/hooks/react-query/workout/add-set.hook";
import { useHandleDeleteSet } from "@/hooks/react-query/workout/delete-set.hook";
import { useHandleCompleteSession } from "@/hooks/react-query/workout/complete-session.hook";
import type {
  IWorkoutSession,
  IWorkoutTableRow,
  TFeeling,
} from "@/types/workout/workout.types";


// ─────── Helpers ─────────────────────────────────────────────────────────────

const todayISO = () => format(new Date(), "yyyy-MM-dd");

// Build IWorkoutTableRow[] from the session's exercises array
// Backend shape: { exercises: [{ exerciseName, bodyPart, sets: [...] }] }
const buildSessionRows = (session: IWorkoutSession): IWorkoutTableRow[] =>
  (session.exercises ?? []).map((ex) => ({
    day: session.dayOfWeek,
    bodyPart: ex.bodyPart,
    exerciseName: ex.exerciseName,
    sets: ex.sets.map((s) => ({
      setNumber: s.setNumber,
      weightKg: s.actualWeightKg,
      reps: s.actualReps,
      feeling: s.actualFeeling,
      isCompleted: s.isCompleted,
      sessionSetId: s.id,
    })),
  }));

// ─────── Component ───────────────────────────────────────────────────────────

const TodayWorkout = () => {
  const { session, isLoading: sessionLoading } = useGetTodaySession();
  const { plan, isLoading: planLoading } = useGetActivePlan();

  const sessionId = session?.id ?? "";
  const { handleStartSession, isPending: isStarting } = useHandleStartSession();
  const { handleLogSet } = useHandleLogSet(sessionId);
  const { handleAddSet } = useHandleAddSet(sessionId);
  const { handleDeleteSet } = useHandleDeleteSet(sessionId);
  const { handleCompleteSession, isPending: isCompleting } =
    useHandleCompleteSession(sessionId);

  // Called once per set — only when weight + reps + feeling are all filled.
  const handleSetCommit = useCallback(
    (
      exerciseName: string,
      setNumber: number,
      weight: number,
      reps: number,
      feeling: TFeeling,
    ) => {
      if (!session) return;
      const exercise = (session.exercises ?? []).find(
        (ex) => ex.exerciseName === exerciseName,
      );
      const set = exercise?.sets.find((s) => s.setNumber === setNumber);
      if (!set || !exercise) return;

      handleLogSet({
        exerciseName,
        bodyPart: exercise.bodyPart,
        setNumber,
        actualWeightKg: weight,
        actualReps: reps,
        actualFeeling: feeling,
        planExerciseId: set.planExerciseId,
      }).catch(() => {});
    },
    [session, handleLogSet],
  );

  const handleAddSetForExercise = useCallback(
    (exerciseName: string, bodyPart: string) => {
      handleAddSet({ exerciseName, bodyPart }).catch(() => {});
    },
    [handleAddSet],
  );

  if (sessionLoading || planLoading) {
    return <Skeleton className="h-40 w-full rounded-lg" />;
  }

  // No session yet
  if (!session) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
        <Dumbbell className="mx-auto h-10 w-10 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">No workout yet today</p>
          {!plan && (
            <p className="mt-1 text-xs text-muted-foreground">
              Import a plan first to pre-fill your sets.
            </p>
          )}
        </div>
        <Button
          onClick={() => handleStartSession(todayISO())}
          disabled={isStarting}
          size="sm"
        >
          {isStarting ? (
            <Loader2 size={14} className="animate-spin mr-1" />
          ) : null}
          Start Today&apos;s Workout
        </Button>
      </div>
    );
  }

  const rows = buildSessionRows(session);
  const allSets = (session.exercises ?? []).flatMap((ex) => ex.sets);
  const totalSets = allSets.length;
  const completedSets = allSets.filter((s) => s.isCompleted).length;
  const isComplete = !!session.completedAt;

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium tabular-nums text-foreground">
              {completedSets} / {totalSets}
            </span>{" "}
            sets completed
          </p>
          {session.durationMinutes != null && (
            <p className="text-xs text-muted-foreground">
              {session.durationMinutes} min
            </p>
          )}
        </div>
        {isComplete ? (
          <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600">
            <CheckCircle2 size={13} />
            Completed
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCompleteSession()}
            disabled={isCompleting}
          >
            {isCompleting ? (
              <Loader2 size={13} className="animate-spin mr-1" />
            ) : null}
            Complete Session
          </Button>
        )}
      </div>

      <WorkoutTable
        rows={rows}
        mode={isComplete ? "plan" : "session"}
        onCommit={handleSetCommit}
        onAddSet={handleAddSetForExercise}
        onDelete={(setId) => handleDeleteSet(setId).catch(() => {})}
        isLoading={false}
      />
    </div>
  );
};

export default TodayWorkout;
