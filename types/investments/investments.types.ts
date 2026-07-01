// ─────────────────────────────────────────────────────────────────────────────
// Investment Types
// ─────────────────────────────────────────────────────────────────────────────
// Interfaces scoped to the investments feature.
// gainLoss is computed server-side (currentValue − investedAmount) — never
// recompute it client-side; just render the value with sign-based styling.
// ─────────────────────────────────────────────────────────────────────────────

export type TInvestmentType = "nepse" | "sip" | "fd";

// ─── Per-type metadata ───────────────────────────────────────────────────────

export interface INepseMetadata {
  scrip: string;
  quantity: number;
  buyPricePerUnit: number;
  broker?: string;
}

export interface ISipMetadata {
  fundName: string;
  monthlyAmount: number;
  unitsHeld?: number;
}

export interface IFdMetadata {
  bankName: string;
  interestRate: number;
  maturityDate: string;
  principal: number;
}

export type TInvestmentMetadata = INepseMetadata | ISipMetadata | IFdMetadata;

// ─── Core entities ───────────────────────────────────────────────────────────

export interface IInvestment {
  id: string;
  userId: string;
  name: string;
  type: TInvestmentType;
  investedAmount: number;
  currentValue: number;
  gainLoss: number; // computed by backend — do not recalculate client-side
  // Realized (locked in via sell transactions) and unrealized (paper, on the
  // remaining open position) are tracked separately by the backend and must
  // never be summed or blended into one displayed number.
  realizedGainLoss: number;
  unrealizedGainLoss: number;
  // false once a holding has been fully sold off — drives the "Closed" badge
  isActive: boolean;
  metadata: TInvestmentMetadata;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// Shape for POST /investments
export interface ICreateInvestment {
  name: string;
  type: TInvestmentType;
  investedAmount: number;
  currentValue: number;
  metadata: TInvestmentMetadata;
  note?: string;
}

// Shape for PATCH /investments/:id — name, note, metadata are editable.
// currentValue is intentionally excluded: updating it is a separate endpoint
// because it triggers a backend history snapshot.
export interface IUpdateInvestment {
  name?: string;
  investedAmount?: number;
  note?: string | null;
  metadata?: TInvestmentMetadata;
}

// Shape for PATCH /investments/:id/value — dedicated value-update endpoint
export interface IUpdateInvestmentValue {
  currentValue: number;
}

// ─── Portfolio summary ───────────────────────────────────────────────────────

// Realized and unrealized are kept as two distinct fields throughout — never
// merge them into a single "totalGainLoss" number.
export interface IInvestmentSummaryByType {
  type: TInvestmentType;
  totalInvested: number;
  totalCurrentValue: number;
  totalRealizedGainLoss: number;
  totalUnrealizedGainLoss: number;
}

export interface IInvestmentSummary {
  totalInvested: number;
  totalCurrentValue: number;
  totalRealizedGainLoss: number;
  totalUnrealizedGainLoss: number;
  byType: IInvestmentSummaryByType[];
}

export interface IFindAllInvestmentsParams {
  type?: TInvestmentType;
}

// ─── Investment transactions (NEPSE trade ledger) ────────────────────────────

export type TTransactionType = "buy" | "sell" | "dividend" | "bonus";

export interface IInvestmentTransaction {
  id: string;
  investmentId: string;
  transactionType: TTransactionType;
  quantity: number;
  pricePerUnit: number;
  brokerageFee: number | null;
  date: string;
  note: string | null;
  createdAt: string;
}

export interface ICreateInvestmentTransaction {
  transactionType: TTransactionType;
  quantity: number;
  pricePerUnit: number;
  brokerageFee?: number;
  date: string;
  note?: string;
}

export interface IFindAllInvestmentTransactionsParams {
  page?: number;
  limit?: number;
}
