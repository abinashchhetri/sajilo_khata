// A meal-prep batch: portion progress, per-portion macros, atomic "Ate a
// portion" consume, and delete. remainingPortions comes from the API (already
// computed) — never recompute it.

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealTypeBadge } from "./MealTypeBadge";
import { MacroChips } from "./MacroChips";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { cn } from "@/lib/utils";
import { useHandleConsumePortion } from "@/hooks/react-query/meals/consume-portion.hook";
import { useHandleDeletePrep } from "@/hooks/react-query/meals/delete-prep.hook";
import type { IMealPrepBatch } from "@/types/nutrition/meals.types";

interface PrepBatchCardProps {
  batch: IMealPrepBatch;
}

export function PrepBatchCard({ batch }: PrepBatchCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { handleConsume, isPending: isConsuming } = useHandleConsumePortion();
  const { handleDelete, isPending: isDeleting } = useHandleDeletePrep();

  const depleted = batch.remainingPortions <= 0;
  const pct =
    batch.totalPortions > 0
      ? Math.max(0, Math.min(100, (batch.remainingPortions / batch.totalPortions) * 100))
      : 0;

  return (
    <>
      <Card className={cn(depleted && "opacity-60")}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-body-sm font-medium text-foreground">
                  {batch.name}
                </span>
                {batch.mealType && (
                  <MealTypeBadge mealType={batch.mealType} className="shrink-0" />
                )}
              </div>

              <MacroChips
                className="mt-1.5"
                calories={batch.caloriesPerPortion}
                proteinG={batch.proteinPerPortionG}
                carbsG={batch.carbsPerPortionG}
                fatG={batch.fatPerPortionG}
              />
              {batch.expiresAt && (
                <p className="mt-1 text-caption text-ink-faint">
                  Expires {format(new Date(batch.expiresAt), "MMM d")}
                </p>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-ink-faint hover:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              aria-label="Delete prep batch"
            >
              <Trash2 size={14} />
            </Button>
          </div>

          {/* Portion progress */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-eyebrow text-ink-muted tabular-nums">
                <span>
                  {batch.remainingPortions} of {batch.totalPortions} left
                </span>
                {depleted && (
                  <span className="text-destructive">Depleted</span>
                )}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-accent-teal transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => handleConsume(batch.id, {})}
              disabled={depleted || isConsuming}
            >
              <Utensils size={14} />
              Ate a portion
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete prep batch?"
        description="This removes the batch and its remaining portions. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          handleDelete(batch.id);
          setShowDeleteConfirm(false);
        }}
        isPending={isDeleting}
      />
    </>
  );
}
