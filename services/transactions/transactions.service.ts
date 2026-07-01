// ─────────────────────────────────────────────────────────────────────────────
// Transactions Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to transactions.
// Each function maps to one backend endpoint under /api/v1/transactions.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  ITransaction,
  ICreateTransaction,
  IUpdateTransaction,
  IFindAllTransactionsParams,
} from "@/types/transactions/transactions.types";

// Fetch a paginated, filterable list of the current user's transactions
export const fetchTransactions = async (
  params: IFindAllTransactionsParams,
): Promise<TApiResponse<ITransaction[]>> => {
  const query = qs.stringify(params, { skipNulls: true });
  const { data } = await apiClient.get(`/transactions${query ? `?${query}` : ""}`);
  return data;
};

// Fetch a single transaction with its line items and joined category
export const fetchTransactionById = async (
  id: string,
): Promise<TApiResponse<ITransaction>> => {
  const { data } = await apiClient.get(`/transactions/${id}`);
  return data;
};

// Create a transaction — used by manual form and (later) voice ConfirmationCard
export const createTransaction = async (
  body: ICreateTransaction,
): Promise<TApiResponse<ITransaction>> => {
  const { data } = await apiClient.post("/transactions", body);
  return data;
};

// Update a transaction — only note and categoryId are editable after creation
export const updateTransaction = async ({
  transactionId,
  body,
}: {
  transactionId: string;
  body: IUpdateTransaction;
}): Promise<TApiResponse<ITransaction>> => {
  const { data } = await apiClient.patch(`/transactions/${transactionId}`, body);
  return data;
};

// Delete a transaction — backend reverses the account balance effect.
// _skipToast suppresses the interceptor's generic error toast so the hook's
// onError is the sole toast source.
export const deleteTransaction = async (transactionId: string): Promise<void> => {
  await apiClient.delete(`/transactions/${transactionId}`, { _skipToast: true });
};
