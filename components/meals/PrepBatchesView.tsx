// List of all meal-prep batches.

"use client";

import { Boxes } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { PrepBatchCard } from "./PrepBatchCard";
import { useGetPrepBatches } from "@/hooks/react-query/meals/get-prep-batches.hook";

interface PrepBatchesViewProps {
  onAdd?: () => void;
}

export function PrepBatchesView({ onAdd }: PrepBatchesViewProps) {
  const { batches, isLoading } = useGetPrepBatches();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!batches.length) {
    return (
      <EmptyState
        icon={<Boxes size={22} strokeWidth={1.5} />}
        message="No prep batches yet"
        description="Batch-cook once, log portions all week"
        ctaLabel={onAdd ? "Add prep" : undefined}
        onCta={onAdd}
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
