// Meal prep batch card with consume and delete

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
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

  const isDepletedClass =
    batch.remainingPortions === 0 ? "opacity-50" : "";

  return (
    <>
      <Card className={isDepletedClass}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{batch.name}</p>
                {batch.mealType && (
                  <Badge variant="secondary" className="text-xs">
                    {batch.mealType.charAt(0).toUpperCase() +
                      batch.mealType.slice(1)}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {batch.remainingPortions} of {batch.totalPortions} portions
                {batch.expiresAt && (
                  <>
                    {" "}
                    • Expires{" "}
                    {format(new Date(batch.expiresAt), "MMM d")}
                  </>
                )}
              </p>

              {(batch.caloriesPerPortion !== null ||
                batch.proteinPerPortionG !== null ||
                batch.carbsPerPortionG !== null ||
                batch.fatPerPortionG !== null) && (
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {batch.caloriesPerPortion !== null && (
                    <span>{batch.caloriesPerPortion} cal</span>
                  )}
                  {batch.proteinPerPortionG !== null && (
                    <span>P: {batch.proteinPerPortionG}g</span>
                  )}
                  {batch.carbsPerPortionG !== null && (
                    <span>C: {batch.carbsPerPortionG}g</span>
                  )}
                  {batch.fatPerPortionG !== null && (
                    <span>F: {batch.fatPerPortionG}g</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={() => handleConsume(batch.id, {})}
                disabled={
                  batch.remainingPortions <= 0 || isConsuming
                }
              >
                Ate Portion
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete prep batch?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          handleDelete(batch.id);
          setShowDeleteConfirm(false);
        }}
      />
    </>
  );
}
