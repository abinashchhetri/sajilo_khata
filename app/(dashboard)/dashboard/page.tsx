// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────
// Home screen after login. Three responsibilities:
//   1. Voice entry — VoiceRecordButton (fixed bottom-right) → ConfirmationCard
//   2. At-a-glance stats — today's spend + total balance across accounts
//   3. Recent activity — last 5 transactions + quick-links to main sections
//
// VoiceRecordButton returns null when SpeechRecognition is unsupported, so the
// dashboard never crashes or shows a dead button on incompatible browsers.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { format } from "date-fns";
import {
  Wallet,
  ReceiptText,
  BarChart2,
  TrendingDown,
  ArrowRight,
  Music,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import TransactionCard from "@/components/transactions/TransactionCard";
import VoiceRecordButton from "@/components/voice/VoiceRecordButton";
import ConfirmationCard from "@/components/voice/ConfirmationCard";
import NowPlayingWidget from "@/components/music/NowPlayingWidget";
import TrackCard from "@/components/music/TrackCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/context/use-auth.hook";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import { useGetTransactions } from "@/hooks/react-query/transactions/get-transactions.hook";
import { useGetMusicHistory } from "@/hooks/react-query/music/get-music-history.hook";
import { useGetRecentTransactions } from "@/hooks/react-query/analytics/get-recent-transactions.hook";
import { useGetAccountVoiceKeywords } from "@/hooks/react-query/accounts/get-account-voice-keywords.hook";
import { parseVoiceTranscript } from "@/utils/voice-parser.utils";
import { formatCurrency } from "@/utils/format.utils";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import { ROUTES } from "@/lib/constants/routes.constants";
import type { IAccount } from "@/types/accounts/accounts.types";
import type { TParsedVoiceEntry } from "@/types/transactions/transactions.types";

// ─────── Component ───────────────────────────────────────────────────────────

const DashboardPage = () => {
  const { user } = useAuth();
  const [pendingVoice, setPendingVoice] = useState<TParsedVoiceEntry | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  // Accounts — for total balance stat
  const { accounts, isLoading: accountsLoading } = useGetAccounts();
  const activeAccounts = (accounts ?? []).filter((a: IAccount) => !a.isArchived);
  const totalBalance = activeAccounts.reduce(
    (sum: number, a: IAccount) => sum + a.currentBalance,
    0,
  );

  // Voice keyword data for account detection
  const { accountKeywords } = useGetAccountVoiceKeywords();

  // Music — 3 tracks for the music widget
  const { tracks: recentlyPlayed, isLoading: musicLoading } = useGetMusicHistory({ limit: 3 });

  // Today's transactions — for spend stat only
  const { transactions: todayTransactions, isLoading: txLoading } =
    useGetTransactions({ startDate: today, endDate: today });

  // Recent activity — last 5 across all time (proper data source for dashboard)
  const { transactions: recentTransactions, isLoading: recentLoading } =
    useGetRecentTransactions(5);

  const todaysSpend = todayTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.totalAmount, 0);

  // Voice handling
  const handleTranscriptReady = (rawTranscript: string) => {
    if (!rawTranscript.trim()) {
      toast.error(TOAST_MESSAGES.VOICE.NO_SPEECH, { duration: 3000 });
      return;
    }
    const parsed = parseVoiceTranscript(rawTranscript, accountKeywords);
    if (parsed.lineItems.length === 0) {
      toast.error(TOAST_MESSAGES.VOICE.NO_ITEMS, { duration: 4000 });
      return;
    }
    setPendingVoice(parsed);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* ── Header ── */}
      <div>
        <h1 className="text-heading-3 text-foreground">
          Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total balance */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wallet size={13} />
              Total Balance
            </div>
            {accountsLoading ? (
              <Skeleton className="mt-2 h-6 w-28" />
            ) : (
              <p
                className={
                  totalBalance < 0
                    ? "mt-1 text-title tabular-nums text-destructive"
                    : "mt-1 text-title text-foreground tabular-nums"
                }
              >
                {formatCurrency(totalBalance)}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Today's spend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingDown size={13} />
              Today&apos;s Spend
            </div>
            {txLoading ? (
              <Skeleton className="mt-2 h-6 w-24" />
            ) : (
              <p className="mt-1 text-title tabular-nums text-destructive">
                {formatCurrency(todaysSpend)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Voice ConfirmationCard — centered modal overlay ── */}
      {pendingVoice && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          {/* Backdrop — tap to discard */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPendingVoice(null)}
          />
          <div className="relative w-full max-w-sm">
            <ConfirmationCard
              parsed={pendingVoice}
              onClose={() => setPendingVoice(null)}
              defaultAccountId={pendingVoice.detectedAccount?.accountId}
            />
          </div>
        </div>
      )}

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            href: ROUTES.ACCOUNTS,
            Icon: Wallet,
            label: "Accounts",
            sub: "Balances & history",
          },
          {
            href: ROUTES.TRANSACTIONS,
            Icon: ReceiptText,
            label: "Transactions",
            sub: "All records",
          },
          {
            href: ROUTES.ANALYTICS,
            Icon: BarChart2,
            label: "Analytics",
            sub: "Spending insights",
          },
        ].map(({ href, Icon, label, sub }) => (
          <Link key={href} href={href}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
                <ArrowRight size={15} className="text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Now Playing + Recently Played ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-body-sm font-medium text-foreground">Music</p>
          <Link
            href={ROUTES.MUSIC}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Music size={12} />
            Library
          </Link>
        </div>

        <NowPlayingWidget />

        {musicLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : recentlyPlayed.length > 0 ? (
          <div className="space-y-1">
            {recentlyPlayed.map((track) => (
              <TrackCard key={track.id} track={track} compact />
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Recent activity ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-body-sm font-medium text-foreground">
            Recent Activity
          </p>
          <Link
            href={ROUTES.TRANSACTIONS}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all
          </Link>
        </div>

        {recentLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No transactions yet — use the mic button or{" "}
            <Link
              href={ROUTES.TRANSACTIONS}
              className="underline underline-offset-2"
            >
              add one manually
            </Link>
            .
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>
        )}
      </div>

      {/* ── Fixed mic button ── */}
      <VoiceRecordButton onTranscriptReady={handleTranscriptReady} />
    </div>
  );
};

export default DashboardPage;
