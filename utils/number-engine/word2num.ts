// ─────────────────────────────────────────────────────────────────────────────
// word2num — spoken/written number words → numeric value
// ─────────────────────────────────────────────────────────────────────────────
// Pure function — no React, no DOM, no side effects.
// Handles English and Nepali/Indic number words, scale words, and decimals.
//
// Algorithm:
//   1. Split on "point" to handle decimals ("nine point five" → 9.5).
//   2. Integer part mode decision:
//      • If ALL words are single-digit units (0–9) with no scale/tens words
//        → digit-by-digit concatenation ("nine zero zero nine" → 9009).
//      • Otherwise → running-accumulator (standard "twenty two thousand" → 22000).
//   3. Fractional part: each word maps to one decimal digit ("five" → .5).
// ─────────────────────────────────────────────────────────────────────────────

// ─────── Lookup tables ───────────────────────────────────────────────────────

const UNITS: Record<string, number> = {
  // English
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
  // Nepali / Indic digits
  ek: 1, dui: 2, tin: 3, teen: 3, char: 4, chaar: 4, paanch: 5,
  chha: 6, chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
};

const TENS: Record<string, number> = {
  twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};

const SCALES: Record<string, number> = {
  hundred: 100,
  thousand: 1_000,  hajaar: 1_000, hazar: 1_000,
  lakh: 100_000,    lac: 100_000,
  crore: 10_000_000, karod: 10_000_000, koti: 10_000_000,
};

// No-op connector words
const SKIP = new Set(["and", "a"]);

// Exported so normalizeAmounts can build its word-span regex from the same set.
// "and" is included so spans like "three thousand four hundred AND fifty" stay
// together; wordsToNumber's SKIP set silently discards it during parsing.
export const NUMBER_WORDS = new Set<string>([
  ...Object.keys(UNITS),
  ...Object.keys(TENS),
  ...Object.keys(SCALES),
  "point",
  "and",
]);

// ─────── Implementation ───────────────────────────────────────────────────────

/**
 * Converts a phrase of number words to a numeric value.
 * Returns null when no recognizable number word is present.
 *
 * @example
 * wordsToNumber("seven thousand")          // 7000
 * wordsToNumber("one lakh twenty five thousand") // 125000
 * wordsToNumber("nine zero zero nine")     // 9009
 * wordsToNumber("nine point five")         // 9.5
 * wordsToNumber("paanch hajaar")           // 5000
 */
export function wordsToNumber(input: string): number | null {
  const words = input
    .toLowerCase()
    .trim()
    .split(/[\s\-]+/)
    .filter((w) => w.length > 0 && !SKIP.has(w));

  if (words.length === 0) return null;

  // ── Split on "point" for decimal handling ─────────────────────────────────
  const pointIdx = words.indexOf("point");
  const intWords = pointIdx >= 0 ? words.slice(0, pointIdx) : words;
  const fracWords = pointIdx >= 0 ? words.slice(pointIdx + 1) : [];

  // Guard: at least one recognized number word must be present
  const hasNumberWord = intWords.some(
    (w) => w in UNITS || w in TENS || w in SCALES,
  );
  if (!hasNumberWord) return null;

  // ── Integer part ──────────────────────────────────────────────────────────

  // Mode: if every integer word is a single-digit unit (0–9) and there are no
  // scale/tens/sub-teen words, treat as digit-by-digit concatenation so that
  // "nine zero zero nine" → 9009 rather than 9+0+0+9 = 18.
  const hasScaleTensOrSubTeen = intWords.some(
    (w) => w in SCALES || w in TENS || (w in UNITS && UNITS[w] >= 10),
  );

  let intValue = 0;

  if (!hasScaleTensOrSubTeen) {
    // Digit-concatenation mode
    const digits = intWords.map((w) => (w in UNITS ? UNITS[w] : null));
    if (digits.some((d) => d === null)) return null;
    intValue = parseInt(digits.join(""), 10);
  } else {
    // Running-accumulator mode
    let current = 0;
    let result = 0;

    for (const word of intWords) {
      if (word in UNITS) {
        current += UNITS[word];
      } else if (word in TENS) {
        current += TENS[word];
      } else if (word in SCALES) {
        const sv = SCALES[word];
        if (sv === 100) {
          // "hundred" multiplies current (or 1 if current is 0)
          current = (current || 1) * 100;
        } else {
          // thousand / lakh / crore: bank into result
          result += (current || 1) * sv;
          current = 0;
        }
      }
    }

    intValue = result + current;
  }

  // ── Fractional part ───────────────────────────────────────────────────────
  if (fracWords.length === 0) return intValue;

  // Each frac word is one decimal digit: "five" → 5 → appended as "0.5"
  const fracDigits = fracWords.map((w) => (w in UNITS ? UNITS[w] : null));
  if (fracDigits.some((d) => d === null)) return intValue;

  return intValue + parseFloat("0." + fracDigits.join(""));
}
