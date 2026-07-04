"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useGetOnboardingStatus
// ─────────────────────────────────────────────────────────────────────────────
// Checks whether the current user has created at least one account.
// Called immediately after login to decide whether to show Setup or Dashboard.
// retry: false so a 401 resolves fast — interceptor handles redirect.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { fetchOnboardingStatus } from "@/services/auth/auth.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetOnboardingStatus = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.AUTH.ONBOARDING_STATUS],
    queryFn: fetchOnboardingStatus,
    retry: false,
  });

  return {
    isOnboardingComplete: data?.isOnboardingComplete ?? false,
    hasAccount: data?.hasAccount ?? false,
    accountCount: data?.accountCount ?? 0,
    isLoading,
  };
};
