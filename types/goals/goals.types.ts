// ─────────────────────────────────────────────────────────────────────────────
// Goals Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the backend's goals domain exactly (see GOALS_BACKEND_BUILD_PLAN.md).
// All dates are 'YYYY-MM-DD' plain calendar strings, never timestamps — the
// whole daily-engine contract (materialize/finalize/streak) is date-string
// based, not Date objects. Status unions mirror the backend's string enums.
// ─────────────────────────────────────────────────────────────────────────────

export type TGoalStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type TPhaseStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type TTaskStatus = "BACKLOG" | "SCHEDULED" | "COMPLETED";
export type TRoadmapSource = "MANUAL" | "AI";
export type TRewardType =
  | "FIRST_DAY"
  | "STREAK_3"
  | "STREAK_7"
  | "STREAK_30"
  | "PHASE_COMPLETE"
  | "GOAL_COMPLETE";

// ─────── Core entities ────────────────────────────────────────────────────────

export interface IGoalSummary {
  id: string;
  title: string;
  description: string | null;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string;
  status: TGoalStatus;
  roadmapSource: TRoadmapSource | null;
  tasksPerDay: number;
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  progressPercent: number; // backend-computed — never recompute client-side
  completedAt: string | null;
}

export interface IGoalTask {
  id: string;
  title: string;
  status: TTaskStatus;
  orderIndex: number;
  scheduledDate: string | null;
  carryOverCount: number;
  completedAt: string | null;
}

export interface IGoalPhase {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  status: TPhaseStatus;
  totalTasks: number;
  completedTasks: number;
  tasks: IGoalTask[];
}

export interface IGoalDetail extends IGoalSummary {
  phases: IGoalPhase[];
}

// ─────── The daily engine payload — GET /goals/:id/today ─────────────────────

export interface ITodayTask extends IGoalTask {
  phase: Pick<IGoalPhase, "id" | "title" | "orderIndex">;
}

export interface IReward {
  id: string;
  goalId: string;
  type: TRewardType;
  referenceId: string;
  title: string;
  meta: Record<string, unknown> | null;
  seen: boolean;
  createdAt: string;
}

export interface ITodayGoalSummary {
  id: string;
  title: string;
  status: TGoalStatus;
  progressPercent: number;
  completedTasks: number;
  totalTasks: number;
  currentStreak: number;
  longestStreak: number;
  willExtendStreakTo: number; // UI streak preview only — never persisted as truth
}

export interface ITodayResponse {
  date: string;
  goal: ITodayGoalSummary;
  tasks: ITodayTask[];
  allDone: boolean;
  newRewards: IReward[]; // unseen rewards → confetti queue
}

// ─────── Cross-goal morning dashboard — GET /goals/today ──────────────────────

export interface ITodayAcrossGoals {
  date: string;
  goals: ITodayResponse[]; // one block per ACTIVE goal
}

// ─────── History ledger — GET /goals/:id/history ──────────────────────────────

export interface IGoalDayRecord {
  id: string;
  date: string;
  tasksPlanned: number;
  tasksCompleted: number;
  allCompleted: boolean;
  streakAfter: number;
}

// ─────── Request DTOs — shapes the backend controller expects ─────────────────

export interface ICreateTaskDraft {
  title: string;
}

export interface ICreatePhaseDraft {
  title: string;
  description?: string;
  tasks: ICreateTaskDraft[];
}

// Shape for POST /goals — inline manual roadmap is optional
export interface ICreateGoal {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  tasksPerDay?: number;
  roadmap?: ICreatePhaseDraft[];
}

// Shape for PATCH /goals/:id — status only ever transitions to ARCHIVED here;
// COMPLETED is set by the backend, never chosen by the client.
export interface IUpdateGoal {
  title?: string;
  description?: string;
  endDate?: string;
  tasksPerDay?: number;
  status?: Extract<TGoalStatus, "ACTIVE" | "ARCHIVED">;
}

export interface IFindAllGoalsParams {
  status?: TGoalStatus;
  page?: number;
  limit?: number;
}

// Shape for POST /goals/:id/roadmap/generate
export interface IGenerateRoadmap {
  experienceLevel?: string;
  hoursPerDay?: number;
  force?: boolean; // wipes existing non-completed roadmap in-transaction
}

export interface ICreatePhase {
  title: string;
  description?: string;
}

export interface IUpdatePhase {
  title?: string;
  description?: string;
}

export interface ICreateTask {
  title: string;
}

// Move a BACKLOG task to a different phase by supplying phaseId
export interface IUpdateTask {
  title?: string;
  phaseId?: string;
}

export interface IHistoryRangeParams {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
