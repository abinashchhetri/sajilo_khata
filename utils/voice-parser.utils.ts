// ─────────────────────────────────────────────────────────────────────────────
// Voice Parser Utilities
// ─────────────────────────────────────────────────────────────────────────────
// Pure functions — no side effects, no hooks. Takes a raw speech transcript
// and extracts structured line items + account match + optional intent signals.
//
// Parsing strategy (unchanged from V1):
//   "dal 100 milk 30"
//   → tokens: ["dal", "100", "milk", "30"]
//   → accumulate words into nameParts until a number is found
//   → emit { name: "dal", amount: 100 }, then { name: "milk", amount: 30 }
//
// What changed in V2:
//   • Normalisation runs the number-engine BEFORE tokenising, so "7,000" and
//     "seven thousand" both arrive as the clean token "7000".
//   • parseVoiceTranscript returns three additional optional fields
//     (detectedCurrency, detectedType, detectedDate, detectedMerchant) that
//     ConfirmationCard can use to pre-fill the form — none are auto-saved.
// ─────────────────────────────────────────────────────────────────────────────

import { detectCurrency, normalizeAmounts } from "@/utils/number-engine";
import type { IAccountVoiceKeyword } from "@/types/accounts/accounts.types";
import type { TParsedVoiceEntry } from "@/types/transactions/transactions.types";

// ─────── parseLineItems ───────────────────────────────────────────────────────

export const parseLineItems = (
  transcript: string,
): { name: string; amount: number }[] => {
  // 1. Strip currency markers (avoids ₹ / $ becoming name tokens)
  const { stripped } = detectCurrency(transcript);

  // 2. Convert all amount representations to plain digit tokens.
  //    After this: "seven thousand" → "7000", "7,000" → "7000",
  //    "1.2l" → "120000", "9 point 5" → "9.5".
  const normalized = normalizeAmounts(stripped)
    // 3. Strip residual punctuation but preserve decimal dots within numbers
    .replace(/[^a-z0-9.\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = normalized.split(" ");
  const items: { name: string; amount: number }[] = [];
  const nameParts: string[] = [];

  for (const token of tokens) {
    if (!token) continue;

    // parseFloat handles "7000", "9.5", "12000.5" — no comma stripping needed
    // (normalizeAmounts already removed grouping commas).
    const num = parseFloat(token);
    const isNumber = !isNaN(num) && num > 0;

    if (isNumber) {
      if (nameParts.length > 0) {
        // Flush accumulated name words as a new line item
        items.push({ name: nameParts.join(" "), amount: num });
        nameParts.length = 0;
      }
      // Number with no preceding name → discard (no label = no item)
    } else {
      nameParts.push(token);
    }
  }

  // Any trailing name words with no following number are discarded
  return items;
};

// ─────── detectAccountFromTranscript ─────────────────────────────────────────
// Unchanged from V1 — already correct via backend allMatchTerms.

export const detectAccountFromTranscript = (
  transcript: string,
  accountKeywords: IAccountVoiceKeyword[],
): { accountId: string; accountName: string } | null => {
  const lower = transcript.toLowerCase();

  for (const account of accountKeywords) {
    const matched = account.allMatchTerms.some((term) => lower.includes(term));
    if (matched) return { accountId: account.id, accountName: account.name };
  }

  return null;
};

// ─────── inferType ────────────────────────────────────────────────────────────

export const inferType = (
  raw: string,
): "expense" | "income" | "transfer" | undefined => {
  const lower = raw.toLowerCase();

  // Check transfer first (most specific — typically contains "from ... to ...")
  if (
    /\b(transfer(?:red)?|moved?|sent)\b/.test(lower) ||
    /\bfrom\b.+\bto\b/.test(lower)
  ) {
    return "transfer";
  }

  if (/\b(received|got|salary|refund(?:ed)?|earned|income)\b/.test(lower)) {
    return "income";
  }

  if (/\b(spent|bought|paid|bill|buy|purchase(?:d)?)\b/.test(lower)) {
    return "expense";
  }

  return undefined;
};

// ─────── inferDate ────────────────────────────────────────────────────────────

const isoDate = (d: Date): string => d.toISOString().split("T")[0];

const addDays = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const inferDate = (raw: string): string | null => {
  const lower = raw.toLowerCase();
  const today = new Date();

  if (/\btoday\b/.test(lower)) return isoDate(today);

  if (/\byesterday\b/.test(lower)) return isoDate(addDays(today, -1));

  const daysAgo = lower.match(/\b(\d+)\s+days?\s+ago\b/);
  if (daysAgo) return isoDate(addDays(today, -parseInt(daysAgo[1], 10)));

  const WEEKDAYS = [
    "sunday", "monday", "tuesday", "wednesday",
    "thursday", "friday", "saturday",
  ];
  for (let i = 0; i < WEEKDAYS.length; i++) {
    if (lower.includes(WEEKDAYS[i])) {
      // Most recent past occurrence of that weekday (today included if matching)
      const diff = (today.getDay() - i + 7) % 7;
      return isoDate(addDays(today, -diff));
    }
  }

  return null;
};

// ─────── inferMerchant ────────────────────────────────────────────────────────

export const inferMerchant = (raw: string): string | null => {
  // Match "at <place>" — stop before common boundary words or digits
  const m = raw.match(
    /\bat\s+([A-Za-z][A-Za-z\s]{0,29}?)(?=\s+(?:for|to|from|and|yesterday|today|last|\d)|\s*$)/i,
  );
  if (!m) return null;
  // Title-case the extracted place name
  return m[1].trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

// ─────── parseVoiceTranscript ─────────────────────────────────────────────────

export const parseVoiceTranscript = (
  rawTranscript: string,
  accountKeywords: IAccountVoiceKeyword[],
): TParsedVoiceEntry => {
  const { currency } = detectCurrency(rawTranscript);

  return {
    // Core fields — shape unchanged; ConfirmationCard reads these
    lineItems: parseLineItems(rawTranscript),
    detectedAccount: detectAccountFromTranscript(rawTranscript, accountKeywords),
    rawTranscript,
    // Optional inference fields — pre-fill only, never auto-saved
    detectedCurrency: currency,
    detectedType: inferType(rawTranscript),
    detectedDate: inferDate(rawTranscript),
    detectedMerchant: inferMerchant(rawTranscript),
  };
};

// ─────── Helpers ──────────────────────────────────────────────────────────────

const escapeRegExp = (str: string): string =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Exported only for tests
export { escapeRegExp };
