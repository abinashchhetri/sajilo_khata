// ─────────────────────────────────────────────────────────────────────────────
// Investments Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to investments.
// Each function maps to one backend endpoint under /api/v1/investments.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  IInvestment,
  ICreateInvestment,
  IUpdateInvestment,
  IUpdateInvestmentValue,
  IInvestmentSummary,
  IFindAllInvestmentsParams,
  IInvestmentTransaction,
  ICreateInvestmentTransaction,
  IFindAllInvestmentTransactionsParams,
} from "@/types/investments/investments.types";
import type { TPaginatedResponse } from "@/types/api.types";

// Fetch all investments, optionally filtered by type
export const fetchInvestments = async (
  params?: IFindAllInvestmentsParams,
): Promise<TApiResponse<IInvestment[]>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/investments${query ? `?${query}` : ""}`,
  );
  return data;
};

// Fetch a single investment by ID
export const fetchInvestmentById = async (
  id: string,
): Promise<TApiResponse<IInvestment>> => {
  const { data } = await apiClient.get(`/investments/${id}`);
  return data;
};

// Create a new investment entry
export const createInvestment = async (
  body: ICreateInvestment,
): Promise<TApiResponse<IInvestment>> => {
  const { data } = await apiClient.post("/investments", body);
  return data;
};

// Update name, investedAmount, note, or metadata — does NOT update currentValue
export const updateInvestment = async ({
  investmentId,
  body,
}: {
  investmentId: string;
  body: IUpdateInvestment;
}): Promise<TApiResponse<IInvestment>> => {
  const { data } = await apiClient.patch(`/investments/${investmentId}`, body);
  return data;
};

// Update currentValue only — dedicated endpoint because it triggers a backend
// history snapshot. Kept separate from updateInvestment intentionally.
export const updateInvestmentValue = async ({
  investmentId,
  body,
}: {
  investmentId: string;
  body: IUpdateInvestmentValue;
}): Promise<TApiResponse<IInvestment>> => {
  const { data } = await apiClient.patch(
    `/investments/${investmentId}/value`,
    body,
  );
  return data;
};

// Delete an investment and all its value history
export const deleteInvestment = async (investmentId: string): Promise<void> => {
  await apiClient.delete(`/investments/${investmentId}`, {
    _skipToast: true,
  });
};

// Portfolio-level summary: totals + per-type breakdown
export const fetchPortfolioSummary = async (): Promise<
  TApiResponse<IInvestmentSummary>
> => {
  const { data } = await apiClient.get("/investments/summary");
  return data;
};

// Fetch a paginated, newest-first transaction ledger for one investment
export const fetchTransactions = async (
  investmentId: string,
  params?: IFindAllInvestmentTransactionsParams,
): Promise<TApiResponse<TPaginatedResponse<IInvestmentTransaction>>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(
    `/investments/${investmentId}/transactions${query ? `?${query}` : ""}`,
  );
  return data;
};

// Record a buy/sell/dividend/bonus event — transactions are append-only
export const createTransaction = async (
  investmentId: string,
  body: ICreateInvestmentTransaction,
): Promise<TApiResponse<IInvestmentTransaction>> => {
  const { data } = await apiClient.post(
    `/investments/${investmentId}/transactions`,
    body,
  );
  return data;
};
