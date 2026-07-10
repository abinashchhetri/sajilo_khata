// ─────────────────────────────────────────────────────────────────────────────
// Solana Pay Types
// ─────────────────────────────────────────────────────────────────────────────
// Type definitions for Solana Pay payment requests and responses.
// ─────────────────────────────────────────────────────────────────────────────

export type TPaymentStatus = "pending" | "confirmed" | "expired" | "failed";

export interface ICreatePaymentRequest {
  amountUsdc: number;
  label: string;
  message?: string;
  accountId?: string;
}

export interface IPaymentRequestResponse {
  id: string;
  status: TPaymentStatus;
  amountUsdc: number;
  label: string;
  expiresAt: string;
  solanaPayUrl: string;
  qrCodeDataUrl: string; // base64 PNG — use directly as <img src={...} />
  referencePublicKey: string;
}

export interface IPaymentStatusResponse {
  status: TPaymentStatus;
  signature: string | null;
  confirmedAt: string | null;
}
