// ─────────────────────────────────────────────────────────────────────────────
// Workout Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirror the backend's workout domain exactly.
// All dates are ISO 8601 strings; all numbers are number.
// ─────────────────────────────────────────────────────────────────────────────

export type TDayOfWeek =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export type TFeeling = "light" | "average" | "medium" | "hard";

export interface IWorkoutPlanSet {
  setNumber: number;
  targetWeightKg: number;
  targetReps: number;
  targetFeeling: TFeeling;
}

export interface IWorkoutPlanExercise {
  exerciseName: string;
  sets: IWorkoutPlanSet[];
}

export interface IWorkoutPlanBodyPart {
  bodyPart: string;
  exercises: IWorkoutPlanExercise[];
}

export interface IWorkoutPlanDay {
  day: TDayOfWeek;
  bodyParts: IWorkoutPlanBodyPart[];
}

export interface IWorkoutPlan {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  importedAt: string;
  days: IWorkoutPlanDay[];
}

export interface IWorkoutSessionSet {
  id: string;
  sessionId: string;
  exerciseName: string;
  bodyPart: string;
  setNumber: number;
  actualWeightKg: number | null;
  actualReps: number | null;
  actualFeeling: TFeeling | null;
  isCompleted: boolean;
  planExerciseId?: string | null;
}

export interface IWorkoutSessionExercise {
  exerciseName: string;
  bodyPart: string;
  sets: IWorkoutSessionSet[];
}

export interface IWorkoutSession {
  id: string;
  userId: string;
  sessionDate: string;
  dayOfWeek: TDayOfWeek;
  planId: string | null;
  notes: string | null;
  completedAt: string | null;
  durationMinutes: number | null;
  exercises: IWorkoutSessionExercise[];
}

export interface ISetData {
  setNumber: number;
  weightKg: number | null;
  reps: number | null;
  feeling: TFeeling | null;
  isCompleted?: boolean;
  sessionSetId?: string;
}

export interface IWorkoutTableRow {
  day: TDayOfWeek;
  bodyPart: string;
  exerciseName: string;
  sets: ISetData[];
}

export interface IProgressDataPoint {
  sessionDate: string;
  maxWeightKg: number;
  setsCompleted: number;
}

export interface IImportPlanResult {
  exerciseCount: number;
  daysCount: number;
  errors: string[];
}

export interface ILogSetBody {
  exerciseName: string;
  bodyPart: string;
  setNumber: number;
  actualWeightKg?: number | null;
  actualReps?: number | null;
  actualFeeling?: TFeeling | null;
  planExerciseId?: string | null;
}
