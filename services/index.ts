// ─────────────────────────────────────────────────────────────────────────────
// API Client
// ─────────────────────────────────────────────────────────────────────────────
// Single Axios instance shared across all service files.
// Auth uses httpOnly cookies set by the backend after Google OAuth — no token
// is manually attached here. withCredentials sends those cookies automatically.
// Response interceptor shows a toast for all non-GET errors automatically
// so individual hooks do not need to handle generic error messages.
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import toast from "react-hot-toast";

import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { ROUTES } from "@/lib/constants/routes.constants";

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
