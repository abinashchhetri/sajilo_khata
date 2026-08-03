// ─────────────────────────────────────────────────────────────────────────────
// Goals Constants
// ─────────────────────────────────────────────────────────────────────────────
// Static, non-secret config for the Goals & Streaks frontend surface.
// REWARD_UI mirrors the backend's REWARD_DEFINITIONS map (goals.constants.ts
// on the backend) — title copy stays in sync with what the ledger awards.
// Limits mirror the backend's enforced caps so the UI can disable actions
// before a request round-trips just to get rejected.
// ─────────────────────────────────────────────────────────────────────────────

import type { TRewardType } from "@/types/goals/goals.types";

export const REWARD_UI: Record<
  TRewardType,
  { title: string; tint: string }
> = {
  FIRST_DAY: { title: "Nice start!", tint: "text-accent-sky" },
  STREAK_3: { title: "On Fire", tint: "text-accent-orange" },
  STREAK_7: { title: "Week Warrior", tint: "text-accent-purple-deep" },
  STREAK_30: { title: "Monthly Master", tint: "text-accent-teal" },
  PHASE_COMPLETE: { title: "Phase Complete", tint: "text-accent-green" },
  GOAL_COMPLETE: { title: "Goal Achieved!", tint: "text-accent-pink" },
};

export const GOALS_CONSTANTS = {
  // Backend-enforced caps (goals.constants.ts on the backend) — mirrored here
  // so the UI can disable "add" actions before a 409 round-trip.
  MAX_ACTIVE_GOALS: 20,
  MAX_PHASES_PER_GOAL: 10,
  MAX_TASKS_PER_GOAL: 400,
  MIN_TASKS_PER_DAY: 1,
  MAX_TASKS_PER_DAY: 10,

  // React Query staleTime tuning — the checklist is date-keyed so it never
  // serves a stale day, but within a single day it doesn't need to refetch
  // on every focus; roadmap/list data changes rarely by comparison.
  STALE_TIME_TODAY_MS: 1000 * 30, // 30s — the daily engine payload
  STALE_TIME_LIST_MS: 1000 * 60, // 1min — goal list/detail
  STALE_TIME_HISTORY_MS: 1000 * 60 * 5, // 5min — ledger rarely changes mid-session
} as const;
