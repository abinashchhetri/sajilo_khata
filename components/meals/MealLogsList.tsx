// Paginated list of meal logs.

"use client";

import { useState } from "react";
import { UtensilsCrossed, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { MealLogCard } from "./MealLogCard";
import { useGetMealLogs } from "@/hooks/react-query/meals/get-meal-logs.hook";

const PAGE_SIZE = 10;

export function MealLogsList() {
  const [page, setPage] = useState(1);
  const { logs, pagination, isLoading } = useGetMealLogs({
    page,
    limit: PAGE_SIZE,
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!logs.length) {
    return (
      <EmptyState
        icon={<UtensilsCrossed size={22} strokeWidth={1.5} />}
        message="No meals logged yet"
        description="Log a meal or tap a planned meal to get started"
      />
    );
  }

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.limit))
    : 1;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {logs.map((log) => (
          <MealLogCard key={log.id} log={log} />
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
            disabled={logs.length < PAGE_SIZE || page >= totalPages}
          >
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
