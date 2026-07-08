// Meal type pill with a decorative sticker-palette dot (Notion category-dot idiom)

import { cn } from "@/lib/utils";
import { MEAL_TYPE_LABEL, MEAL_TYPE_DOT } from "@/utils/health-format.utils";
import type { TMealType } from "@/types/nutrition/meals.types";

interface Props {
  mealType: TMealType;
  className?: string;
}

export function MealTypeBadge({ mealType, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-eyebrow text-ink-secondary",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", MEAL_TYPE_DOT[mealType])} />
      {MEAL_TYPE_LABEL[mealType]}
    </span>
  );
}
