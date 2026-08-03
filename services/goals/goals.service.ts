// ─────────────────────────────────────────────────────────────────────────────
// Goals Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls for the Goals & Streaks domain.
// Each function maps to one backend endpoint under /api/v1/goals exactly (see
// GOALS_BACKEND_BUILD_PLAN.md §5 — the 20-endpoint contract). No side effects —
// no toasts, no routing, no cache logic here; hooks own those.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse, TPaginatedResponse } from "@/types/api.types";
import type {
  IGoalDetail,
  IGoalSummary,
  IGoalPhase,
  IGoalTask,
  IGoalDayRecord,
  IReward,
  ITodayResponse,
  ITodayAcrossGoals,
  ICreateGoal,
  IUpdateGoal,
  IFindAllGoalsParams,
  IGenerateRoadmap,
  ICreatePhase,
  IUpdatePhase,
  ICreateTask,
  IUpdateTask,
  IHistoryRangeParams,
} from "@/types/goals/goals.types";

// ─────── Goal CRUD ────────────────────────────────────────────────────────────

// POST /goals — create a goal, optionally with an inline manual roadmap
export const createGoal = async (
  body: ICreateGoal,
): Promise<TApiResponse<IGoalDetail>> => {
  const { data } = await apiClient.post("/goals", body);
  return data;
};

// GET /goals — paginated list, filterable by status
export const fetchGoals = async (
  params?: IFindAllGoalsParams,
): Promise<TApiResponse<TPaginatedResponse<IGoalSummary>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(`/goals${query ? `?${query}` : ""}`);
  return data;
};

// GET /goals/:id — goal detail with phases and their tasks
export const fetchGoalById = async (
  id: string,
): Promise<TApiResponse<IGoalDetail>> => {
  const { data } = await apiClient.get(`/goals/${id}`);
  return data;
};

// PATCH /goals/:id — edit title/description/endDate/tasksPerDay, or archive
export const updateGoal = async ({
  id,
  body,
}: {
  id: string;
  body: IUpdateGoal;
}): Promise<TApiResponse<IGoalSummary>> => {
  const { data } = await apiClient.patch(`/goals/${id}`, body);
  return data;
};

// DELETE /goals/:id — cascades phases/tasks/history/rewards on the backend
export const deleteGoal = async (id: string): Promise<void> => {
  await apiClient.delete(`/goals/${id}`);
};

// ─────── Roadmap — generation + phase/task management ────────────────────────

// POST /goals/:id/roadmap/generate — AI roadmap (409 if progress exists and !force)
export const generateRoadmap = async ({
  id,
  body,
}: {
  id: string;
  body?: IGenerateRoadmap;
}): Promise<TApiResponse<IGoalDetail>> => {
  const { data } = await apiClient.post(`/goals/${id}/roadmap/generate`, body ?? {});
  return data;
};

// POST /goals/:id/phases — append a phase (orderIndex auto = max+1)
export const createPhase = async ({
  goalId,
  body,
}: {
  goalId: string;
  body: ICreatePhase;
}): Promise<TApiResponse<IGoalPhase>> => {
  const { data } = await apiClient.post(`/goals/${goalId}/phases`, body);
  return data;
};

// PATCH /goals/:id/phases/:phaseId — edit phase title/description
export const updatePhase = async ({
  goalId,
  phaseId,
  body,
}: {
  goalId: string;
  phaseId: string;
  body: IUpdatePhase;
}): Promise<TApiResponse<IGoalPhase>> => {
  const { data } = await apiClient.patch(
    `/goals/${goalId}/phases/${phaseId}`,
    body,
  );
  return data;
};

// DELETE /goals/:id/phases/:phaseId — 409 if the phase has COMPLETED tasks
export const deletePhase = async ({
  goalId,
  phaseId,
}: {
  goalId: string;
  phaseId: string;
}): Promise<void> => {
  await apiClient.delete(`/goals/${goalId}/phases/${phaseId}`);
};

