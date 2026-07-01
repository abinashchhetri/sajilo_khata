// ─────────────────────────────────────────────────────────────────────────────
// useGetCurrentUser
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the logged-in user's profile. Used by AuthProvider to determine
// whether to render the app shell or redirect to /login.
// retry:false so a 401 resolves immediately — the interceptor intentionally
// skips GET 401s to avoid a reload loop; isAuthenticated=false propagates
// through AuthContext and route guards handle the redirect instead.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCurrentUser } from "@/services/auth/auth.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IUser } from "@/types/auth/auth.types";

export const useGetCurrentUser = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.AUTH.CURRENT_USER],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  // Unwrap the backend envelope so callers get IUser directly, not TApiResponse<IUser>
  const user: IUser | undefined = data?.data;

  return { user, isLoading, isError };
};
