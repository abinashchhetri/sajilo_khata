import { z } from "zod";

export const MealPrepSchema = z.object({
  name: z.string().trim().min(1, "Name required"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
  totalPortions: z.coerce.number().int().min(1, "At least 1 portion"),
  caloriesPerPortion: z.coerce.number().int().min(0).optional(),
  proteinPerPortionG: z.coerce.number().min(0).optional(),
  carbsPerPortionG: z.coerce.number().min(0).optional(),
  fatPerPortionG: z.coerce.number().min(0).optional(),
  expiresAt: z.string().optional(),
  notes: z.string().trim().optional(),
});

export type TMealPrepForm = z.infer<typeof MealPrepSchema>;
