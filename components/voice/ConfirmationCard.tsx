// ─────────────────────────────────────────────────────────────────────────────
// ConfirmationCard
// ─────────────────────────────────────────────────────────────────────────────
// Mandatory review step between voice recording and saving.
// A voice entry must NEVER save silently — the user always lands here first.
//
// Pre-fills:
//   - accountId: account whose type matches detectedAccountType, falling back
//     to the user's default account
//   - type: always "expense" (voice entries are almost always spending)
//
// Uses the identical useHandleCreateTransaction mutation as the manual form,
// so voice and form entries produce the same data shape in the backend.
// The only differences are entryMethod:"voice" and the populated voiceTranscript.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/format.utils";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import { useHandleCreateTransaction } from "@/hooks/react-query/transactions/post-transaction.hook";
import type { IAccount } from "@/types/accounts/accounts.types";
import type {
  TParsedVoiceEntry,
  TTransactionType,
} from "@/types/transactions/transactions.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  parsed: TParsedVoiceEntry;
  onClose: () => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ConfirmationCard = ({ parsed, onClose }: Props) => {
  const { accounts } = useGetAccounts();
  const { handleCreateTransaction, isPending } = useHandleCreateTransaction();

  const activeAccounts = useMemo(
    () => (accounts ?? []).filter((a: IAccount) => !a.isArchived),
    [accounts],
  );

  // Pick the account that matches the detected account type, then default account
  const guessedAccount = useMemo(() => {
    if (parsed.detectedAccountType) {
      const match = activeAccounts.find(
        (a: IAccount) => a.type === parsed.detectedAccountType,
      );
      if (match) return match;
    }
    return activeAccounts.find((a: IAccount) => a.isDefault) ?? activeAccounts[0];
  }, [activeAccounts, parsed.detectedAccountType]);

  const [accountId, setAccountId] = useState(guessedAccount?.id ?? "");
  const [type, setType] = useState<TTransactionType>("expense");

  // Backfill when guessedAccount resolves from loading (accounts fetched async)
  useEffect(() => {
    if (guessedAccount?.id && !accountId) {
      setAccountId(guessedAccount.id);
    }
  }, [guessedAccount, accountId]);

  const total = parsed.lineItems.reduce((sum, item) => sum + item.amount, 0);
  const canSave = !!accountId && parsed.lineItems.length > 0;

  const handleSave = async () => {
    await handleCreateTransaction({
      accountId,
      type,
      lineItems: parsed.lineItems,
      entryMethod: "voice",
      voiceTranscript: parsed.rawTranscript,
    });
    onClose();
  };

  return (
    <Card className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-3 top-3 h-7 w-7 text-muted-foreground hover:text-foreground"
        onClick={onClose}
        disabled={isPending}
      >
        <X size={14} />
      </Button>

      <CardHeader className="pb-3 pr-10">
        <CardTitle className="text-base">Confirm Voice Entry</CardTitle>
        <p className="line-clamp-2 text-xs italic text-muted-foreground">
          &ldquo;{parsed.rawTranscript}&rdquo;
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Parsed line items */}
        {parsed.lineItems.length > 0 ? (
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            {parsed.lineItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="capitalize">{item.name}</span>
                <span className="tabular-nums font-medium">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2 text-sm font-semibold">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>
        ) : (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            No items were detected. Try again — say each item name followed
            by its amount, e.g. &ldquo;dal 100 milk 30&rdquo;.
          </p>
        )}

        {/* Account */}
        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-sm text-muted-foreground">
            Account
          </span>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {activeAccounts.map((a: IAccount) => (
                <SelectItem key={a.id} value={a.id}>
                  <span>{a.name}</span>
                  {parsed.detectedAccountType === a.type && (
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      (detected)
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3">
          <span className="w-16 shrink-0 text-sm text-muted-foreground">
            Type
          </span>
          <Select
            value={type}
            onValueChange={(v) => setType(v as TTransactionType)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Discard
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={handleSave}
            disabled={isPending || !canSave}
          >
            {isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfirmationCard;
