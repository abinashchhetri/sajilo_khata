// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT_KEYWORDS
// ─────────────────────────────────────────────────────────────────────────────
// Maps spoken words / common misspellings to EAccountType values.
// Checked in detectAccountFromTranscript — longer keys are tested first so
// "e sewa" wins before the lone "e" would accidentally match something.
// Values must match EAccountType exactly (the backend AccountTypeEnum).
// ─────────────────────────────────────────────────────────────────────────────

export const ACCOUNT_KEYWORDS: Record<string, string> = {
  // CASH
  cash: "CASH",
  nakit: "CASH",
  nakad: "CASH",

  // BANK
  bank: "BANK",
  "bank account": "BANK",

  // ESEWA — handles common speech-to-text variations
  "e sewa": "ESEWA",
  "esewa": "ESEWA",
  "e-sewa": "ESEWA",
  "isewa": "ESEWA",

  // KHALTI
  khalti: "KHALTI",
  "kalti": "KHALTI",
};
