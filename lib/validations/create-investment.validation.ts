// ─────────────────────────────────────────────────────────────────────────────
// Create Investment Validation
// ─────────────────────────────────────────────────────────────────────────────
// Zod discriminated union so each investment type is validated against its own
// metadata shape — NEPSE requires scrip/quantity/buyPricePerUnit, SIP requires
// fundName/monthlyAmount, FD requires bankName/interestRate/maturityDate/principal.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

const BaseFields = {
  name: z.string().trim().min(1, "Name is required"),
  investedAmount: z.coerce.number().positive("Must be greater than 0"),
  currentValue: z.coerce.number().min(0, "Must be 0 or greater"),
  note: z.string().trim().optional(),
};

const NepseSchema = z.object({
  type: z.literal("nepse"),
  ...BaseFields,
  metadata: z.object({
    scrip: z.string().trim().min(1, "Scrip symbol is required"),
    quantity: z.coerce.number().positive("Quantity must be greater than 0"),
    buyPricePerUnit: z.coerce.number().positive("Buy price must be greater than 0"),
    broker: z.string().trim().optional(),
  }),
});

const SipSchema = z.object({
  type: z.literal("sip"),
  ...BaseFields,
  metadata: z.object({
    fundName: z.string().trim().min(1, "Fund name is required"),
    monthlyAmount: z.coerce.number().positive("Monthly amount must be greater than 0"),
    unitsHeld: z.coerce.number().min(0).optional(),
  }),
});

const FdSchema = z.object({
  type: z.literal("fd"),
  ...BaseFields,
  metadata: z.object({
    bankName: z.string().trim().min(1, "Bank name is required"),
    interestRate: z.coerce.number().positive("Interest rate must be greater than 0"),
    maturityDate: z.string().min(1, "Maturity date is required"),
    principal: z.coerce.number().positive("Principal must be greater than 0"),
  }),
});

export const CreateInvestmentSchema = z.discriminatedUnion("type", [
  NepseSchema,
  SipSchema,
  FdSchema,
]);

export type TCreateInvestment = z.infer<typeof CreateInvestmentSchema>;
