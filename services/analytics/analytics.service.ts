// ─────────────────────────────────────────────────────────────────────────────
// Analytics Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls for the analytics feature.
// Each function maps to one backend endpoint under /api/v1/analytics.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  IAnalyticsParams,
  IDashboardSummary,
  ICategoryBreakdownItem,
  IAccountWiseView,
  ITopItem,
  IItemTrendPoint,
  INetWorth,
} from "@/types/analytics/analytics.types";

const buildQuery = (params?: IAnalyticsParams) =>
  params ? qs.stringify(params, { skipNulls: true }) : "";

export const fetchDashboard = async (
  params?: IAnalyticsParams,
): Promise<TApiResponse<IDashboardSummary>> => {
  const query = buildQuery(params);
  const { data } = await apiClient.get(`/analytics/dashboard${query ? `?${query}` : ""}`);
  return data;
};

export const fetchCategoryBreakdown = async (
  params?: IAnalyticsParams,
): Promise<TApiResponse<ICategoryBreakdownItem[]>> => {
  const query = buildQuery(params);
  const { data } = await apiClient.get(`/analytics/categories${query ? `?${query}` : ""}`);
  return data;
};

export const fetchAccountWiseView = async (
  params?: IAnalyticsParams,
): Promise<TApiResponse<IAccountWiseView[]>> => {
  const query = buildQuery(params);
  const { data } = await apiClient.get(`/analytics/accounts${query ? `?${query}` : ""}`);
  return data;
};

export const fetchTopItems = async (
  params?: IAnalyticsParams,
): Promise<TApiResponse<ITopItem[]>> => {
  const query = buildQuery(params);
  const { data } = await apiClient.get(`/analytics/top-items${query ? `?${query}` : ""}`);
  return data;
};

export const fetchItemTrend = async (
  itemName: string,
  params?: IAnalyticsParams,
): Promise<TApiResponse<IItemTrendPoint[]>> => {
  const query = qs.stringify({ itemName, ...params }, { skipNulls: true });
  const { data } = await apiClient.get(`/analytics/item-trend?${query}`);
  return data;
};

export const fetchNetWorth = async (): Promise<TApiResponse<INetWorth>> => {
  const { data } = await apiClient.get("/analytics/net-worth");
  return data;
};
