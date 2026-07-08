// Planned meal card with macros

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHandleCreateMealLog } from "@/hooks/react-query/meals/post-meal-log.hook";
import type { IMealPlanItem } from "@/types/nutrition/meals.types";

interface PlannedMealCardProps {
  meal: IMealPlanItem;
}

export function PlannedMealCard({ meal }: PlannedMealCardProps) {
  const { handleCreate, isPending } = useHandleCreateMealLog();

  const handleAte = async () => {
    await handleCreate({
      name: meal.name,
      mealType: meal.mealType,
      planItemId: meal.id,
      source: "plan",
      calories: meal.calories ?? undefined,
      proteinG: meal.proteinG ?? undefined,
      carbsG: meal.carbsG ?? undefined,
      fatG: meal.fatG ?? undefined,
      entryMethod: "form",
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm">{meal.name}</p>
              <Badge variant="secondary" className="text-xs">
                {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
              </Badge>
            </div>

            {(meal.calories !== null ||
              meal.proteinG !== null ||
              meal.carbsG !== null ||
              meal.fatG !== null) && (
              <div className="flex gap-2 text-xs text-muted-foreground">
                {meal.calories !== null && <span>{meal.calories} cal</span>}
                {meal.proteinG !== null && <span>P: {meal.proteinG}g</span>}
                {meal.carbsG !== null && <span>C: {meal.carbsG}g</span>}
                {meal.fatG !== null && <span>F: {meal.fatG}g</span>}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleAte}
            disabled={isPending}
          >
            Ate this
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
