// ─────────────────────────────────────────────────────────────────────────────
// API Client
// ─────────────────────────────────────────────────────────────────────────────
// Single Axios instance shared across all service files.
// Auth strategy (two layers for cross-browser compatibility):
//   1. httpOnly cookies (withCredentials: true) — Chrome/Firefox work fine
//      with cross-origin cookies using SameSite=none;Secure.
//   2. Authorization: Bearer header from localStorage — Safari ITP blocks
//      3rd-party cookies from cross-origin XHR/fetch, so the /callback page
//      stores the JWT in localStorage after OAuth and this interceptor
//      attaches it as a header on every request.
// The backend JWT strategy accepts either form, so both paths work in parallel.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import toast from "react-hot-toast";

import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { ROUTES } from "@/lib/constants/routes.constants";
import { ACCESS_TOKEN_KEY } from "@/lib/constants/auth-storage.constants";

// Per-request opt-out of the generic error toast.
// Set _skipToast: true on any Axios config when the calling hook's onError
// already shows a domain-specific message and the generic one would be redundant.
declare module "axios" {
  interface AxiosRequestConfig {
    _skipToast?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Attach localStorage token as Authorization header for Safari ITP compatibility.
// Chrome/Firefox receive the httpOnly cookie automatically via withCredentials;
// Safari strips cross-origin cookies so this header is the only auth path there.
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Global error handler — covers all non-GET failures and session expiry.
// Using window.location.href (full navigation) rather than Next.js router
// because this interceptor lives outside the React tree and has no router ref.
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const isGet = error.config?.method?.toLowerCase() === "get";

    if (status === 401 && !isGet) {
      // Only redirect on mutation 401s (expired session mid-action).
      // GET 401s are expected when the user isn't logged in — AuthProvider
      // derives isAuthenticated from the failed query and route guards redirect.
      // Redirecting on a GET 401 creates a loop: /login mounts AuthProvider
      // → GET /auth/me → 401 → window.location.href reload → repeat.
      toast.error(TOAST_MESSAGES.AUTH.SESSION_EXPIRED);
      window.location.href = ROUTES.LOGIN;
    } else if (status !== 401 && !isGet && !error.config?._skipToast) {
      toast.error(message || TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
    }

    return Promise.reject(error?.response?.data);
  },
);

export default apiClient;
