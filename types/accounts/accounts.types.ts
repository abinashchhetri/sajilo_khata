// ─────────────────────────────────────────────────────────────────────────────
// Account Types
// ─────────────────────────────────────────────────────────────────────────────
// Interfaces scoped to the accounts feature.
// Mirrors the backend Account entity and its DTOs exactly — if the backend
// adds a field, this file is the first place to update.
// ─────────────────────────────────────────────────────────────────────────────

import type { TAccountType } from "@/types/global.types";

export interface IAccount {
  id: string;
  userId: string;
  name: string;
  type: TAccountType;
  currentBalance: number;
  isDefault: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Shape for POST /accounts
export interface ICreateAccount {
  name: string;
  type: TAccountType;
  initialBalance?: number;
}

// Shape for PATCH /accounts/:id — type is immutable after creation
export interface IUpdateAccount {
  name?: string;
  isDefault?: boolean;
  isArchived?: boolean;
}

export interface IFindAllAccountsParams {
  includeArchived?: boolean;
}
