// Fitness page — simple, clean, intuitive. Import plan → log one exercise at a time.

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
import { ExerciseLogTable } from "@/components/workouts/ExerciseLogTable";
import { SessionsList } from "@/components/workouts/SessionsList";
import { ProgressChart } from "@/components/workouts/ProgressChart";
import { ExercisePicker } from "@/components/workouts/ExercisePicker";
import { WorkoutPlanView } from "@/components/workouts/WorkoutPlanView";
import { useGetWorkoutToday } from "@/hooks/react-query/workouts/get-workout-today.hook";
import { useHandleImportWorkoutPlan } from "@/hooks/react-query/workouts/import-workout-plan.hook";
import { useHandleClearWorkoutPlan } from "@/hooks/react-query/workouts/clear-workout-plan.hook";
import { useGetExerciseProgress } from "@/hooks/react-query/workouts/get-exercise-progress.hook";

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
  const { handleImport, isPending: isImporting } = useHandleImportWorkoutPlan();
  const { handleClear, isPending: isClearing } = useHandleClearWorkoutPlan();
  const { progress, isLoading: isProgressLoading } =
    useGetExerciseProgress(selectedExercise);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-heading-3 text-foreground">Fitness</h1>
          <p className="text-body-sm text-ink-muted">
            Log workouts, track progress, build strength.
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
        <TabsList className="grid h-10 w-full grid-cols-4 gap-1 bg-canvas">
          <TabsTrigger value="today" className="gap-1.5">
            <Dumbbell size={15} />
            <span className="hidden sm:inline">Today</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <CheckCircle2 size={15} />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-1.5">
            <LineChart size={15} />
            <span className="hidden sm:inline">Progress</span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="gap-1.5">
            <Upload size={15} />
            <span className="hidden sm:inline">Plan</span>
          </TabsTrigger>
        </TabsList>

        {/* Today */}
        <TabsContent value="today" className="pt-4">
          {isLoading ? (
            <Skeleton className="h-96 w-full rounded-lg" />
          ) : today?.plan.length ? (
            <ExerciseLogTable plan={today.plan} dayName={today.dayName} />
          ) : (
            <EmptyState
              icon={<Dumbbell size={22} strokeWidth={1.5} />}
              message="No workout plan yet"
              description="Import a CSV file to create your weekly workout routine"
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
        <TabsContent value="progress" className="space-y-3 pt-4">
          <div>
            <h2 className="text-heading-3 text-foreground">Progress</h2>
            <p className="mt-0.5 text-body-sm text-ink-muted">
              Pick an exercise to see your strength trends
            </p>
          </div>
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
          <div>
            <h2 className="text-heading-3 text-foreground">Weekly plan</h2>
            <p className="mt-0.5 text-body-sm text-ink-muted">
              Your programmed exercises for each day
            </p>
          </div>
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
