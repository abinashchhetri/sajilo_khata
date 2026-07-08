// List of meal logs with pagination

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { MealLogCard } from "./MealLogCard";
import { useGetMealLogs } from "@/hooks/react-query/meals/get-meal-logs.hook";

export function MealLogsList() {
  const [page, setPage] = useState(1);
  const { logs, pagination, isLoading } = useGetMealLogs({
    page,
    limit: 10,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <EmptyState
        message="No meals logged yet"
        description="Log a meal to get started"
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {logs.map((log) => (
          <MealLogCard key={log.id} log={log} />
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
            logs.length < pagination.limit
          }
        >
          Next →
        </Button>
      </div>
    </div>
  );
}
