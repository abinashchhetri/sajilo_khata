// ─────────────────────────────────────────────────────────────────────────────
// Transfer Types
// ─────────────────────────────────────────────────────────────────────────────
// Interfaces scoped to the transfers feature.
// Mirrors the backend Transfer entity and its DTOs exactly — if the backend
// adds a field, this file is the first place to update.
// ─────────────────────────────────────────────────────────────────────────────

import type { IDateRangeFilter } from "@/types/global.types";

export interface ITransfer {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note: string | null;
  transferredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Shape for POST /transfers
export interface ICreateTransfer {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  note?: string;
  transferredAt?: string;
}

export interface IFindAllTransfersParams extends IDateRangeFilter {
  page?: number;
  limit?: number;
  accountId?: string;
}
