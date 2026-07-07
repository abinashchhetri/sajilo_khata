// ─────────────────────────────────────────────────────────────────────────────
// detectCurrency — strip currency markers and return the detected currency code
// ─────────────────────────────────────────────────────────────────────────────
// Recognises common currency symbols and words found in Nepali financial speech.
// Removes the matched marker and common filler words ("only") from the
// transcript, returning the cleaner string alongside the detected currency code.
//
// Currency codes returned: "NPR", "USD", or null (unknown / not detected).
// ─────────────────────────────────────────────────────────────────────────────

interface CurrencyResult {
  currency: string | null;
  stripped: string;
}

// Each entry: replace the pattern, record the currency code if text changed.
// Ordered so that more specific patterns come first.
const CURRENCY_MAP: Array<{ pattern: RegExp; currency: string }> = [
  { pattern: /₹/g,                  currency: "NPR" },
  { pattern: /रु\.?/g,              currency: "NPR" },
  { pattern: /\bnpr\b/gi,           currency: "NPR" },
  { pattern: /\brs\.?\s*/gi,        currency: "NPR" },
  { pattern: /\brupees?\b/gi,       currency: "NPR" },
  { pattern: /\$/g,                 currency: "USD" },
  { pattern: /\busd\b/gi,           currency: "USD" },
];

// Words to strip regardless of currency detection (filler in financial speech)
const FILLERS = [/\bonly\b/gi];

/**
 * Detects a currency marker in `raw`, strips it (and any filler words), and
 * returns the detected currency code plus the cleaned transcript.
 *
 * @example
 * detectCurrency("₹7000")                // { currency: "NPR", stripped: "7000" }
 * detectCurrency("Rs 7000")              // { currency: "NPR", stripped: "7000" }
 * detectCurrency("seven thousand rupees only") // { currency: "NPR", stripped: "seven thousand" }
 * detectCurrency("$7000")               // { currency: "USD", stripped: "7000" }
 * detectCurrency("rent 7000")           // { currency: null,  stripped: "rent 7000" }
 */
export function detectCurrency(raw: string): CurrencyResult {
  let currency: string | null = null;
  let text = raw;

  for (const { pattern, currency: curr } of CURRENCY_MAP) {
    const replaced = text.replace(pattern, "");
    if (replaced !== text) {
      currency = curr;
      text = replaced;
      // Reset lastIndex for global patterns that may have been partially consumed
      pattern.lastIndex = 0;
    }
  }

  for (const filler of FILLERS) {
    text = text.replace(filler, "");
  }

  return {
    currency,
    stripped: text.replace(/\s+/g, " ").trim(),
  };
}
