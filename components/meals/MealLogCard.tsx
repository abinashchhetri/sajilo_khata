// Single meal log card

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useHandleDeleteMealLog } from "@/hooks/react-query/meals/delete-meal-log.hook";
import type { IMealLog } from "@/types/nutrition/meals.types";

interface MealLogCardProps {
  log: IMealLog;
}

export function MealLogCard({ log }: MealLogCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { handleDelete, isPending } = useHandleDeleteMealLog();

  const sourceLabel =
    log.source === "plan"
      ? "Plan"
      : log.source === "prep"
        ? "Prep"
        : "Free";

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">{log.name}</p>
                {log.mealType && (
                  <Badge variant="secondary" className="text-xs">
                    {log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1)}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {sourceLabel}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-1">
                {format(new Date(log.consumedAt), "h:mm a")}
              </p>

              {(log.calories !== null ||
                log.proteinG !== null ||
                log.carbsG !== null ||
                log.fatG !== null) && (
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {log.calories !== null && <span>{log.calories} cal</span>}
                  {log.proteinG !== null && <span>P: {log.proteinG}g</span>}
                  {log.carbsG !== null && <span>C: {log.carbsG}g</span>}
                  {log.fatG !== null && <span>F: {log.fatG}g</span>}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete meal log?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          handleDelete(log.id);
          setShowConfirm(false);
        }}
      />
    </>
  );
}
