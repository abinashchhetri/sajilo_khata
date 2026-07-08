// Fitness tracking page — workouts with tabs for Today, History, Progress, Plan

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { CsvImportDialog } from "@/components/shared/CsvImportDialog";
import { LogSessionForm } from "@/components/workouts/LogSessionForm";
import { SessionCard } from "@/components/workouts/SessionCard";
import { SessionsList } from "@/components/workouts/SessionsList";
import { ProgressChart } from "@/components/workouts/ProgressChart";
import { ExercisePicker } from "@/components/workouts/ExercisePicker";
import { WorkoutPlanView } from "@/components/workouts/WorkoutPlanView";
import { useGetWorkoutToday } from "@/hooks/react-query/workouts/get-workout-today.hook";
import { useHandleCreateWorkoutSession } from "@/hooks/react-query/workouts/post-workout-session.hook";
import { useHandleImportWorkoutPlan } from "@/hooks/react-query/workouts/import-workout-plan.hook";
import { useHandleClearWorkoutPlan } from "@/hooks/react-query/workouts/clear-workout-plan.hook";
import { useGetExerciseProgress } from "@/hooks/react-query/workouts/get-exercise-progress.hook";
import type { ICreateSession } from "@/types/fitness/workouts.types";

const WORKOUT_CSV_FORMAT = "day,exercise,sets,reps,weight,notes";
const WORKOUT_CSV_SAMPLE = `Monday,Bench Press,4,8,100,
Monday,Barbell Row,4,8,110,
Tuesday,Squat,4,6,130,
Tuesday,Leg Press,4,10,180,
Wednesday,Deadlift,3,3,160,
Thursday,Incline Bench,3,8,80,
Friday,Lat Pulldown,3,10,110,`;

export default function WorkoutsPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");

  const { today, isLoading: isTodayLoading } = useGetWorkoutToday();
  const { handleCreate, isPending: isCreating } =
    useHandleCreateWorkoutSession();
  const { handleImport, isPending: isImporting } =
    useHandleImportWorkoutPlan();
  const { handleClear, isPending: isClearing } =
    useHandleClearWorkoutPlan();
  const { progress, isLoading: isProgressLoading } =
    useGetExerciseProgress(selectedExercise);

  const handleSessionSubmit = async (session: ICreateSession) => {
    await handleCreate(session);
  };

  if (isTodayLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fitness</h1>
          <p className="text-muted-foreground text-sm">
            Track your workouts and progress
          </p>
        </div>
        <Button onClick={() => setImportOpen(true)}>
          <Plus size={16} className="mr-2" />
          Import Plan
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {today?.loggedSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Logged ✓</h3>
              </div>
              <SessionCard session={today.loggedSession} />
            </div>
          ) : today?.plan.length ? (
            <div className="space-y-4">
              <h3 className="font-semibold">
                {today.dayName} — {today.plan.length} exercises
              </h3>
              <LogSessionForm
                plan={today.plan}
                onSubmit={handleSessionSubmit}
                isLoading={isCreating}
              />
            </div>
          ) : (
            <EmptyState
              message={`No plan for ${today?.dayName}`}
              description="Import your weekly plan first"
            />
          )}
        </TabsContent>

        <TabsContent value="history">
          <SessionsList />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <ExercisePicker value={selectedExercise} onChange={setSelectedExercise} />
          {selectedExercise ? (
            isProgressLoading ? (
              <Skeleton className="h-80" />
            ) : progress?.points.length ? (
              <ProgressChart progress={progress} />
            ) : (
              <EmptyState
                message="No data yet"
                description="Log workouts to see progress"
              />
            )
          ) : (
            <EmptyState
              message="Pick an exercise"
              description="See your progress over time"
            />
          )}
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setClearConfirm(true)}
              disabled={isClearing}
            >
              Clear Plan
            </Button>
          </div>
          <WorkoutPlanView />
        </TabsContent>
      </Tabs>

      <CsvImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import Workout Plan"
        formatHint={`CSV format: ${WORKOUT_CSV_FORMAT}`}
        sampleCsv={WORKOUT_CSV_SAMPLE}
        isPending={isImporting}
        onImport={async (csv) => {
          const result = await handleImport(csv);
          return result || { inserted: 0, daysCovered: 0, skipped: 0, warnings: [] };
        }}
      />

      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear workout plan?"
        description="This will delete the entire weekly plan. This cannot be undone."
        confirmLabel="Clear"
        onConfirm={async () => {
          await handleClear();
          setClearConfirm(false);
        }}
      />
    </div>
  );
}
