// ─────────────────────────────────────────────────────────────────────────────
// voice-parser — unit tests
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import {
  parseLineItems,
  inferType,
  inferDate,
  inferMerchant,
  parseVoiceTranscript,
} from "../voice-parser.utils";

// ─────── parseLineItems ───────────────────────────────────────────────────────

describe("parseLineItems", () => {
  it("[REGRESSION] rent 15000 → [{rent, 15000}]", () => {
    expect(parseLineItems("rent 15000")).toEqual([{ name: "rent", amount: 15000 }]);
  });

  it("multi-item: tarkari 250 aalu 120 → two items", () => {
    expect(parseLineItems("tarkari 250 aalu 120")).toEqual([
      { name: "tarkari", amount: 250 },
      { name: "aalu", amount: 120 },
    ]);
  });

  it("multi-word item name: cooking oil 200 → [{cooking oil, 200}]", () => {
    expect(parseLineItems("cooking oil 200")).toEqual([
      { name: "cooking oil", amount: 200 },
    ]);
  });

  it("[BUG FIX] dal 7,000 → [{dal, 7000}] not [{dal, 7}]", () => {
    expect(parseLineItems("dal 7,000")).toEqual([{ name: "dal", amount: 7000 }]);
  });

  it("[BUG FIX] rent 7 000 → [{rent, 7000}] not [{rent, 7}]", () => {
    expect(parseLineItems("rent 7 000")).toEqual([{ name: "rent", amount: 7000 }]);
  });

  it("[BUG FIX] groceries 1,00,000 → [{groceries, 100000}]", () => {
    expect(parseLineItems("groceries 1,00,000")).toEqual([
      { name: "groceries", amount: 100000 },
    ]);
  });

  it("word amounts: rent seven thousand → [{rent, 7000}]", () => {
    expect(parseLineItems("rent seven thousand")).toEqual([
      { name: "rent", amount: 7000 },
    ]);
  });

  it("Nepali amounts: dal paanch sayo → [{dal, 500}]", () => {
    // "paanch" (5) + "sayo" (not in table) → "5 sayo" — only 5 emitted with "dal"
    // This tests that Nepali digit words convert correctly
    const items = parseLineItems("dal paanch hajaar");
    expect(items).toEqual([{ name: "dal", amount: 5000 }]);
  });

  it("currency stripped: ₹rent 500 → [{rent, 500}]", () => {
    expect(parseLineItems("₹rent 500")).toEqual([{ name: "rent", amount: 500 }]);
  });

  it("shorthand: transport 1.5k → [{transport, 1500}]", () => {
    expect(parseLineItems("transport 1.5k")).toEqual([
      { name: "transport", amount: 1500 },
    ]);
  });

  it("decimal amount: coffee 9.5 → [{coffee, 9.5}]", () => {
    expect(parseLineItems("coffee 9.5")).toEqual([{ name: "coffee", amount: 9.5 }]);
  });

  it("number with no preceding name is discarded", () => {
    expect(parseLineItems("7000")).toEqual([]);
  });

  it("name with no following number is discarded", () => {
    expect(parseLineItems("dal milk")).toEqual([]);
  });

  it("trailing name words after last number are discarded", () => {
    // "dal 100 bank" — "bank" has no following number → discarded
    expect(parseLineItems("dal 100 bank")).toEqual([{ name: "dal", amount: 100 }]);
  });
});

// ─────── inferType ────────────────────────────────────────────────────────────

describe("inferType", () => {
  it("'received salary 50000' → income", () => {
    expect(inferType("received salary 50000")).toBe("income");
  });

  it("'got 5000 from friend' → income", () => {
    expect(inferType("got 5000 from friend")).toBe("income");
  });

  it("'spent 200 on lunch' → expense", () => {
    expect(inferType("spent 200 on lunch")).toBe("expense");
  });

  it("'paid rent 15000' → expense", () => {
    expect(inferType("paid rent 15000")).toBe("expense");
  });

  it("'transferred 5000 to savings' → transfer", () => {
    expect(inferType("transferred 5000 to savings")).toBe("transfer");
  });

  it("'moved money from bank to esewa' → transfer", () => {
    expect(inferType("moved money from bank to esewa")).toBe("transfer");
  });

  it("plain item entry returns undefined", () => {
    expect(inferType("dal 100 milk 50")).toBeUndefined();
  });
});

