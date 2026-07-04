// ─────────────────────────────────────────────────────────────────────────────
// Voice Parser Utilities
// ─────────────────────────────────────────────────────────────────────────────
// Pure functions — no side effects, no hooks. Takes a raw speech transcript
// and extracts structured line items + the matched account from the backend
// keyword list.
//
// Parsing strategy:
//   "dal 100 milk 30"
//   → tokens: ["dal", "100", "milk", "30"]
//   → accumulate words into nameParts until a number is found
//   → emit { name: "dal", amount: 100 }, then { name: "milk", amount: 30 }
//
// Multi-word item names work naturally:
//   "cooking oil 200" → nameParts=["cooking","oil"], num=200 → { name:"cooking oil", amount:200 }
// ─────────────────────────────────────────────────────────────────────────────

import type { IAccountVoiceKeyword } from "@/types/accounts/accounts.types";
import type { TParsedVoiceEntry } from "@/types/transactions/transactions.types";

// ─────── parseLineItems ───────────────────────────────────────────────────────

export const parseLineItems = (
  transcript: string,
): { name: string; amount: number }[] => {
  // Normalize: lowercase, strip punctuation, collapse whitespace
  const normalized = transcript
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = normalized.split(" ");
  const items: { name: string; amount: number }[] = [];
  const nameParts: string[] = [];

  for (const token of tokens) {
    if (!token) continue;

    const num = parseFloat(token.replace(/,/g, ""));
    const isNumber = !isNaN(num) && num > 0;

    if (isNumber) {
      if (nameParts.length > 0) {
        // Flush accumulated name parts as a new line item
        items.push({ name: nameParts.join(" "), amount: num });
        nameParts.length = 0;
      }
      // Number with no preceding name → discard (can't have an amount without a label)
    } else {
      nameParts.push(token);
    }
  }

  // nameParts left over at the end with no trailing number → no item to emit
  return items;
};

// ─────── detectAccountFromTranscript ─────────────────────────────────────────

export const detectAccountFromTranscript = (
  transcript: string,
  accountKeywords: IAccountVoiceKeyword[],
): { accountId: string; accountName: string } | null => {
  const lower = transcript.toLowerCase();

  for (const account of accountKeywords) {
    // allMatchTerms already includes name + type + custom keywords, all lowercased
    const matched = account.allMatchTerms.some((term) => lower.includes(term));
    if (matched) {
      return { accountId: account.id, accountName: account.name };
    }
  }

  return null;
};

// ─────── parseVoiceTranscript ─────────────────────────────────────────────────

export const parseVoiceTranscript = (
  rawTranscript: string,
  accountKeywords: IAccountVoiceKeyword[],
): TParsedVoiceEntry => ({
  lineItems: parseLineItems(rawTranscript),
  detectedAccount: detectAccountFromTranscript(rawTranscript, accountKeywords),
  rawTranscript,
});

// ─────── Helpers ──────────────────────────────────────────────────────────────

const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Exported only for tests — not used internally anymore
export { escapeRegExp };
