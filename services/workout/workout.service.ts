// ─────────────────────────────────────────────────────────────────────────────
// Workout Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls for the workout domain.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse, TPaginatedResponse } from "@/types/api.types";
import type {
  IWorkoutPlan,
  IWorkoutPlanDay,
  IWorkoutSession,
  IWorkoutSessionSet,
  IImportPlanResult,
  IProgressDataPoint,
  ILogSetBody,
  TDayOfWeek,
} from "@/types/workout/workout.types";

// ─────── Plan ────────────────────────────────────────────────────────────────

export const importPlan = async (
  file: File,
  planName: string,
): Promise<TApiResponse<IImportPlanResult & { plan: IWorkoutPlan }>> => {
  const form = new FormData();
  form.append("file", file);
  form.append("planName", planName);
  const { data } = await apiClient.post("/workout/plan/import", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchActivePlan = async (): Promise<
  TApiResponse<IWorkoutPlan | null>
> => {
  const { data } = await apiClient.get("/workout/plan");
  return data;
};

export const fetchPlanForDay = async (
  day: TDayOfWeek,
): Promise<TApiResponse<IWorkoutPlanDay | null>> => {
  const { data } = await apiClient.get(`/workout/plan/day/${day}`);
  return data;
};

export const deactivatePlan = async (): Promise<void> => {
  await apiClient.delete("/workout/plan", { _skipToast: true } as object);
};

// ─────── Sessions ────────────────────────────────────────────────────────────

export const startSession = async (
  sessionDate: string,
): Promise<TApiResponse<IWorkoutSession>> => {
  const { data } = await apiClient.post("/workout/sessions", { sessionDate });
  return data;
};

export const fetchSessions = async (
  params?: Record<string, unknown>,
): Promise<TApiResponse<TPaginatedResponse<IWorkoutSession>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/workout/sessions${query ? `?${query}` : ""}`,
  );
  return data;
};

export const fetchTodaySession = async (): Promise<
  TApiResponse<IWorkoutSession | null>
> => {
  const { data } = await apiClient.get("/workout/sessions/today");
  return data;
};

export const fetchSession = async (
  id: string,
): Promise<TApiResponse<IWorkoutSession>> => {
  const { data } = await apiClient.get(`/workout/sessions/${id}`);
  return data;
};

// ─────── Sets ────────────────────────────────────────────────────────────────

export const logSet = async (
  sessionId: string,
  body: ILogSetBody,
): Promise<TApiResponse<IWorkoutSessionSet>> => {
  const { data } = await apiClient.post(
    `/workout/sessions/${sessionId}/sets`,
    body,
  );
  return data;
};

export const addSet = async (
  sessionId: string,
  body: { exerciseName: string; bodyPart: string },
): Promise<TApiResponse<IWorkoutSessionSet>> => {
  const { data } = await apiClient.post(
    `/workout/sessions/${sessionId}/sets/add`,
    body,
  );
  return data;
};

export const deleteSet = async (
  sessionId: string,
  setId: string,
): Promise<TApiResponse<{ message: string }>> => {
  const { data } = await apiClient.delete(
    `/workout/sessions/${sessionId}/sets/${setId}`,
  );
  return data;
};

export const completeSession = async (
  sessionId: string,
): Promise<TApiResponse<IWorkoutSession>> => {
  const { data } = await apiClient.post(
    `/workout/sessions/${sessionId}/complete`,
  );
  return data;
};

// ─────── Progress ─────────────────────────────────────────────────────────────

export const fetchProgress = async (
  exerciseName: string,
): Promise<TApiResponse<IProgressDataPoint[]>> => {
  const { data } = await apiClient.get(
    `/workout/progress/${encodeURIComponent(exerciseName)}`,
  );
  return data;
};
