// Fitness page — workouts. Tabs: Today (log in <60s), History, Progress, Plan.

"use client";

import { useState } from "react";
import { Upload, Dumbbell, CheckCircle2, Trash2, LineChart } from "lucide-react";
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

const WORKOUT_CSV_FORMAT = "Columns: day, exercise, sets, reps, weight, notes";
const WORKOUT_CSV_SAMPLE = `day,exercise,sets,reps,weight,notes
Monday,Bench Press,4,8,100,
Monday,Barbell Row,4,8,110,
Tuesday,Squat,4,6,130,
Wednesday,Deadlift,3,3,160,
Friday,Lat Pulldown,3,10,110,`;

const EMPTY_SUMMARY = { inserted: 0, daysCovered: 0, skipped: 0, warnings: [] };

export default function WorkoutsPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState("");

  const { today, isLoading } = useGetWorkoutToday();
  const { handleCreate, isPending: isCreating } =
    useHandleCreateWorkoutSession();
  const { handleImport, isPending: isImporting } = useHandleImportWorkoutPlan();
  const { handleClear, isPending: isClearing } = useHandleClearWorkoutPlan();
  const { progress, isLoading: isProgressLoading } =
    useGetExerciseProgress(selectedExercise);

  const handleSessionSubmit = async (session: ICreateSession) => {
    await handleCreate(session);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-3 text-foreground">Fitness</h1>
          <p className="text-body-sm text-ink-muted">
            {today ? today.dayName : "Log workouts and track progress"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setImportOpen(true)}
        >
          <Upload size={15} />
          Import plan
        </Button>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid h-9 w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        {/* Today */}
        <TabsContent value="today" className="pt-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-lg" />
          ) : today?.loggedSession ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-body-sm font-medium text-accent-green">
                <CheckCircle2 size={16} />
                Logged for today
              </div>
              <SessionCard session={today.loggedSession} highlight />
            </div>
          ) : today?.plan.length ? (
            <Card>
              <CardContent className="p-4 sm:p-5">
                <LogSessionForm
                  plan={today.plan}
                  onSubmit={handleSessionSubmit}
                  isLoading={isCreating}
                />
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={<Dumbbell size={22} strokeWidth={1.5} />}
              message={`Nothing planned for ${today?.dayName ?? "today"}`}
              description="Import your weekly plan to start logging"
              ctaLabel="Import plan"
              onCta={() => setImportOpen(true)}
            />
          )}
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="pt-4">
          <SessionsList />
        </TabsContent>

        {/* Progress */}
        <TabsContent value="progress" className="space-y-4 pt-4">
          <ExercisePicker
            value={selectedExercise}
            onChange={setSelectedExercise}
          />
          {!selectedExercise ? (
            <EmptyState
              icon={<LineChart size={22} strokeWidth={1.5} />}
              message="Pick an exercise"
              description="See how your lifts trend over time"
            />
          ) : isProgressLoading ? (
            <Skeleton className="h-80 w-full rounded-lg" />
          ) : progress?.points.length ? (
            <ProgressChart progress={progress} />
          ) : (
            <EmptyState
              icon={<LineChart size={22} strokeWidth={1.5} />}
              message="No data yet"
              description="Log this exercise to see progress"
            />
          )}
        </TabsContent>

        {/* Plan */}
        <TabsContent value="plan" className="space-y-3 pt-4">
          <WorkoutPlanView onImport={() => setImportOpen(true)} />
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="text-ink-faint hover:text-destructive"
              onClick={() => setClearConfirm(true)}
              disabled={isClearing}
            >
              <Trash2 size={14} />
              Clear plan
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <CsvImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import workout plan"
        formatHint={WORKOUT_CSV_FORMAT}
        sampleCsv={WORKOUT_CSV_SAMPLE}
        isPending={isImporting}
        onImport={async (csv) => (await handleImport(csv)) ?? EMPTY_SUMMARY}
      />

      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear workout plan?"
        description="This deletes your entire weekly plan. This cannot be undone."
        confirmLabel="Clear plan"
        onConfirm={async () => {
          await handleClear();
          setClearConfirm(false);
        }}
        isPending={isClearing}
      />
    </div>
  );
}
