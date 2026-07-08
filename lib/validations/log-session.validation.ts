import { z } from "zod";

export const SessionExerciseSchema = z.object({
  exerciseName: z.string().trim().min(1, "Exercise name required"),
  completedSets: z.coerce.number().int().min(0).optional(),
  actualReps: z.coerce.number().int().min(0).optional(),
  actualWeight: z.coerce.number().min(0).optional(),
  plannedSets: z.coerce.number().int().min(0).optional(),
  plannedReps: z.coerce.number().int().min(0).optional(),
  plannedWeight: z.coerce.number().min(0).optional(),
  skipped: z.boolean().optional(),
});

export const LogSessionSchema = z.object({
  title: z.string().trim().optional(),
  feeling: z.coerce.number().int().min(1).max(5).optional(),
  durationMinutes: z.coerce.number().int().min(0).optional(),
  notes: z.string().trim().optional(),
  exercises: z.array(SessionExerciseSchema).min(1, "Add at least one exercise"),
});

export type TLogSession = z.infer<typeof LogSessionSchema>;
