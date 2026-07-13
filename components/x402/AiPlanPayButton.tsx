"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AiPlanPayButton
// ─────────────────────────────────────────────────────────────────────────────
// Tier B entry point: opens a dialog that runs the live x402 payment loop via
// useX402Pay and renders the returned plan. Flag-gated by the parent card.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { Wallet, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useX402Pay } from "@/hooks/react-query/x402/use-x402-pay.hook";
import { X402_CONSTANTS } from "@/lib/constants/x402.constants";
import AiPlanResult from "@/components/x402/AiPlanResult";
import type { TX402PayPhase } from "@/types/x402/x402.types";

const PHASE_LABEL: Record<TX402PayPhase, string> = {
  idle: "Ready",
  connecting: "Connecting Phantom…",
  quoting: "Requesting quote (402)…",
  paying: "Building & signing payment…",
  confirming: "Confirming on devnet…",
  verifying: "Verifying payment…",
  done: "Plan ready",
  error: "Failed",
};

const AiPlanPayButton = () => {
  const [open, setOpen] = useState(false);
  const { phase, signature, plan, errorMsg, pay, reset } = useX402Pay();

  const busy =
    phase !== "idle" && phase !== "done" && phase !== "error";

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset();
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => {
          setOpen(true);
        }}
      >
        <Wallet size={14} />
        Pay 0.01 USDC & generate
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg shadow-level-2">
          <DialogHeader>
            <DialogTitle className="text-title">
              Generate your AI plan
            </DialogTitle>
          </DialogHeader>

          {/* Result */}
          {phase === "done" && plan ? (
            <AiPlanResult plan={plan} signature={signature} />
          ) : (
            <div className="space-y-4 py-2">
              <p className="text-body-sm text-muted-foreground">
                Pay {X402_CONSTANTS.PRICE_USDC} USDC on{" "}
                {X402_CONSTANTS.NETWORK_LABEL} with Phantom to generate a
                personalized 7-day plan from your history.
              </p>

              {/* Phase line */}
              <div className="flex items-center gap-2 rounded-md border px-3 py-2">
                {busy ? (
                  <Loader2 size={14} className="animate-spin text-primary" />
                ) : phase === "done" ? (
                  <CheckCircle2 size={14} className="text-green-600" />
                ) : null}
                <span className="text-body-sm text-foreground">
                  {PHASE_LABEL[phase]}
                </span>
              </div>

              {signature && (
                <a
                  href={X402_CONSTANTS.EXPLORER_TX(signature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline"
                >
                  View transaction
                  <ExternalLink size={12} />
                </a>
              )}

              {phase === "error" && errorMsg && (
                <p className="text-caption text-destructive">{errorMsg}</p>
              )}

              <Button
                className="w-full"
                disabled={busy}
                onClick={() => pay()}
              >
                {busy ? "Working…" : "Connect Phantom & pay"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AiPlanPayButton;
