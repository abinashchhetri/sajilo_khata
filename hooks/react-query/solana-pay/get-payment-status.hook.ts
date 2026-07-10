"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useGetPaymentStatus
// ─────────────────────────────────────────────────────────────────────────────
// Polls the backend every 3 seconds to check if the Solana Pay payment
// has been confirmed on-chain. Stops polling once confirmed or expired.
// onSuccess with confirmed status triggers cache invalidation so the
// accounts and transactions pages update without a manual refresh.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { fetchPaymentStatus } from "@/services/solana-pay/solana-pay.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useGetPaymentStatus = (
  paymentRequestId: string | null,
  enabled: boolean,
) => {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.SOLANA_PAY.STATUS(paymentRequestId ?? ""),
    queryFn: () => fetchPaymentStatus(paymentRequestId!),
    enabled: !!paymentRequestId && enabled,
    refetchInterval: (query) => {
      // Poll every 3 seconds while pending, stop when confirmed/expired
      const status = query.state.data?.status;
      if (status === "confirmed" || status === "expired") return false;
      return 3000;
    },
    staleTime: 0, // always refetch — payment status is time-sensitive
  });

  // Side effects when status changes
  useEffect(() => {
    if (data?.status === "confirmed") {
      toast.success(TOAST_MESSAGES.SOLANA_PAY.PAYMENT_CONFIRMED);
      // Invalidate finance caches so dashboard + accounts update immediately
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ACCOUNTS.ALL] });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TRANSACTIONS.ALL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ANALYTICS.DASHBOARD],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ANALYTICS.NET_WORTH],
      });
    }
    if (data?.status === "expired") {
      toast.error(TOAST_MESSAGES.SOLANA_PAY.PAYMENT_EXPIRED);
    }
  }, [data?.status]);

  return {
    status: data?.status ?? "pending",
    signature: data?.signature ?? null,
    confirmedAt: data?.confirmedAt ?? null,
    isLoading,
  };
};
