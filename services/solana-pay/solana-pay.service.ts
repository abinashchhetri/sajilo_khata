// ─────────────────────────────────────────────────────────────────────────────
// Solana Pay Service
// ─────────────────────────────────────────────────────────────────────────────
// HTTP calls for Solana Pay payment requests.
// No toasts, no routing, no cache logic — hooks handle those.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/services";
import type {
  ICreatePaymentRequest,
  IPaymentRequestResponse,
  IPaymentStatusResponse,
} from "@/types/solana-pay/solana-pay.types";

export const createPaymentRequest = async (
  body: ICreatePaymentRequest,
): Promise<IPaymentRequestResponse> => {
  const { data } = await apiClient.post("/solana-pay/request", body);
  return data.data;
};

export const fetchPaymentStatus = async (
  id: string,
): Promise<IPaymentStatusResponse> => {
  const { data } = await apiClient.get(`/solana-pay/request/${id}/status`);
  return data.data;
};

export const fetchPaymentRequest = async (
  id: string,
): Promise<IPaymentRequestResponse> => {
  const { data } = await apiClient.get(`/solana-pay/request/${id}`);
  return data.data;
};