// ─────── inferDate ────────────────────────────────────────────────────────────

describe("inferDate", () => {
  const isoDate = (d: Date) => d.toISOString().split("T")[0];
  const today = new Date();

  it("'bought coffee today' → today's ISO date", () => {
    expect(inferDate("bought coffee today")).toBe(isoDate(today));
  });

  it("'coffee 150 yesterday' → yesterday's ISO date", () => {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    expect(inferDate("coffee 150 yesterday")).toBe(isoDate(yesterday));
  });

  it("'spent 200 3 days ago' → 3 days back", () => {
    const d = new Date(today);
    d.setDate(d.getDate() - 3);
    expect(inferDate("spent 200 3 days ago")).toBe(isoDate(d));
  });

  it("no date keyword → null", () => {
    expect(inferDate("dal 100 milk 50")).toBeNull();
  });

  it("weekday name returns a past or current date", () => {
    const DAYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const result = inferDate(`bought on ${DAYS[today.getDay()]}`);
    // Should be today (same weekday), diff = 0
    expect(result).toBe(isoDate(today));
  });
});

// ─────── inferMerchant ────────────────────────────────────────────────────────

describe("inferMerchant", () => {
  it("'coffee at starbucks' → Starbucks", () => {
    expect(inferMerchant("coffee at starbucks")).toBe("Starbucks");
  });

  it("'lunch at the bakery for 300' → The Bakery", () => {
    expect(inferMerchant("lunch at the bakery for 300")).toBe("The Bakery");
  });

  it("'paid rent at bank 7000' → Bank", () => {
    expect(inferMerchant("paid rent at bank 7000")).toBe("Bank");
  });

  it("no 'at' pattern → null", () => {
    expect(inferMerchant("dal 100 milk 50")).toBeNull();
  });
});

// ─────── parseVoiceTranscript (full integration) ──────────────────────────────

describe("parseVoiceTranscript integration", () => {
  const noKeywords: never[] = [];

  it("[REGRESSION] 'rent 15000' → lineItems [{rent, 15000}]", () => {
    const result = parseVoiceTranscript("rent 15000", noKeywords);
    expect(result.lineItems).toEqual([{ name: "rent", amount: 15000 }]);
    expect(result.rawTranscript).toBe("rent 15000");
    expect(result.detectedAccount).toBeNull();
  });

  it("'received salary 50000' → type income, amount 50000", () => {
    const result = parseVoiceTranscript("received salary 50000", noKeywords);
    expect(result.detectedType).toBe("income");
    expect(result.lineItems[0]?.amount).toBe(50000);
  });

  it("'coffee 150 yesterday' → lineItem {coffee,150} + date=yesterday", () => {
    const result = parseVoiceTranscript("coffee 150 yesterday", noKeywords);
    expect(result.lineItems).toEqual([{ name: "coffee", amount: 150 }]);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(result.detectedDate).toBe(yesterday.toISOString().split("T")[0]);
  });

  it("multi-item: 'tarkari 250 aalu 120' → two items", () => {
    const result = parseVoiceTranscript("tarkari 250 aalu 120", noKeywords);
    expect(result.lineItems).toEqual([
      { name: "tarkari", amount: 250 },
      { name: "aalu", amount: 120 },
    ]);
  });

  it("'₹rent 7,000' → currency NPR, amount 7000", () => {
    const result = parseVoiceTranscript("₹rent 7,000", noKeywords);
    expect(result.detectedCurrency).toBe("NPR");
    expect(result.lineItems).toEqual([{ name: "rent", amount: 7000 }]);
  });

  it("existing fields always present (backward-compat)", () => {
    const result = parseVoiceTranscript("dal 100", noKeywords);
    expect(result).toHaveProperty("lineItems");
    expect(result).toHaveProperty("detectedAccount");
    expect(result).toHaveProperty("rawTranscript");
  });
});
