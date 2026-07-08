// Health formatting helpers — meal-type labels + decorative sticker-palette
// dot colors, and workout feeling labels. Per DESIGN-notion.md the sticker
// palette (accent-*) is used ONLY as small category dots, never as structural
// fills or CTAs.

import type { TMealType } from "@/types/nutrition/meals.types";

// Meal type → title-cased label
export const MEAL_TYPE_LABEL: Record<TMealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

// Meal type → decorative sticker dot color (Tailwind bg-* class from token map).
// Distinct hue per meal for at-a-glance scanning — decoration only.
export const MEAL_TYPE_DOT: Record<TMealType, string> = {
  breakfast: "bg-accent-orange",
  lunch: "bg-accent-teal",
  dinner: "bg-accent-sky",
  snack: "bg-accent-green",
};

// Source of a logged meal → short tag label
export const MEAL_SOURCE_LABEL: Record<string, string> = {
  plan: "Plan",
  prep: "Prep",
  freeform: "Free",
};

// Workout feeling 1–5 → emoji + label (playful personality moment)
export const FEELING_OPTIONS: {
  value: number;
  emoji: string;
  label: string;
}[] = [
  { value: 1, emoji: "😫", label: "Rough" },
  { value: 2, emoji: "😐", label: "Meh" },
  { value: 3, emoji: "🙂", label: "Fine" },
  { value: 4, emoji: "😄", label: "Good" },
  { value: 5, emoji: "🔥", label: "Great" },
];

export function feelingEmoji(feeling: number | null): string | null {
  if (!feeling) return null;
  return FEELING_OPTIONS.find((f) => f.value === feeling)?.emoji ?? null;
}

// Format a target/planned triple as a compact "5×5 @ 80kg" string.
export function formatTarget(
  sets: number | null | undefined,
  reps: number | null | undefined,
  weight: number | null | undefined,
): string {
  if (sets && reps && weight) return `${sets}×${reps} @ ${weight}kg`;
  if (sets && reps) return `${sets}×${reps}`;
  return "—";
}
