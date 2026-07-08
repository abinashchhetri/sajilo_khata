import { z } from "zod";

export const MealLogSchema = z.object({
  name: z.string().trim().min(1, "Name required"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
  calories: z.coerce.number().int().min(0).optional(),
  proteinG: z.coerce.number().min(0).optional(),
  carbsG: z.coerce.number().min(0).optional(),
  fatG: z.coerce.number().min(0).optional(),
  notes: z.string().trim().optional(),
});

export type TMealLogForm = z.infer<typeof MealLogSchema>;
