// ─────────────────────────────────────────────────────────────────────────────
// Auth Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to authentication.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type { IUser } from "@/types/auth/auth.types";

// Fetches the currently authenticated user — called on every app load to
// establish session state. Returns 401 if the httpOnly cookie is absent/expired.
export const fetchCurrentUser = async (): Promise<TApiResponse<IUser>> => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

// Calls the backend logout endpoint, which clears the httpOnly cookies.
// Navigation to /login happens in the auth context after this resolves.
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
