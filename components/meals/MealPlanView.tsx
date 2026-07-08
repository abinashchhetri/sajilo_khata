// Weekly meal plan grouped by day, meals ordered by the backend.

"use client";

import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import { MealTypeBadge } from "./MealTypeBadge";
import { MacroChips } from "./MacroChips";
import { useGetMealPlan } from "@/hooks/react-query/meals/get-meal-plan.hook";

interface MealPlanViewProps {
  onImport?: () => void;
}

export function MealPlanView({ onImport }: MealPlanViewProps) {
  const { plan, isLoading } = useGetMealPlan();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!plan.length) {
    return (
      <EmptyState
        icon={<CalendarDays size={22} strokeWidth={1.5} />}
        message="No meal plan yet"
        description="Import a CSV to seed your weekly meals"
        ctaLabel={onImport ? "Import plan" : undefined}
        onCta={onImport}
      />
    );
  }

  return (
    <div className="space-y-3">
      {plan.map((day) => (
        <Card key={day.dayOfWeek}>
          <CardContent className="p-4">
            <p className="text-eyebrow uppercase tracking-wide text-ink-faint">
              {day.dayName}
            </p>
            <div className="mt-2 divide-y divide-hairline">
              {day.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-body-sm text-foreground">
                        {meal.name}
                      </span>
                      <MealTypeBadge
                        mealType={meal.mealType}
                        className="shrink-0"
                      />
                    </div>
                  </div>
                  <MacroChips
                    className="shrink-0 justify-end"
                    calories={meal.calories}
                    proteinG={meal.proteinG}
                    carbsG={meal.carbsG}
                    fatG={meal.fatG}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
