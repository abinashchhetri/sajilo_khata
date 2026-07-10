"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreatePaymentRequest
// ─────────────────────────────────────────────────────────────────────────────
// Creates a Solana Pay payment request and returns the QR code data.
// No cache invalidation on create — the QR is managed locally in modal state.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createPaymentRequest } from "@/services/solana-pay/solana-pay.service";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCreatePaymentRequest = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPaymentRequest,
    onSuccess: () => {
      toast.success(TOAST_MESSAGES.SOLANA_PAY.QR_CREATED);
    },
  });

  return { handleCreatePaymentRequest: mutateAsync, isPending };
};
