// Workout types — mirror backend DTOs exactly.
// All timestamps are ISO strings; numbers are real numbers (nullable where optional).

export interface IWorkoutPlanExercise {
  id: string;
  userId: string;
  dayOfWeek: number;
  exerciseName: string;
  orderIndex: number;
  targetSets: number | null;
  targetReps: number | null;
  targetWeight: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkoutPlanDay {
  dayOfWeek: number;
  dayName: string;
  exercises: IWorkoutPlanExercise[];
}

export interface IWorkoutSetDetail {
  reps: number;
  weight: number;
}

export interface IWorkoutSessionExercise {
  id: string;
  sessionId: string;
  userId: string;
  performedAt: string;
  exerciseName: string;
  orderIndex: number;
  plannedSets: number | null;
  plannedReps: number | null;
  plannedWeight: number | null;
  completedSets: number | null;
  actualReps: number | null;
  actualWeight: number | null;
  setDetails: IWorkoutSetDetail[] | null;
  skipped: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWorkoutSession {
  id: string;
  userId: string;
  performedAt: string;
  dayOfWeek: number;
  title: string | null;
  feeling: number | null;
  durationMinutes: number | null;
  notes: string | null;
  entryMethod: string;
  exercises: IWorkoutSessionExercise[];
  createdAt: string;
  updatedAt: string;
}

export interface IWorkoutToday {
  dayOfWeek: number;
  dayName: string;
  plan: IWorkoutPlanExercise[];
  loggedSession: IWorkoutSession | null;
}

export interface IExerciseProgressPoint {
  performedAt: string;
  actualWeight: number | null;
  actualReps: number | null;
  completedSets: number | null;
  estimated1RM: number | null;
}

export interface IExerciseProgress {
  exerciseName: string;
  points: IExerciseProgressPoint[];
  bests: {
    maxWeight: number | null;
    maxEst1RM: number | null;
    maxVolume: number | null;
  };
}

export interface IImportSummary {
  inserted: number;
  daysCovered: number;
  skipped: number;
  warnings: string[];
}

export interface ICreateSessionExercise {
  exerciseName: string;
  orderIndex?: number;
  plannedSets?: number;
  plannedReps?: number;
  plannedWeight?: number;
  completedSets?: number;
  actualReps?: number;
  actualWeight?: number;
  setDetails?: IWorkoutSetDetail[];
  skipped?: boolean;
}

export interface ICreateSession {
  performedAt?: string;
  dayOfWeek?: number;
  title?: string;
  feeling?: number;
  durationMinutes?: number;
  notes?: string;
  entryMethod?: string;
  exercises: ICreateSessionExercise[];
}

export interface IUpdateSession {
  performedAt?: string;
  dayOfWeek?: number;
  title?: string;
  feeling?: number;
  durationMinutes?: number;
  notes?: string;
  entryMethod?: string;
}

export interface IFindSessionsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}
