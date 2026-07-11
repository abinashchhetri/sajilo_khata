"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SolanaPayModal
// ─────────────────────────────────────────────────────────────────────────────
// Shows a Solana Pay QR code after a payment request is created.
// Polls every 3 seconds for on-chain confirmation.
// On confirmation: shows success state + transaction explorer link.
// On expiry: shows expired state with option to create a new request.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { ExternalLink, Copy, CheckCircle2, Clock, XCircle, Zap, Send } from "lucide-react";

// Type declaration for Phantom wallet API
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
    };
  }
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPaymentStatus } from "@/hooks/react-query/solana-pay/get-payment-status.hook";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { IPaymentRequestResponse } from "@/types/solana-pay/solana-pay.types";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paymentRequest: IPaymentRequestResponse | null;
  isCreating: boolean;
}

const SolanaPayModal = ({ isOpen, onClose, paymentRequest, isCreating }: Props) => {
  const { status, signature } = useGetPaymentStatus(
    paymentRequest?.id ?? null,
    isOpen && !!paymentRequest,
  );

  const copyUrl = () => {
    if (!paymentRequest?.solanaPayUrl) return;
    navigator.clipboard.writeText(paymentRequest.solanaPayUrl);
    toast.success(TOAST_MESSAGES.SOLANA_PAY.COPY_URL);
  };

  const payWithPhantom = () => {
    if (!paymentRequest?.solanaPayUrl) return;

    // Check if Phantom wallet is installed
    const isPhantomInstalled = window.solana?.isPhantom;

    if (!isPhantomInstalled) {
      toast.error(
        "Phantom wallet not detected. Install Phantom or use the QR code above."
      );
      return;
    }

    try {
      // Try the solana: URI scheme — Phantom wallet will intercept this
      window.location.href = paymentRequest.solanaPayUrl;
    } catch (err) {
      toast.error(
        "Could not launch Phantom. Try scanning the QR code or copying the URL instead."
      );
    }
  };

  const explorerUrl = signature
    ? `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            Receive Payment via Solana
          </DialogTitle>
        </DialogHeader>

        {/* CREATING STATE */}
        {isCreating && (
          <div className="flex flex-col items-center gap-4 py-6">
            <Skeleton className="h-[300px] w-[300px] rounded-lg" />
            <Skeleton className="h-4 w-48" />
          </div>
        )}

        {/* QR CODE STATE — pending */}
        {!isCreating && paymentRequest && status === "pending" && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={paymentRequest.qrCodeDataUrl}
                alt="Solana Pay QR Code"
                className="h-[280px] w-[280px] rounded-lg border"
              />
              {/* Pulsing border while waiting */}
              <div className="absolute inset-0 rounded-lg border-2 border-purple-400 animate-pulse" />
            </div>

            <div className="text-center space-y-1">
              <p className="font-semibold text-lg">
                {paymentRequest.amountUsdc} USDC
              </p>
              <p className="text-sm text-muted-foreground">{paymentRequest.label}</p>
              <div className="inline-flex items-center gap-1 rounded-full border border-yellow-600 px-3 py-1 text-xs text-yellow-600">
                <Clock className="h-3 w-3" />
                Waiting for payment...
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground px-4">
              Scan with Phantom wallet (devnet) · Polling every 3s · Expires at{" "}
              {new Date(paymentRequest.expiresAt).toLocaleTimeString()}
            </p>

            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={payWithPhantom} className="w-full">
                <Send className="h-4 w-4 mr-1.5" />
                Pay with Phantom
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={copyUrl}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy URL
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRMED STATE */}
        {!isCreating && status === "confirmed" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-lg text-green-600">Payment Confirmed!</p>
              <p className="text-sm text-muted-foreground">
                {paymentRequest?.amountUsdc} USDC received · Auto-logged to your account
              </p>
            </div>
            {explorerUrl && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-purple-600 hover:underline"
              >
                View on Solana Explorer
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <Button onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        )}

        {/* EXPIRED STATE */}
        {!isCreating && status === "expired" && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-500" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              This request expired. Create a new one to try again.
            </p>
            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SolanaPayModal;
