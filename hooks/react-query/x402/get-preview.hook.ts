"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useGetX402Preview
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the free x402 preview (price + description + example shape).
// Long staleTime — the preview is effectively static.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";

import { fetchPreview } from "@/services/x402/x402.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";

export const useGetX402Preview = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.X402.PREVIEW,
    queryFn: fetchPreview,
    staleTime: 1000 * 60 * 60, // 1 hour — preview rarely changes
    retry: 1,
  });

  return {
    preview: data ?? null,
    isLoading,
    isError,
  };
};
