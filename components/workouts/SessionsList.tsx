// Paginated list of logged workout sessions.

"use client";

import { useState } from "react";
import { Dumbbell, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { SessionCard } from "./SessionCard";
import { useGetWorkoutSessions } from "@/hooks/react-query/workouts/get-workout-sessions.hook";
import { useHandleDeleteWorkoutSession } from "@/hooks/react-query/workouts/delete-workout-session.hook";

const PAGE_SIZE = 10;

export function SessionsList() {
  const [page, setPage] = useState(1);
  const { sessions, pagination, isLoading } = useGetWorkoutSessions({
    page,
    limit: PAGE_SIZE,
  });
  const { handleDelete, isPending: isDeleting } =
    useHandleDeleteWorkoutSession();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <EmptyState
        icon={<Dumbbell size={22} strokeWidth={1.5} />}
        message="No workouts logged yet"
        description="Your logged sessions will show up here"
      />
    );
  }

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.limit))
    : 1;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={14} />
            Prev
          </Button>
          <span className="text-caption text-ink-muted tabular-nums">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={sessions.length < PAGE_SIZE || page >= totalPages}
          >
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
