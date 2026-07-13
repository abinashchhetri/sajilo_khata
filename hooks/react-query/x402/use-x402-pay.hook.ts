"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useX402Pay
// ─────────────────────────────────────────────────────────────────────────────
// Imperative orchestration of the full x402 browser loop:
//   connect → GET /generate (402) → build+sign USDC transfer + memo →
//   send + confirm → retry /generate with X-PAYMENT → plan.
// Exposes a phase + result so the UI can render a live progress timeline.
// The browser never holds a private key — Phantom signs the tx.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferCheckedInstruction,
} from "@solana/spl-token";

import { requestPlan } from "@/services/x402/x402.service";
import { getPhantom } from "@/lib/x402/phantom";
import { X402_CONSTANTS } from "@/lib/constants/x402.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type {
  TX402PayPhase,
  IX402ChallengeOption,
  IX402PlanResponse,
} from "@/types/x402/x402.types";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export const useX402Pay = () => {
  const [phase, setPhase] = useState<TX402PayPhase>("idle");
  const [signature, setSignature] = useState<string | null>(null);
  const [plan, setPlan] = useState<IX402PlanResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const reset = useCallback(() => {
    setPhase("idle");
    setSignature(null);
    setPlan(null);
    setErrorMsg(null);
  }, []);

  const pay = useCallback(async () => {
    try {
      // ── 0. Phantom present? ──────────────────────────────────────────────
      const phantom = getPhantom();
      if (!phantom) {
        toast.error(TOAST_MESSAGES.X402.NO_PHANTOM);
        return;
      }

      // ── 1. Connect ───────────────────────────────────────────────────────
      setPhase("connecting");
      const { publicKey: payerKeyLike } = await phantom.connect();
      const payer = new PublicKey(payerKeyLike.toString());

      // ── 2. Ask for the plan → expect 402 challenge ───────────────────────
      setPhase("quoting");
      const first = await requestPlan();
      if (first.kind !== "challenge") {
        // Backend didn't gate (or already returned a plan) — handle gracefully
        if (first.kind === "plan") {
          setPlan(first.plan);
          setPhase("done");
          return;
        }
        throw new Error(
          first.kind === "error" ? first.message : "Unexpected response",
        );
      }
      const opt: IX402ChallengeOption = first.challenge.accepts[0];
      const { quoteId, memo } = opt.extra;

      // ── 3. Build the USDC transfer + memo ────────────────────────────────
      setPhase("paying");
      const connection = new Connection(X402_CONSTANTS.RPC_URL, "confirmed");
      const mint = new PublicKey(opt.asset);
      const recipient = new PublicKey(opt.payTo);

      const fromAta = await getAssociatedTokenAddress(mint, payer);
      const toAta = await getAssociatedTokenAddress(mint, recipient);

      const transferIx = createTransferCheckedInstruction(
        fromAta,
        mint,
        toAta,
        payer,
        BigInt(opt.maxAmountRequired),
        opt.extra.decimals,
      );

      const memoIx = new TransactionInstruction({
        keys: [],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memo, "utf-8"),
      });

      const tx = new Transaction().add(transferIx, memoIx);
      tx.feePayer = payer;
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;

      // ── 4. Sign via Phantom + send ───────────────────────────────────────
      const signed = await phantom.signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      setSignature(sig);

      // ── 5. Confirm ───────────────────────────────────────────────────────
      setPhase("confirming");
      await connection.confirmTransaction(sig, "confirmed");
      toast.success(TOAST_MESSAGES.X402.PAY_CONFIRMED);

      // ── 6. Retry with X-PAYMENT → plan ───────────────────────────────────
      setPhase("verifying");
      // brief retry loop: the backend may not see the tx on the first poll
      let planResult = await requestPlan({ quoteId, signature: sig });
      for (let i = 0; i < 4 && planResult.kind !== "plan"; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        planResult = await requestPlan({ quoteId, signature: sig });
      }

      if (planResult.kind !== "plan") {
        throw new Error(
          planResult.kind === "error"
            ? planResult.message
            : "Payment verified but plan not returned yet.",
        );
      }

      setPlan(planResult.plan);
      setPhase("done");
      toast.success(TOAST_MESSAGES.X402.PLAN_READY);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Payment failed";
      setErrorMsg(message);
      setPhase("error");
      toast.error(TOAST_MESSAGES.X402.PAY_FAILED);
    }
  }, []);

  return { phase, signature, plan, errorMsg, pay, reset };
};
