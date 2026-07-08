// One logged meal: name, time, source tag, macros, delete.

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealTypeBadge } from "./MealTypeBadge";
import { MacroChips } from "./MacroChips";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { MEAL_SOURCE_LABEL } from "@/utils/health-format.utils";
import { useHandleDeleteMealLog } from "@/hooks/react-query/meals/delete-meal-log.hook";
import type { IMealLog } from "@/types/nutrition/meals.types";

interface MealLogCardProps {
  log: IMealLog;
}

export function MealLogCard({ log }: MealLogCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { handleDelete, isPending } = useHandleDeleteMealLog();

  return (
    <>
      <Card>
        <CardContent className="flex items-start justify-between gap-3 p-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-body-sm font-medium text-foreground">
                {log.name}
              </span>
              {log.mealType && (
                <MealTypeBadge mealType={log.mealType} className="shrink-0" />
              )}
              <span className="shrink-0 rounded-full border border-hairline px-2 py-0.5 text-eyebrow text-ink-faint">
                {MEAL_SOURCE_LABEL[log.source] ?? log.source}
              </span>
            </div>
            <p className="mt-1 text-caption text-ink-faint tabular-nums">
              {format(new Date(log.consumedAt), "h:mm a")}
            </p>
            <MacroChips
              className="mt-1"
              calories={log.calories}
              proteinG={log.proteinG}
              carbsG={log.carbsG}
              fatG={log.fatG}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-ink-faint hover:text-destructive"
            onClick={() => setShowConfirm(true)}
            disabled={isPending}
            aria-label="Delete meal log"
          >
            <Trash2 size={14} />
          </Button>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete meal log?"
        description="This removes this logged meal. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          handleDelete(log.id);
          setShowConfirm(false);
        }}
        isPending={isPending}
      />
    </>
  );
}
