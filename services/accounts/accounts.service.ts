// ─────────────────────────────────────────────────────────────────────────────
// Accounts Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to accounts.
// Each function maps to one backend endpoint under /api/v1/accounts.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  IAccount,
  IAccountVoiceKeyword,
  ICreateAccount,
  IFindAllAccountsParams,
  IUpdateAccount,
} from "@/types/accounts/accounts.types";

// Fetch all accounts for the current user, with optional archived filter
export const fetchAccounts = async (
  params?: IFindAllAccountsParams,
): Promise<TApiResponse<IAccount[]>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(`/accounts${query ? `?${query}` : ""}`);
  return data;
};

// Fetch a single account by ID
export const fetchAccountById = async (
  id: string,
): Promise<TApiResponse<IAccount>> => {
  const { data } = await apiClient.get(`/accounts/${id}`);
  return data;
};

// Create a new account — type is permanent and cannot be changed later
export const createAccount = async (
  body: ICreateAccount,
): Promise<TApiResponse<IAccount>> => {
  const { data } = await apiClient.post("/accounts", body);
  return data;
};

// Update account name, default status, or archived status
export const updateAccount = async ({
  accountId,
  body,
}: {
  accountId: string;
  body: IUpdateAccount;
}): Promise<TApiResponse<IAccount>> => {
  const { data } = await apiClient.patch(`/accounts/${accountId}`, body);
  return data;
};

// Delete an account — backend blocks this if the account has existing transactions.
// _skipToast: true suppresses the interceptor's generic toast because the delete
// hook's onError shows a specific DELETE_BLOCKED message for that case.
export const deleteAccount = async (accountId: string): Promise<void> => {
  await apiClient.delete(`/accounts/${accountId}`, { _skipToast: true });
};

export const fetchAccountVoiceKeywords = async (): Promise<IAccountVoiceKeyword[]> => {
  const { data } = await apiClient.get("/accounts/voice-keywords");
  return data.data;
};
