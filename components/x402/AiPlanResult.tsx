"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AiPlanResult
// ─────────────────────────────────────────────────────────────────────────────
// Read-only render of a generated x402 plan: history analysis + 7-day
// workouts/meals. No API calls; pure presentation.
// ─────────────────────────────────────────────────────────────────────────────

import { ExternalLink } from "lucide-react";

import { X402_CONSTANTS } from "@/lib/constants/x402.constants";
import type { IX402PlanResponse } from "@/types/x402/x402.types";

interface Props {
  plan: IX402PlanResponse;
  signature: string | null;
}

const AiPlanResult = ({ plan, signature }: Props) => {
  const { historyAnalysis: h, generatedPlan: p } = plan;

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-5 pr-1">
      {/* History analysis */}
      <div className="space-y-1">
        <p className="text-eyebrow text-muted-foreground">History analysis</p>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Adherence" value={`${Math.round(h.adherence * 100)}%`} />
          <Stat label="Workout days" value={`${h.workoutDays}`} />
          <Stat label="Avg calories" value={`${h.averageDailyCalories}`} />
          <Stat label="Meals logged" value={`${h.mealsLogged}`} />
        </div>
        <p className="text-caption text-muted-foreground pt-1">
          Focus: {h.focusMuscles.join(", ")}
        </p>
      </div>

      {/* Rationale */}
      <p className="text-body-sm text-foreground border-l-2 border-primary pl-3">
        {p.rationale}
      </p>

      {/* Workouts */}
      <div className="space-y-2">
        <p className="text-eyebrow text-muted-foreground">Workouts</p>
        {p.workouts.map((w, i) => (
          <div key={i} className="rounded-md border p-3 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-medium text-foreground">
                {w.day} — {w.name}
              </span>
              <span className="text-caption text-muted-foreground">
                {w.duration} min
              </span>
            </div>
            {w.exercises.map((ex, j) => (
              <p key={j} className="text-caption text-muted-foreground">
                • {ex.name} {ex.sets}×{ex.reps} @ {ex.weight}kg
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Meals */}
      <div className="space-y-2">
        <p className="text-eyebrow text-muted-foreground">Meals</p>
        {p.meals.map((m, i) => (
          <div key={i} className="rounded-md border p-3">
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-foreground">
                {m.day} · {m.type} — {m.name}
              </span>
              <span className="text-caption text-muted-foreground">
                {m.calories} cal
              </span>
            </div>
          </div>
        ))}
      </div>

      {signature && (
        <a
          href={X402_CONSTANTS.EXPLORER_TX(signature)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline"
        >
          Paid on devnet — view transaction
          <ExternalLink size={12} />
        </a>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-md border px-3 py-2">
    <p className="text-eyebrow text-muted-foreground">{label}</p>
    <p className="text-title text-foreground">{value}</p>
  </div>
);

export default AiPlanResult;
