// A planned meal with a one-tap "Ate this" action that logs it against the plan.

"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealTypeBadge } from "./MealTypeBadge";
import { MacroChips } from "./MacroChips";
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
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-body-sm font-medium text-foreground">
              {meal.name}
            </span>
            <MealTypeBadge mealType={meal.mealType} className="shrink-0" />
          </div>
          <MacroChips
            className="mt-1.5"
            calories={meal.calories}
            proteinG={meal.proteinG}
            carbsG={meal.carbsG}
            fatG={meal.fatG}
          />
        </div>

        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={handleAte}
          disabled={isPending}
        >
          <Check size={14} />
          Ate this
        </Button>
      </CardContent>
    </Card>
  );
}
