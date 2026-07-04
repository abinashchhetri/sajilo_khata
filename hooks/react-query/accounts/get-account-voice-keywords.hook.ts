"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useGetAccountVoiceKeywords
// ─────────────────────────────────────────────────────────────────────────────
// Fetches each account with its full list of voice-recognisable terms.
// Used by the voice parser to match spoken account names to account IDs.
// staleTime is long — account names rarely change mid-session.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { fetchAccountVoiceKeywords } from "@/services/accounts/accounts.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetAccountVoiceKeywords = () => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ACCOUNTS.VOICE_KEYWORDS],
    queryFn: fetchAccountVoiceKeywords,
    staleTime: 10 * 60 * 1000,
  });

  return { accountKeywords: data ?? [], isLoading };
};
