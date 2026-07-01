// ─────────────────────────────────────────────────────────────────────────────
// useGetAccount
// ─────────────────────────────────────────────────────────────────────────────
// Fetches a single account by ID for the account detail page.
// Query is disabled when id is empty so Next.js dynamic-route renders don't
// fire before the param is resolved.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAccountById } from "@/services/accounts/accounts.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetAccount = (id: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.ACCOUNTS.SINGLE(id),
    queryFn: () => fetchAccountById(id),
    enabled: !!id,
  });

  return { account: data?.data, isLoading, isError };
};
