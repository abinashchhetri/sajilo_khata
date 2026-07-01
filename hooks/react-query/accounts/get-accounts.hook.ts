// ─────────────────────────────────────────────────────────────────────────────
// useGetAccounts
// ─────────────────────────────────────────────────────────────────────────────
// Fetches all accounts for the current user. Accepts an optional filter so
// the accounts list page can toggle archived visibility without a refetch key
// collision — the filter object is part of the query key.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAccounts } from "@/services/accounts/accounts.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { IFindAllAccountsParams } from "@/types/accounts/accounts.types";

export const useGetAccounts = (params?: IFindAllAccountsParams) => {
  const { data, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS.ALL, params],
    queryFn: () => fetchAccounts(params),
  });

  return {
    accounts: data?.data,
    isLoading,
    isFetching,
    refetch,
    isError,
  };
};
