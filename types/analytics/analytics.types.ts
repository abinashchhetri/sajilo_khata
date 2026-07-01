// ─────────────────────────────────────────────────────────────────────────────
// Analytics Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the backend's analytics aggregation response shapes exactly.
// Every interface here corresponds to one analytics endpoint's data payload.
// ─────────────────────────────────────────────────────────────────────────────

import type { IDateRangeFilter } from "@/types/global.types";

// ── Shared ────────────────────────────────────────────────────────────────────

export type IAnalyticsParams = IDateRangeFilter;

// ── GET /analytics/dashboard ──────────────────────────────────────────────────

export interface IDashboardSummary {
  totalSpent: number;
  totalIncome: number;
  netSavings: number;
  savingsRate: number; // percentage 0–100
}

// ── GET /analytics/categories ─────────────────────────────────────────────────

export interface ICategoryBreakdownItem {
  categoryId: string | null;
  categoryName: string;
  total: number;
  percentage: number; // share of totalSpent for the period
}

// ── GET /analytics/accounts ───────────────────────────────────────────────────

export interface IAccountWiseView {
  accountId: string;
  accountName: string;
  accountType?: string;
  currentBalance: number;
  totalSpent: number;
  totalIncome: number;
  transactionCount: number;
}

// ── GET /analytics/top-items ──────────────────────────────────────────────────

export interface ITopItem {
  itemName: string;
  total: number;
  count: number;
}

// ── GET /analytics/item-trend?itemName=... ────────────────────────────────────

export interface IItemTrendPoint {
  month: string; // "2025-01"
  total: number;
}

// ── GET /analytics/net-worth ──────────────────────────────────────────────────

export interface INetWorth {
  totalAccountBalance: number;
  totalInvestmentValue: number;
  netWorth: number;
}
