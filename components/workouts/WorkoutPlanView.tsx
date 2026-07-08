// Display the weekly workout plan grouped by day

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { useGetWorkoutPlan } from "@/hooks/react-query/workouts/get-workout-plan.hook";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkoutPlanView() {
  const { plan, isLoading } = useGetWorkoutPlan();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!plan.length) {
    return (
      <EmptyState
        message="No workout plan yet"
        description="Import a CSV to get started"
      />
    );
  }

  return (
    <div className="space-y-4">
      {plan.map((day) => (
        <Card key={day.dayOfWeek}>
          <CardHeader>
            <CardTitle className="text-base">{day.dayName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {day.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 text-sm"
                >
                  <span className="font-medium">{ex.exerciseName}</span>
                  <span className="text-muted-foreground text-xs">
                    {ex.targetSets && ex.targetReps && ex.targetWeight
                      ? `${ex.targetSets}×${ex.targetReps} @ ${ex.targetWeight} kg`
                      : ex.targetSets && ex.targetReps
                        ? `${ex.targetSets}×${ex.targetReps}`
                        : "–"}
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
