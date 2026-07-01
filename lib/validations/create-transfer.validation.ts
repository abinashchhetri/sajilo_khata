// ─────────────────────────────────────────────────────────────────────────────
// Create Transfer Validation
// ─────────────────────────────────────────────────────────────────────────────
// Zod schema for the transfer form.
// The .refine() enforces the same-account constraint client-side so the
// request never fires — mirrors TOAST_MESSAGES.TRANSFERS.SAME_ACCOUNT_ERROR.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from "zod";

import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const CreateTransferSchema = z
  .object({
    fromAccountId: z.string().uuid("Select a valid source account"),
    toAccountId: z.string().uuid("Select a valid destination account"),
    amount: z.coerce.number().positive("Amount must be greater than 0"),
    note: z.string().trim().optional(),
    transferredAt: z.string().optional(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: TOAST_MESSAGES.TRANSFERS.SAME_ACCOUNT_ERROR,
    path: ["toAccountId"],
  });

export type TCreateTransfer = z.infer<typeof CreateTransferSchema>;
