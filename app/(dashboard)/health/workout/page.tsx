"use client";

import { useState } from "react";
import { Upload, Dumbbell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TodayWorkout from "@/components/workout/TodayWorkout";
import WorkoutTable from "@/components/workout/WorkoutTable";
import WorkoutPlanImport from "@/components/workout/WorkoutPlanImport";
import ExerciseProgress from "@/components/workout/ExerciseProgress";
import EmptyState from "@/components/shared/EmptyState";
import { useGetActivePlan } from "@/hooks/react-query/workout/get-active-plan.hook";
import type {
  IWorkoutPlan,
  IWorkoutTableRow,
} from "@/types/workout/workout.types";

// ─────── Helpers ─────────────────────────────────────────────────────────────

// Convert plan.days[] → IWorkoutTableRow[]
// Backend shape: days[] → bodyParts[] → exercises[] → sets[]
const planToRows = (plan: IWorkoutPlan): IWorkoutTableRow[] =>
  plan.days.flatMap((d) =>
    d.bodyParts.flatMap((bp) =>
      bp.exercises.map((ex) => ({
        day: d.day,
        bodyPart: bp.bodyPart,
        exerciseName: ex.exerciseName,
        sets: ex.sets.map((s) => ({
          setNumber: s.setNumber,
          weightKg: s.targetWeightKg,
          reps: s.targetReps,
          feeling: s.targetFeeling,
        })),
      })),
    ),
  );

// Unique exercise names across all days
const exerciseNames = (plan: IWorkoutPlan): string[] =>
  Array.from(
    new Set(
      plan.days.flatMap((d) =>
        d.bodyParts.flatMap((bp) => bp.exercises.map((ex) => ex.exerciseName)),
      ),
    ),
  );

// ─────── Component ───────────────────────────────────────────────────────────

const WorkoutPage = () => {
  const [importOpen, setImportOpen] = useState(false);
  const { plan, isLoading } = useGetActivePlan();

  const hasPlan = !!plan;
  const planRows = plan ? planToRows(plan) : [];
  const names = plan ? exerciseNames(plan) : [];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-foreground">Workout</h1>
          <p className="text-sm text-muted-foreground">
            Track your training sessions and progress
          </p>
        </div>
        {hasPlan && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setImportOpen(true)}
          >
            <Upload size={14} />
            Re-import Plan
          </Button>
        )}
      </div>

      {/* ── Today's Session ── */}
      <section className="space-y-3">
        <h2 className="text-body-sm font-medium text-foreground">
          Today&apos;s Session
        </h2>
        <TodayWorkout />
      </section>

      {/* ── Weekly Plan ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-body-sm font-medium text-foreground">
            Weekly Plan
          </h2>
          {!hasPlan && !isLoading && (
            <Button size="sm" onClick={() => setImportOpen(true)}>
              <Upload size={14} />
              Import Plan
            </Button>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : !hasPlan ? (
          <EmptyState
            icon={<Dumbbell size={20} />}
            message="No active plan"
            description="Import a CSV plan to pre-fill your session with target weights, reps, and sets."
            ctaLabel="Import CSV Plan"
            onCta={() => setImportOpen(true)}
          />
        ) : (
          <WorkoutTable rows={planRows} mode="plan" isLoading={false} />
        )}
      </section>

      {/* ── Progress ── */}
      <section className="space-y-3">
        <h2 className="text-body-sm font-medium text-foreground">Progress</h2>
        <ExerciseProgress exerciseNames={names} />
      </section>

      {/* Import dialog */}
      <WorkoutPlanImport open={importOpen} onOpenChange={setImportOpen} />
    </div>
  );
};

export default WorkoutPage;
