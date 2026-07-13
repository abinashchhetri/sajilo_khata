// ─────────────────────────────────────────────────────────────────────────────
// Phantom provider helper
// ─────────────────────────────────────────────────────────────────────────────
// Minimal typing + detection for the Phantom browser extension (devnet).
// No dependency on a wallet-adapter — keeps the bundle small and additive.
// ─────────────────────────────────────────────────────────────────────────────

import type { Transaction, VersionedTransaction } from "@solana/web3.js";

export interface IPhantomProvider {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T,
  ): Promise<T>;
}

export const getPhantom = (): IPhantomProvider | null => {
  if (typeof window === "undefined") return null;
  const anyWin = window as unknown as {
    phantom?: { solana?: IPhantomProvider };
    solana?: IPhantomProvider;
  };
  const provider = anyWin.phantom?.solana ?? anyWin.solana;
  return provider?.isPhantom ? provider : null;
};
