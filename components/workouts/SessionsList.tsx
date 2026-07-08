// List of workout sessions with pagination

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { SessionCard } from "./SessionCard";
import { useGetWorkoutSessions } from "@/hooks/react-query/workouts/get-workout-sessions.hook";
import { useHandleDeleteWorkoutSession } from "@/hooks/react-query/workouts/delete-workout-session.hook";

export function SessionsList() {
  const [page, setPage] = useState(1);
  const { sessions, pagination, isLoading } = useGetWorkoutSessions({
    page,
    limit: 10,
  });
  const { handleDelete, isPending: isDeleting } =
    useHandleDeleteWorkoutSession();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!sessions.length) {
    return <EmptyState message="No workouts yet" description="Log your first workout" />;
  }

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

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          ← Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {page} of{" "}
          {pagination
            ? Math.ceil(pagination.total / pagination.limit)
            : "–"}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={
            !pagination ||
            pagination.data.length < pagination.limit
          }
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
