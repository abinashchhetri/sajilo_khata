"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { ChevronDown, ChevronUp, CheckCircle2, Clock, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WorkoutTable from "@/components/workout/WorkoutTable";
import EmptyState from "@/components/shared/EmptyState";
import { useGetSessions } from "@/hooks/react-query/workout/get-sessions.hook";
import type {
  IWorkoutSession,
  IWorkoutTableRow,
  TDayOfWeek,
  TFeeling,
} from "@/types/workout/workout.types";

// ─────── Helpers ─────────────────────────────────────────────────────────────

const sessionToRows = (session: IWorkoutSession): IWorkoutTableRow[] =>
  (session.exercises ?? []).map((ex) => ({
    day: session.dayOfWeek as TDayOfWeek,
    bodyPart: ex.bodyPart,
    exerciseName: ex.exerciseName,
    sets: ex.sets.map((s) => ({
      setNumber: s.setNumber,
      weightKg: s.actualWeightKg,
      reps: s.actualReps,
      feeling: s.actualFeeling as TFeeling | null,
      isCompleted: s.isCompleted,
    })),
  }));

// ─────── Session Row ─────────────────────────────────────────────────────────

const SessionRow = ({ session }: { session: IWorkoutSession }) => {
  const [expanded, setExpanded] = useState(false);
  const allSets = (session.exercises ?? []).flatMap((ex) => ex.sets);
  const total = allSets.length;
  const completed = allSets.filter((s) => s.isCompleted).length;
  const rows = expanded ? sessionToRows(session) : [];

  return (
    <div className="rounded-lg border border-hairline overflow-hidden">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">
              {format(parseISO(session.sessionDate), "EEEE, d MMM yyyy")}
            </p>
            <p className="text-xs text-muted-foreground">{session.dayOfWeek}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="tabular-nums">
              {completed}/{total} sets
            </span>
            {session.durationMinutes != null && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {session.durationMinutes} min
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.completedAt && (
            <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
              <CheckCircle2 size={10} />
              Done
            </span>
          )}
          {expanded ? (
            <ChevronUp size={16} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={16} className="text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded read-only table */}
      {expanded && (
        <div className="border-t border-hairline p-4">
          <WorkoutTable rows={rows} mode="plan" isLoading={false} />
        </div>
      )}
    </div>
  );
};

// ─────── Page ────────────────────────────────────────────────────────────────

const WorkoutHistoryPage = () => {
  const [page, setPage] = useState(1);
  const { sessions, totalPages, hasNextPage, hasPrevPage, isLoading } =
    useGetSessions({ page, limit: 10 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-heading-3 text-foreground">Workout History</h1>
        <p className="text-sm text-muted-foreground">
          All past sessions — expand any row to see the full set log
        </p>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<History size={20} />}
          message="No sessions yet"
          description="Start a workout on the Workout page to see your history here."
        />
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionRow key={s.id} session={s} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={!hasPrevPage || isLoading}
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistoryPage;
