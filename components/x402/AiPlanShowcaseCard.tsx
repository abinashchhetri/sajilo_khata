"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AiPlanShowcaseCard
// ─────────────────────────────────────────────────────────────────────────────
// "For AI Agents" card: presents the paid x402 endpoint as a product.
// Reads the free /preview endpoint. No wallet, no payment — pure display.
// When NEXT_PUBLIC_X402_LIVE_PAY=true, also renders the Tier B pay button.
// ─────────────────────────────────────────────────────────────────────────────

import { Copy, ExternalLink, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetX402Preview } from "@/hooks/react-query/x402/get-preview.hook";
import { X402_CONSTANTS } from "@/lib/constants/x402.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

// Tier B (optional) — only imported/rendered behind the flag
import AiPlanPayButton from "@/components/x402/AiPlanPayButton";

const AiPlanShowcaseCard = () => {
  const { preview, isLoading, isError } = useGetX402Preview();

  const endpoint = `${process.env.NEXT_PUBLIC_API_URL ?? ""}${
    X402_CONSTANTS.GENERATE_PATH
  }`;

  const curl = `curl -i ${endpoint}`;

  const copy = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  return (
    <Card className="rounded-lg border p-5 space-y-4">
      {/* Eyebrow + title */}
      <div className="space-y-1">
        <span className="text-eyebrow text-muted-foreground inline-flex items-center gap-1.5">
          <Sparkles size={12} />
          For AI Agents
        </span>
        <h3 className="text-title text-foreground">
          AI-Generated Fitness Plan
        </h3>
        <p className="text-body-sm text-muted-foreground">
          {preview?.description ??
            "A personalized 7-day workout + meal plan generated from your 90-day history, payable by any agent over the x402 protocol."}
        </p>
      </div>

      {/* Price + network */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-eyebrow text-muted-foreground">Price</p>
          {isLoading ? (
            <Skeleton className="h-5 w-16" />
          ) : (
            <p className="text-title text-foreground">
              {preview?.priceUsdc ?? X402_CONSTANTS.PRICE_USDC} USDC
            </p>
          )}
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground">Network</p>
          <p className="text-body-sm text-foreground">
            {preview?.network ?? X402_CONSTANTS.NETWORK_LABEL}
          </p>
        </div>
      </div>

      {/* Copyable curl */}
      <div className="space-y-1.5">
        <p className="text-eyebrow text-muted-foreground">Try it (curl)</p>
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
          <code className="text-caption text-foreground truncate">
            {curl}
          </code>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => copy(curl, TOAST_MESSAGES.X402.COPY_CURL)}
          >
            <Copy size={13} />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copy(endpoint, TOAST_MESSAGES.X402.COPY_ENDPOINT)}
        >
          <Copy size={13} />
          Copy endpoint
        </Button>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? ""}${
            X402_CONSTANTS.PREVIEW_PATH
          }`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            View preview JSON
            <ExternalLink size={13} />
          </Button>
        </a>

        {/* Tier B — live in-browser payment, flag-gated */}
        {X402_CONSTANTS.LIVE_PAY_ENABLED && <AiPlanPayButton />}
      </div>

      {isError && (
        <p className="text-caption text-destructive">
          Preview unavailable right now — the endpoint is still live for agents.
        </p>
      )}
    </Card>
  );
};

export default AiPlanShowcaseCard;
