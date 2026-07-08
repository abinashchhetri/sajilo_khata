// Workouts Service
// All HTTP calls related to workouts.
// Each function maps to one backend endpoint under /api/v1/workouts.
// No side effects — no toasts, no routing, no cache logic here.

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type { TPaginatedResponse } from "@/types/api.types";
import type {
  IWorkoutPlanDay,
  IWorkoutToday,
  IWorkoutSession,
  IExerciseProgress,
  IImportSummary,
  ICreateSession,
  IUpdateSession,
  IFindSessionsParams,
} from "@/types/fitness/workouts.types";

export const importWorkoutPlan = async (
  csv: string
): Promise<TApiResponse<IImportSummary>> => {
  const { data } = await apiClient.post("/workouts/plan/import", { csv });
  return data;
};

export const fetchWorkoutPlan = async (): Promise<
  TApiResponse<IWorkoutPlanDay[]>
> => {
  const { data } = await apiClient.get("/workouts/plan");
  return data;
};

export const clearWorkoutPlan = async (): Promise<void> => {
  await apiClient.delete("/workouts/plan", { data: { _skipToast: true } });
};

export const fetchWorkoutToday = async (): Promise<TApiResponse<IWorkoutToday>> => {
  const { data } = await apiClient.get("/workouts/today");
  return data;
};

export const fetchExerciseNames = async (): Promise<TApiResponse<string[]>> => {
  const { data } = await apiClient.get("/workouts/exercises");
  return data;
};

export const fetchExerciseProgress = async (
  exercise: string
): Promise<TApiResponse<IExerciseProgress>> => {
  const { data } = await apiClient.get(
    `/workouts/progress?exercise=${encodeURIComponent(exercise)}`
  );
  return data;
};

export const createWorkoutSession = async (
  body: ICreateSession
): Promise<TApiResponse<IWorkoutSession>> => {
  const { data } = await apiClient.post("/workouts/sessions", body);
  return data;
};

export const fetchWorkoutSessions = async (
  params?: IFindSessionsParams
): Promise<TApiResponse<TPaginatedResponse<IWorkoutSession>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/workouts/sessions${query ? `?${query}` : ""}`
  );
  return data;
};

export const fetchWorkoutSession = async (
  id: string
): Promise<TApiResponse<IWorkoutSession>> => {
  const { data } = await apiClient.get(`/workouts/sessions/${id}`);
  return data;
};

export const updateWorkoutSession = async ({
  id,
  body,
}: {
  id: string;
  body: IUpdateSession;
}): Promise<TApiResponse<IWorkoutSession>> => {
  const { data } = await apiClient.patch(`/workouts/sessions/${id}`, body);
  return data;
};

export const deleteWorkoutSession = async (id: string): Promise<void> => {
  await apiClient.delete(`/workouts/sessions/${id}`, {
    data: { _skipToast: true },
  });
};
