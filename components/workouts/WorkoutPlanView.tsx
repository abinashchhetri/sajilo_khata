// Weekly workout plan grouped by day, with compact target chips per exercise.

"use client";

import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { formatTarget } from "@/utils/health-format.utils";
import { useGetWorkoutPlan } from "@/hooks/react-query/workouts/get-workout-plan.hook";

interface WorkoutPlanViewProps {
  onImport?: () => void;
}

export function WorkoutPlanView({ onImport }: WorkoutPlanViewProps) {
  const { plan, isLoading } = useGetWorkoutPlan();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!plan.length) {
    return (
      <EmptyState
        icon={<CalendarDays size={22} strokeWidth={1.5} />}
        message="No workout plan yet"
        description="Import a CSV to seed your weekly routine"
        ctaLabel={onImport ? "Import plan" : undefined}
        onCta={onImport}
      />
    );
  }

  return (
    <div className="space-y-3">
      {plan.map((day) => (
        <Card key={day.dayOfWeek}>
          <CardContent className="p-4">
            <p className="text-eyebrow uppercase tracking-wide text-ink-faint">
              {day.dayName}
            </p>
            <div className="mt-2 divide-y divide-hairline">
              {day.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                >
                  <span className="min-w-0 truncate text-body-sm text-foreground">
                    {ex.exerciseName}
                  </span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-eyebrow text-ink-muted tabular-nums">
                    {formatTarget(ex.targetSets, ex.targetReps, ex.targetWeight)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
