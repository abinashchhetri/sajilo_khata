// Meals Service
// All HTTP calls related to meals.
// Each function maps to one backend endpoint under /api/v1/meals.
// No side effects — no toasts, no routing, no cache logic here.

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type { TPaginatedResponse } from "@/types/api.types";
import type {
  IMealPlanDay,
  IMealToday,
  IMealLog,
  IMealPrepBatch,
  IMealImportSummary,
  ICreateMealLog,
  IUpdateMealLog,
  ICreatePrep,
  IUpdatePrep,
  IConsumePrep,
  IConsumeResult,
  IFindLogsParams,
} from "@/types/nutrition/meals.types";

export const importMealPlan = async (
  csv: string
): Promise<TApiResponse<IMealImportSummary>> => {
  const { data } = await apiClient.post("/meals/plan/import", { csv });
  return data;
};

export const fetchMealPlan = async (): Promise<TApiResponse<IMealPlanDay[]>> => {
  const { data } = await apiClient.get("/meals/plan");
  return data;
};

export const clearMealPlan = async (): Promise<void> => {
  await apiClient.delete("/meals/plan", { data: { _skipToast: true } });
};

export const fetchMealToday = async (): Promise<TApiResponse<IMealToday>> => {
  const { data } = await apiClient.get("/meals/today");
  return data;
};

export const createMealLog = async (
  body: ICreateMealLog
): Promise<TApiResponse<IMealLog>> => {
  const { data } = await apiClient.post("/meals/logs", body);
  return data;
};

export const fetchMealLogs = async (
  params?: IFindLogsParams
): Promise<TApiResponse<TPaginatedResponse<IMealLog>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/meals/logs${query ? `?${query}` : ""}`
  );
  return data;
};

export const updateMealLog = async ({
  id,
  body,
}: {
  id: string;
  body: IUpdateMealLog;
}): Promise<TApiResponse<IMealLog>> => {
  const { data } = await apiClient.patch(`/meals/logs/${id}`, body);
  return data;
};

export const deleteMealLog = async (id: string): Promise<void> => {
  await apiClient.delete(`/meals/logs/${id}`, {
    data: { _skipToast: true },
  });
};

export const createPrep = async (
  body: ICreatePrep
): Promise<TApiResponse<IMealPrepBatch>> => {
  const { data } = await apiClient.post("/meals/prep", body);
  return data;
};

export const fetchPrepBatches = async (): Promise<
  TApiResponse<IMealPrepBatch[]>
> => {
  const { data } = await apiClient.get("/meals/prep");
  return data;
};

export const consumePortion = async ({
  id,
  body,
}: {
  id: string;
  body: IConsumePrep;
}): Promise<TApiResponse<IConsumeResult>> => {
  const { data } = await apiClient.post(`/meals/prep/${id}/consume`, body);
  return data;
};

export const updatePrep = async ({
  id,
  body,
}: {
  id: string;
  body: IUpdatePrep;
}): Promise<TApiResponse<IMealPrepBatch>> => {
  const { data } = await apiClient.patch(`/meals/prep/${id}`, body);
  return data;
};

export const deletePrep = async (id: string): Promise<void> => {
  await apiClient.delete(`/meals/prep/${id}`, {
    data: { _skipToast: true },
  });
};
