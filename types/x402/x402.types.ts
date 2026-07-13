// ─────────────────────────────────────────────────────────────────────────────
// x402 Types
// ─────────────────────────────────────────────────────────────────────────────
// Mirrors the backend x402 challenge (blueprint §4.2), the free preview
// (§4.5), and the generated plan (§4.4). Shapes only — no logic.
// ─────────────────────────────────────────────────────────────────────────────

// ── Free preview (GET /x402/plans/preview) ──────────────────────────────────
export interface IX402Preview {
  resource: string;
  priceUsdc: string; // "0.01"
  network: string; // "solana-devnet"
  description: string;
  example: Record<string, unknown>;
}

// ── 402 challenge (one accepts[] entry, blueprint §4.2) ──────────────────────
export interface IX402ChallengeOption {
  scheme: string; // "exact"
  network: string; // "solana-devnet"
  resource: string;
  description: string;
  mimeType: string;
  payTo: string; // recipient devnet pubkey (base58)
  asset: string; // USDC mint (base58)
  maxAmountRequired: string; // base units, e.g. "10000"
  maxTimeoutSeconds: number;
  extra: {
    quoteId: string;
    memo: string; // "x402:<quoteId>"
    decimals: number; // 6
    flow: string; // "signature-presentation"
    instructions: string;
  };
}

export interface IX402Challenge {
  x402Version: number;
  error: string;
  accepts: IX402ChallengeOption[];
}

// ── Generated plan (GET /x402/plans/generate → 200, blueprint §4.4) ──────────
export interface IX402HistoryAnalysis {
  workoutDays: number;
  plannedDays: number;
  adherence: number;
  focusMuscles: string[];
  recentProgress: string;
  mealsLogged: number;
  adherenceMeals: number;
  averageDailyCalories: number;
  macroBalance: string;
}

export interface IX402Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  notes: string;
}

export interface IX402WorkoutDay {
  day: string;
  name: string;
  exercises: IX402Exercise[];
  duration: number;
  notes: string;
}

export interface IX402Meal {
  day: string;
  type: string; // "breakfast" | "lunch" | ...
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
}

export interface IX402GeneratedPlan {
  startDate: string;
  endDate: string;
  rationale: string;
  workouts: IX402WorkoutDay[];
  meals: IX402Meal[];
}

export interface IX402PlanResponse {
  generatedAt: string;
  historyAnalysis: IX402HistoryAnalysis;
  generatedPlan: IX402GeneratedPlan;
  nextSteps: string;
}

// ── Tier B live-payment state machine ────────────────────────────────────────
export type TX402PayPhase =
  | "idle"
  | "connecting" // requesting Phantom connection
  | "quoting" // GET /generate → 402, parsing challenge
  | "paying" // building + signing + sending tx
  | "confirming" // awaiting on-chain confirmation
  | "verifying" // retry /generate with X-PAYMENT
  | "done" // plan received
  | "error";

// The X-PAYMENT header payload (base64url of this JSON), blueprint §4.3
export interface IX402PaymentHeader {
  quoteId: string;
  signature: string;
}
