// ─────────────────────────────────────────────────────────────────────────────
// Create Transaction Validation
// ─────────────────────────────────────────────────────────────────────────────
// Zod schema for the manual transaction entry form.
// The .refine() enforces the expense/income vs in_transit split server-side
// rule client-side: line items required for expense/income, totalAmount for
// in_transit — one schema handles all three types, no branching.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

const LineItemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
});

export const CreateTransactionSchema = z
  .object({
    accountId: z.string().uuid("Select a valid account"),
    type: z.enum(["expense", "income", "in_transit"] as const),
    lineItems: z.array(LineItemSchema).optional(),
    totalAmount: z.coerce.number().positive().optional(),
    note: z.string().trim().optional(),
    transactedAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.type === "in_transit"
        ? typeof data.totalAmount === "number"
        : !!data.lineItems?.length,
    {
      message: "Provide line items for expense/income, or a total for in-transit",
      path: ["lineItems"],
    },
  );

export type TCreateTransaction = z.infer<typeof CreateTransactionSchema>;
