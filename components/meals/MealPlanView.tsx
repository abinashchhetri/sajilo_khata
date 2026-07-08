// Display the weekly meal plan grouped by day

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { useGetMealPlan } from "@/hooks/react-query/meals/get-meal-plan.hook";
import { Skeleton } from "@/components/ui/skeleton";

export function MealPlanView() {
  const { plan, isLoading } = useGetMealPlan();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    );
  }

  if (!plan.length) {
    return (
      <EmptyState
        message="No meal plan yet"
        description="Import a CSV to get started"
      />
    );
  }

  return (
    <div className="space-y-4">
      {plan.map((day) => (
        <Card key={day.dayOfWeek}>
          <CardHeader>
            <CardTitle className="text-base">{day.dayName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {day.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="flex items-start justify-between py-2 border-b last:border-0 text-sm"
                >
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1"
                    >
                      {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {meal.calories !== null && <p>{meal.calories} cal</p>}
                    {(meal.proteinG !== null ||
                      meal.carbsG !== null ||
                      meal.fatG !== null) && (
                      <p className="text-xs">
                        {meal.proteinG !== null && `P: ${meal.proteinG}g `}
                        {meal.carbsG !== null && `C: ${meal.carbsG}g `}
                        {meal.fatG !== null && `F: ${meal.fatG}g`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
