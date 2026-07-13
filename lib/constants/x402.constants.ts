// ─────────────────────────────────────────────────────────────────────────────
// x402 Constants
// ─────────────────────────────────────────────────────────────────────────────
// Static, non-secret config for the x402 frontend surface.
// ─────────────────────────────────────────────────────────────────────────────

export const X402_CONSTANTS = {
  // Backend routes (relative to NEXT_PUBLIC_API_URL)
  PREVIEW_PATH: "/x402/plans/preview",
  GENERATE_PATH: "/x402/plans/generate",

  // Display
  PRICE_USDC: "0.01",
  NETWORK_LABEL: "Solana devnet",

  // Solana devnet (public, non-secret — same values as backend .env)
  USDC_MINT: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  USDC_DECIMALS: 6,
  RPC_URL: "https://api.devnet.solana.com",
  EXPLORER_TX: (sig: string) =>
    `https://explorer.solana.com/tx/${sig}?cluster=devnet`,

  // Feature flag — Tier B (live browser payment) mounts only when true
  LIVE_PAY_ENABLED: process.env.NEXT_PUBLIC_X402_LIVE_PAY === "true",
} as const;