// PATCH /goals/:id/phases/reorder — ordered array of phase ids
export const reorderPhases = async ({
  goalId,
  phaseIds,
}: {
  goalId: string;
  phaseIds: string[];
}): Promise<TApiResponse<IGoalPhase[]>> => {
  const { data } = await apiClient.patch(`/goals/${goalId}/phases/reorder`, {
    ids: phaseIds,
  });
  return data;
};

// POST /goals/:id/phases/:phaseId/tasks — append task, bumps counters
export const createTask = async ({
  goalId,
  phaseId,
  body,
}: {
  goalId: string;
  phaseId: string;
  body: ICreateTask;
}): Promise<TApiResponse<IGoalTask>> => {
  const { data } = await apiClient.post(
    `/goals/${goalId}/phases/${phaseId}/tasks`,
    body,
  );
  return data;
};

// PATCH /goals/:id/tasks/:taskId — edit title, or move a BACKLOG task via phaseId
export const updateTask = async ({
  goalId,
  taskId,
  body,
}: {
  goalId: string;
  taskId: string;
  body: IUpdateTask;
}): Promise<TApiResponse<IGoalTask>> => {
  const { data } = await apiClient.patch(
    `/goals/${goalId}/tasks/${taskId}`,
    body,
  );
  return data;
};

// DELETE /goals/:id/tasks/:taskId — 409 on COMPLETED (history is immutable)
export const deleteTask = async ({
  goalId,
  taskId,
}: {
  goalId: string;
  taskId: string;
}): Promise<void> => {
  await apiClient.delete(`/goals/${goalId}/tasks/${taskId}`);
};

// ─────── The daily engine ──────────────────────────────────────────────────────

// GET /goals/today?date= — today's checklist across every ACTIVE goal.
// This GET is what triggers the backend's lazy finalize+materialize rollover
// (§3.2 backend plan) — mounting this query is how "today" gets built.
export const fetchTodayAcrossGoals = async (
  date: string,
): Promise<TApiResponse<ITodayAcrossGoals>> => {
  const { data } = await apiClient.get(`/goals/today?date=${date}`);
  return data;
};

// GET /goals/:id/today?date= — the same engine, scoped to one goal
export const fetchGoalToday = async ({
  goalId,
  date,
}: {
  goalId: string;
  date: string;
}): Promise<TApiResponse<ITodayResponse>> => {
  const { data } = await apiClient.get(`/goals/${goalId}/today?date=${date}`);
  return data;
};

// POST /goals/:id/tasks/:taskId/complete?date= — tick (409 if day finalized)
export const completeTask = async ({
  goalId,
  taskId,
  date,
}: {
  goalId: string;
  taskId: string;
  date: string;
}): Promise<TApiResponse<ITodayResponse>> => {
  const { data } = await apiClient.post(
    `/goals/${goalId}/tasks/${taskId}/complete?date=${date}`,
  );
  return data;
};

// POST /goals/:id/tasks/:taskId/uncomplete?date= — untick, today only
export const uncompleteTask = async ({
  goalId,
  taskId,
  date,
}: {
  goalId: string;
  taskId: string;
  date: string;
}): Promise<TApiResponse<ITodayResponse>> => {
  const { data } = await apiClient.post(
    `/goals/${goalId}/tasks/${taskId}/uncomplete?date=${date}`,
  );
  return data;
};

// ─────── History + rewards ─────────────────────────────────────────────────────

// GET /goals/:id/history?from=&to= — day-record ledger (heatmap), paginated
export const fetchGoalHistory = async ({
  goalId,
  params,
}: {
  goalId: string;
  params?: IHistoryRangeParams;
}): Promise<TApiResponse<TPaginatedResponse<IGoalDayRecord>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/goals/${goalId}/history${query ? `?${query}` : ""}`,
  );
  return data;
};

// GET /goals/:id/rewards — every reward earned for this goal
export const fetchGoalRewards = async (
  goalId: string,
): Promise<TApiResponse<IReward[]>> => {
  const { data } = await apiClient.get(`/goals/${goalId}/rewards`);
  return data;
};

// POST /goals/rewards/:rewardId/seen — mark a reward seen after celebrating it
export const markRewardSeen = async (rewardId: string): Promise<void> => {
  await apiClient.post(`/goals/rewards/${rewardId}/seen`);
};
