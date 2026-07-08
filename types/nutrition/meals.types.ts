// Meal types — mirror backend DTOs exactly.
// All timestamps are ISO strings; numbers are real numbers (nullable where optional).

export type TMealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface IMealPlanItem {
  id: string;
  userId: string;
  dayOfWeek: number;
  mealType: TMealType;
  name: string;
  orderIndex: number;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IMealPlanDay {
  dayOfWeek: number;
  dayName: string;
  meals: IMealPlanItem[];
}

export interface IMealLog {
  id: string;
  userId: string;
  consumedAt: string;
  mealType: TMealType | null;
  name: string;
  planItemId: string | null;
  prepBatchId: string | null;
  source: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  entryMethod: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IMealPrepBatch {
  id: string;
  userId: string;
  name: string;
  preppedAt: string;
  mealType: TMealType | null;
  totalPortions: number;
  consumedPortions: number;
  remainingPortions: number;
  caloriesPerPortion: number | null;
  proteinPerPortionG: number | null;
  carbsPerPortionG: number | null;
  fatPerPortionG: number | null;
  expiresAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IMealToday {
  dayOfWeek: number;
  dayName: string;
  plan: IMealPlanItem[];
  logs: IMealLog[];
  prepBatches: IMealPrepBatch[];
}

export interface ICreateMealLog {
  name: string;
  consumedAt?: string;
  mealType?: TMealType;
  planItemId?: string;
  source?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  entryMethod?: string;
  notes?: string;
}

export interface IUpdateMealLog {
  name?: string;
  consumedAt?: string;
  mealType?: TMealType;
  planItemId?: string;
  source?: string;
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  entryMethod?: string;
  notes?: string;
}

export interface ICreatePrep {
  name: string;
  preppedAt?: string;
  mealType?: TMealType;
  totalPortions: number;
  caloriesPerPortion?: number;
  proteinPerPortionG?: number;
  carbsPerPortionG?: number;
  fatPerPortionG?: number;
  expiresAt?: string;
  notes?: string;
}

export interface IUpdatePrep {
  name?: string;
  preppedAt?: string;
  mealType?: TMealType;
  totalPortions?: number;
  caloriesPerPortion?: number;
  proteinPerPortionG?: number;
  carbsPerPortionG?: number;
  fatPerPortionG?: number;
  expiresAt?: string;
  notes?: string;
}

export interface IConsumePrep {
  consumedAt?: string;
  notes?: string;
}

export interface IConsumeResult {
  batch: IMealPrepBatch;
  log: IMealLog;
}

export interface IMealImportSummary {
  inserted: number;
  daysCovered: number;
  skipped: number;
  warnings: string[];
}

export interface IFindLogsParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}
