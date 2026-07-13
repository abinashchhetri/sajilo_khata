// ─────────────────────────────────────────────────────────────────────────────
// x402 Service
// ─────────────────────────────────────────────────────────────────────────────
// HTTP calls for the x402 AI-plan feature.
//   - fetchPreview():   free discovery endpoint (normal apiClient)
//   - requestPlan():    402-aware paid call — treats 402 as DATA, not error.
// No toasts, no routing, no cache logic — hooks/components handle those.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

import apiClient from "@/services";
import { X402_CONSTANTS } from "@/lib/constants/x402.constants";
import type {
  IX402Preview,
  IX402Challenge,
  IX402PlanResponse,
  IX402PaymentHeader,
} from "@/types/x402/x402.types";

/** Free preview — safe, cacheable, no payment. */
export const fetchPreview = async (): Promise<IX402Preview> => {
  const { data } = await apiClient.get(X402_CONSTANTS.PREVIEW_PATH);
  // Backend wraps in the global envelope { success, message, data }
  return data.data ?? data;
};

/**
 * Paid generate call. Returns a discriminated result so the caller can branch
 * on 402 (challenge) vs 200 (plan) WITHOUT the global error interceptor firing.
 *
 * We use a bare axios call (not apiClient) with validateStatus:() => true so a
 * 402 is returned as a normal response object instead of throwing.
 */
export type TRequestPlanResult =
  | { kind: "challenge"; challenge: IX402Challenge }
  | { kind: "plan"; plan: IX402PlanResponse }
  | { kind: "error"; status: number; message: string };

export const requestPlan = async (
  paymentHeader?: IX402PaymentHeader,
): Promise<TRequestPlanResult> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${X402_CONSTANTS.GENERATE_PATH}`;

  const headers: Record<string, string> = {};
  if (paymentHeader) {
    // base64url(JSON{quoteId, signature}) — blueprint §4.3
    const json = JSON.stringify(paymentHeader);
    headers["X-PAYMENT"] =
      typeof window === "undefined"
        ? Buffer.from(json).toString("base64")
        : btoa(json);
  }

  const res = await axios.get(url, {
    headers,
    withCredentials: true,
    validateStatus: () => true, // never throw — we branch on status
  });

  if (res.status === 402) {
    return { kind: "challenge", challenge: res.data as IX402Challenge };
  }
  if (res.status === 200) {
    const plan = (res.data?.data ?? res.data) as IX402PlanResponse;
    return { kind: "plan", plan };
  }
  return {
    kind: "error",
    status: res.status,
    message: res.data?.message ?? `Unexpected status ${res.status}`,
  };
};
