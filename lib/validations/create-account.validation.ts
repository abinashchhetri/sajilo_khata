// ─────────────────────────────────────────────────────────────────────────────
// Create Account Validation
// ─────────────────────────────────────────────────────────────────────────────
// Zod schema for the account creation form.
// Mirrors the backend's CreateAccountDto validation so the user sees
// errors client-side before a request is sent.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

import { EAccountType } from "@/types/global.types";

export const CreateAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Account name is required")
    .max(100, "Name must be 100 characters or fewer"),

  type: z.nativeEnum(EAccountType, {
    required_error: "Account type is required",
  }),

  // z.coerce converts the string from the input element to a number.
  // Balances can be negative per business rules — no min() constraint.
  initialBalance: z.coerce.number().optional().default(0),
});

export type TCreateAccount = z.infer<typeof CreateAccountSchema>;
