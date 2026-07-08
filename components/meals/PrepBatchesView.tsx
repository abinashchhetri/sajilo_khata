// List of all meal prep batches

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { PrepBatchCard } from "./PrepBatchCard";
import { useGetPrepBatches } from "@/hooks/react-query/meals/get-prep-batches.hook";

export function PrepBatchesView() {
  const { batches, isLoading } = useGetPrepBatches();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (!batches.length) {
    return (
      <EmptyState
        message="No prep batches yet"
        description="Create one to get started"
      />
    );
  }

  return (
    <div className="space-y-2">
      {batches.map((batch) => (
        <PrepBatchCard key={batch.id} batch={batch} />
      ))}
    </div>
  );
}
