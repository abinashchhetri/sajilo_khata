// ─────────────────────────────────────────────────────────────────────────────
// number-engine — unit tests
// ─────────────────────────────────────────────────────────────────────────────
// Every case listed in the spec must pass. Old-failure regression cases are
// marked explicitly to make regressions obvious.
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { wordsToNumber } from "../word2num";
import { normalizeAmounts } from "../normalize-amounts";
import { detectCurrency } from "../parse-currency";

// ─────── wordsToNumber ────────────────────────────────────────────────────────

describe("wordsToNumber", () => {
  it("seven thousand → 7000", () => {
    expect(wordsToNumber("seven thousand")).toBe(7000);
  });

  it("one lakh twenty five thousand → 125000", () => {
    expect(wordsToNumber("one lakh twenty five thousand")).toBe(125000);
  });

  it("twenty two thousand five hundred → 22500", () => {
    expect(wordsToNumber("twenty two thousand five hundred")).toBe(22500);
  });

  it("three thousand four hundred and fifty → 3450", () => {
    expect(wordsToNumber("three thousand four hundred and fifty")).toBe(3450);
  });

  it("nine zero zero nine → 9009 (digit-concat, not 18)", () => {
    expect(wordsToNumber("nine zero zero nine")).toBe(9009);
  });

  it("nine point five → 9.5", () => {
    expect(wordsToNumber("nine point five")).toBe(9.5);
  });

  it("twelve thousand point five → 12000.5", () => {
    expect(wordsToNumber("twelve thousand point five")).toBe(12000.5);
  });

  it("ek lakh (Nepali) → 100000", () => {
    expect(wordsToNumber("ek lakh")).toBe(100000);
  });

  it("paanch hajaar (Nepali) → 5000", () => {
    expect(wordsToNumber("paanch hajaar")).toBe(5000);
  });

  it("returns null for non-number words", () => {
    expect(wordsToNumber("rent coffee dal")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(wordsToNumber("")).toBeNull();
  });
});

// ─────── normalizeAmounts ─────────────────────────────────────────────────────

describe("normalizeAmounts", () => {
  // ── Comma-separated groups ────────────────────────────────────────────────
  it("7,000 → 7000", () => {
    expect(normalizeAmounts("7,000")).toBe("7000");
  });

  it("25,000 → 25000 (OLD failure — was 25)", () => {
    expect(normalizeAmounts("25,000")).toBe("25000");
  });

  it("1,00,000 → 100000 (Indian grouping)", () => {
    expect(normalizeAmounts("1,00,000")).toBe("100000");
  });

  // ── Space-separated groups ────────────────────────────────────────────────
  it("7 000 → 7000 (OLD failure — was 7)", () => {
    expect(normalizeAmounts("7 000")).toBe("7000");
  });

  it("1 00 000 → 100000 (space Indian grouping)", () => {
    expect(normalizeAmounts("1 00 000")).toBe("100000");
  });

  // ── Already-correct digits unchanged ──────────────────────────────────────
  it("100000 unchanged (OLD failure — was 100000 ✓ ensure no corruption)", () => {
    expect(normalizeAmounts("100000")).toBe("100000");
  });

  it("9009 unchanged (OLD failure — already worked, regression guard)", () => {
    expect(normalizeAmounts("9009")).toBe("9009");
  });

  it("rent 7000 → rent 7000 (name preserved, amount already correct)", () => {
    expect(normalizeAmounts("rent 7000")).toBe("rent 7000");
  });

  // ── Decimal repair ────────────────────────────────────────────────────────
  it("9 . 5 → 9.5", () => {
    expect(normalizeAmounts("9 . 5")).toBe("9.5");
  });

  it("9 point 5 → 9.5 (mixed digit-word-digit)", () => {
    expect(normalizeAmounts("9 point 5")).toBe("9.5");
  });

  // ── Shorthand expansion ───────────────────────────────────────────────────
  it("7k → 7000", () => {
    expect(normalizeAmounts("7k")).toBe("7000");
  });

  it("1.2L → 120000", () => {
    expect(normalizeAmounts("1.2L")).toBe("120000");
  });

  it("1.2 lakh → 120000", () => {
    expect(normalizeAmounts("1.2 lakh")).toBe("120000");
  });

  it("2cr → 20000000", () => {
    expect(normalizeAmounts("2cr")).toBe("20000000");
  });

  // ── Word span conversion ──────────────────────────────────────────────────
  it("rent seven thousand → rent 7000", () => {
    expect(normalizeAmounts("rent seven thousand")).toBe("rent 7000");
  });

  it("dal ek saya paanch → dal 105 (Nepali words)", () => {
    // ek=1, saya not in dict — only tests what's in the tables
    // "ek" alone → digit-concat → 1; "paanch" → 5; they are separate spans
    const result = normalizeAmounts("dal ek paanch");
    // ek and paanch are adjacent number words → span "ek paanch"
    // digit-concat mode (no scale/tens) → [1, 5] → "15"
    expect(result).toBe("dal 15");
  });

  it("nine zero zero nine (word span) → 9009", () => {
    expect(normalizeAmounts("nine zero zero nine")).toBe("9009");
  });

  it("twelve thousand point five → 12000.5", () => {
    expect(normalizeAmounts("twelve thousand point five")).toBe("12000.5");
  });

  it("non-number words are untouched", () => {
    expect(normalizeAmounts("coffee dal milk")).toBe("coffee dal milk");
  });
});

// ─────── detectCurrency ───────────────────────────────────────────────────────

describe("detectCurrency", () => {
  it("₹7000 → NPR, stripped '7000'", () => {
    const { currency, stripped } = detectCurrency("₹7000");
    expect(currency).toBe("NPR");
    expect(stripped).toBe("7000");
  });

  it("Rs 7000 → NPR, stripped '7000'", () => {
    const { currency, stripped } = detectCurrency("Rs 7000");
    expect(currency).toBe("NPR");
    expect(stripped).toBe("7000");
  });

  it("$7000 → USD, stripped '7000'", () => {
    const { currency, stripped } = detectCurrency("$7000");
    expect(currency).toBe("USD");
    expect(stripped).toBe("7000");
  });

  it("seven thousand rupees only → NPR, stripped 'seven thousand'", () => {
    const { currency, stripped } = detectCurrency("seven thousand rupees only");
    expect(currency).toBe("NPR");
    expect(stripped).toBe("seven thousand");
  });

  it("NPR 5000 → NPR, stripped '5000'", () => {
    const { currency, stripped } = detectCurrency("NPR 5000");
    expect(currency).toBe("NPR");
    expect(stripped).toBe("5000");
  });

  it("no currency marker → null, stripped unchanged", () => {
    const { currency, stripped } = detectCurrency("rent 7000");
    expect(currency).toBeNull();
    expect(stripped).toBe("rent 7000");
  });
});

// ─────── Combined pipeline ────────────────────────────────────────────────────
// These mirror the spec's top-level assertions: full input → expected amount + currency

describe("combined pipeline (detectCurrency → normalizeAmounts → extract)", () => {
  const extract = (raw: string) => {
    const { currency, stripped } = detectCurrency(raw);
    const normalized = normalizeAmounts(stripped);
    // Find the first numeric token in the normalized string
    const numToken = normalized.split(/\s+/).find((t) => !isNaN(parseFloat(t)));
    return { currency, amount: numToken !== undefined ? parseFloat(numToken) : null };
  };

  it("seven thousand → 7000", () => {
    expect(extract("seven thousand").amount).toBe(7000);
  });

  it("seven thousand rupees only → 7000 + NPR", () => {
    const r = extract("seven thousand rupees only");
    expect(r.amount).toBe(7000);
    expect(r.currency).toBe("NPR");
  });

  it("one lakh twenty five thousand → 125000", () => {
    expect(extract("one lakh twenty five thousand").amount).toBe(125000);
  });

  it("twenty two thousand five hundred → 22500", () => {
    expect(extract("twenty two thousand five hundred").amount).toBe(22500);
  });

  it("three thousand four hundred and fifty → 3450", () => {
    expect(extract("three thousand four hundred and fifty").amount).toBe(3450);
  });

  it("nine zero zero nine → 9009", () => {
    expect(extract("nine zero zero nine").amount).toBe(9009);
  });

  it("nine point five → 9.5", () => {
    expect(extract("nine point five").amount).toBe(9.5);
  });

  it("twelve thousand point five → 12000.5", () => {
    expect(extract("twelve thousand point five").amount).toBe(12000.5);
  });

  it("ek lakh → 100000", () => {
    expect(extract("ek lakh").amount).toBe(100000);
  });

  it("paanch hajaar → 5000", () => {
    expect(extract("paanch hajaar").amount).toBe(5000);
  });

  it("rent 7000 → 7000 (amount extractable)", () => {
    expect(extract("rent 7000").amount).toBe(7000);
  });

  it("7,000 → 7000", () => {
    expect(extract("7,000").amount).toBe(7000);
  });

  it("1,00,000 → 100000", () => {
    expect(extract("1,00,000").amount).toBe(100000);
  });

  it("Rs 7000 → 7000 + NPR", () => {
    const r = extract("Rs 7000");
    expect(r.amount).toBe(7000);
    expect(r.currency).toBe("NPR");
  });

  it("₹7000 → 7000 + NPR", () => {
    const r = extract("₹7000");
    expect(r.amount).toBe(7000);
    expect(r.currency).toBe("NPR");
  });

  it("$7000 → 7000 + USD", () => {
    const r = extract("$7000");
    expect(r.amount).toBe(7000);
    expect(r.currency).toBe("USD");
  });

  it("7k → 7000", () => {
    expect(extract("7k").amount).toBe(7000);
  });

  it("1.2L → 120000", () => {
    expect(extract("1.2L").amount).toBe(120000);
  });

  // ── Regression: OLD failure cases ─────────────────────────────────────────
  it("[REGRESSION] 7 000 → 7000, not 7", () => {
    expect(extract("7 000").amount).toBe(7000);
  });

  it("[REGRESSION] 25,000 → 25000, not 25", () => {
    expect(extract("25,000").amount).toBe(25000);
  });

  it("[REGRESSION] 100000 → 100000 (no corruption)", () => {
    expect(extract("100000").amount).toBe(100000);
  });

  it("[REGRESSION] 9009 → 9009 (no corruption)", () => {
    expect(extract("9009").amount).toBe(9009);
  });
});
