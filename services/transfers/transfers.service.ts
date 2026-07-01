// ─────────────────────────────────────────────────────────────────────────────
// Transfers Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to transfers.
// Each function maps to one backend endpoint under /api/v1/transfers.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import qs from "qs";

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  ITransfer,
  ICreateTransfer,
  IFindAllTransfersParams,
} from "@/types/transfers/transfers.types";

// Fetch all transfers for the current user, with optional date/account filter
export const fetchTransfers = async (
  params?: IFindAllTransfersParams,
): Promise<TApiResponse<ITransfer[]>> => {
  const query = qs.stringify(params ?? {}, { skipNulls: true });
  const { data } = await apiClient.get(`/transfers${query ? `?${query}` : ""}`);
  return data;
};

// Create a transfer — debits fromAccount and credits toAccount atomically
export const createTransfer = async (
  body: ICreateTransfer,
): Promise<TApiResponse<ITransfer>> => {
  const { data } = await apiClient.post("/transfers", body);
  return data;
};

// Delete a transfer — backend reverses both account balance effects.
// _skipToast suppresses the interceptor's generic error toast so the hook's
// onError is the sole toast source.
export const deleteTransfer = async (transferId: string): Promise<void> => {
  await apiClient.delete(`/transfers/${transferId}`, { _skipToast: true });
};
