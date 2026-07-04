// ─────────────────────────────────────────────────────────────────────────────
// Transaction Types
// ─────────────────────────────────────────────────────────────────────────────
// Interfaces and types scoped to the transactions feature.
// Mirrors the backend Transaction entity and its DTOs exactly — if the
// backend adds a field, this file is the first place to update.
// ─────────────────────────────────────────────────────────────────────────────

import type { IDateRangeFilter } from "@/types/global.types";
import type { ICategory } from "@/types/categories/categories.types";

export type TTransactionType = "expense" | "income" | "in_transit";
export type TEntryMethod = "voice" | "form";

export interface ILineItem {
  id: string;
  name: string;
  amount: number;
  autoCategory?: string;
}

export interface ITransaction {
  id: string;
  accountId: string;
  categoryId: string | null;
  // Backend joins the category relation when fetching — null when not yet set
  category?: Pick<ICategory, "id" | "name" | "icon" | "color"> | null;
  type: TTransactionType;
  totalAmount: number;
  isPersonal: boolean;
  voiceTranscript: string | null;
  note: string | null;
  entryMethod: TEntryMethod;
  transactedAt: string;
  lineItems: ILineItem[];
  createdAt: string;
  updatedAt: string;
}

// Shape for POST /transactions
export interface ICreateTransaction {
  accountId: string;
  type: TTransactionType;
  lineItems?: { name: string; amount: number }[];
  totalAmount?: number;   // only used when type is in_transit
  note?: string;
  entryMethod?: TEntryMethod;
  voiceTranscript?: string;
  transactedAt?: string;
}

// Shape for PATCH /transactions/:id — only note and categoryId are editable
export interface IUpdateTransaction {
  note?: string;
  categoryId?: string | null;
}

export interface IFindAllTransactionsParams extends IDateRangeFilter {
  page?: number;
  limit?: number;
  accountId?: string;
  type?: TTransactionType;
  categoryId?: string;
  isPersonal?: boolean;
}

// Shape the voice parser produces before the ConfirmationCard pre-fills a form
export interface TParsedVoiceEntry {
  lineItems: { name: string; amount: number }[];
  detectedAccount: { accountId: string; accountName: string } | null;
  rawTranscript: string;
}
