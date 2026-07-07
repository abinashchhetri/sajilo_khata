// ─────────────────────────────────────────────────────────────────────────────
// normalizeAmounts — rewrite a raw transcript so every amount is a plain digit
// ─────────────────────────────────────────────────────────────────────────────
// Runs BEFORE the voice parser tokenizes the transcript. After this call, all
// amount-looking tokens are plain digit strings ("7000", "9.5") so the
// "accumulate name words until a number, then flush" algorithm works correctly.
//
// Pipeline (in order):
//   1. Lowercase + Unicode normalize
//   2. Repair decimal notation: "9 . 5" / "9 point 5" → "9.5"
//   3. Merge comma-grouped digits: "7,000" / "1,00,000" → "7000" / "100000"
//   4. Merge space-grouped digits (loop): "7 000" → "7000"
//   5. Expand shorthands: 7k / 1.2l / 1.2lakh / 2cr → digit form
//   6. Convert contiguous number-word spans to digits
// ─────────────────────────────────────────────────────────────────────────────

import { wordsToNumber, NUMBER_WORDS } from "./word2num";

// Build a single alternation pattern from all known number words.
// Sorted longest-first so multi-char words (lakh, crore) beat substrings.
const WORD_ALT = [...NUMBER_WORDS]
  .sort((a, b) => b.length - a.length)
  .join("|");

// Matches one or more consecutive number words (space-separated)
const SPAN_RE = new RegExp(
  `\\b((?:${WORD_ALT})(?:\\s+(?:${WORD_ALT}))*)\\b`,
  "g",
);

/**
 * Rewrites `raw` so every amount token is a plain digit string.
 * Preserves non-number words (item names, etc.) verbatim.
 *
 * @example
 * normalizeAmounts("rent saat hazar")   // "rent 7000"
 * normalizeAmounts("dal 7,000")         // "dal 7000"
 * normalizeAmounts("groceries 1,00,000")// "groceries 100000"
 * normalizeAmounts("7 000")             // "7000"
 * normalizeAmounts("9 point 5")         // "9.5"  (digit + word + digit)
 * normalizeAmounts("7k")                // "7000"
 * normalizeAmounts("1.2L")              // "120000"
 */
export function normalizeAmounts(raw: string): string {
  // 1. Lowercase + Unicode normalize, collapse whitespace
  let text = raw.toLowerCase().normalize("NFKC").replace(/\s+/g, " ").trim();

  // 2a. Repair spaced decimal dot: "9 . 5" → "9.5"
  text = text.replace(/(\d)\s*\.\s*(\d)/g, "$1.$2");

  // 2b. Repair "digit point digit": "9 point 5" → "9.5"
  //     (Mixed digit–word–digit pattern; pure-word "nine point five" is
  //     handled later by the word-span converter.)
  text = text.replace(/(\d)\s+point\s+(\d)/g, "$1.$2");

  // 3. Merge comma-separated digit groups (handles both Western 7,000 and
  //    Indian 1,00,000 grouping). Strip commas from any run like d,dd or d,ddd.
  text = text.replace(/\d(?:,\d{2,3})+/g, (m) => m.replace(/,/g, ""));

  // 4. Merge space-separated digit groups (loop until stable).
  //    Handles "7 000" → "7000" and "1 00 000" → "100000" in two passes.
  let prev = "";
  while (prev !== text) {
    prev = text;
    text = text.replace(/\b(\d+) (\d{2,3})\b/g, "$1$2");
  }

  // 5. Expand shorthands (case already lowercased)
  //    7k → 7000
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*k\b/g, (_, n) =>
    String(Math.round(parseFloat(n) * 1_000)),
  );
  //    1.2l / 1.2lakh → 120000
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*l(?:akh)?\b/g, (_, n) =>
    String(Math.round(parseFloat(n) * 100_000)),
  );
  //    2cr / 2crore → 20000000
  text = text.replace(/\b(\d+(?:\.\d+)?)\s*(?:cr(?:ore)?)\b/g, (_, n) =>
    String(Math.round(parseFloat(n) * 10_000_000)),
  );

  // 6. Convert contiguous number-word spans to digit strings.
  //    "seven thousand" → "7000", "ek lakh" → "100000"
  //    Leaves the span unchanged when wordsToNumber returns null.
  SPAN_RE.lastIndex = 0;
  text = text.replace(SPAN_RE, (match) => {
    const n = wordsToNumber(match.trim());
    return n !== null ? String(n) : match;
  });

  return text.replace(/\s+/g, " ").trim();
}
