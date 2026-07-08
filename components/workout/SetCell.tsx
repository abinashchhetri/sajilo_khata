"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ISetData, TFeeling } from "@/types/workout/workout.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  set: ISetData;
  mode: "plan" | "session";
  onChange?: (
    field: "weightKg" | "reps" | "feeling",
    value: number | string | null,
  ) => void;
}

const FEELINGS: TFeeling[] = ["light", "average", "medium", "hard"];

const fmt = (v: number | null | undefined, suffix = "") =>
  v != null ? `${v}${suffix}` : "—";

// ─────── Component ───────────────────────────────────────────────────────────

const SetCell = ({ set, mode, onChange }: Props) => {
  if (mode === "plan") {
    return (
      <div className="flex min-w-[88px] flex-col items-center justify-center px-2 py-1.5 text-center tabular-nums">
        <span className="text-xs font-medium text-foreground">
          {fmt(set.weightKg, "kg")}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {fmt(set.reps, " reps")} · {set.feeling ?? "—"}
        </span>
      </div>
    );
  }

  // Session mode — inline editable
  return (
    <div
      className={cn(
        "flex min-w-[140px] flex-col gap-1 border-l-2 px-2 py-1.5",
        set.isCompleted
          ? "border-l-green-500 bg-green-500/10"
          : "border-l-transparent",
      )}
    >
      {/* Weight */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          step={0.5}
          placeholder="—"
          value={set.weightKg ?? ""}
          onChange={(e) =>
            onChange?.(
              "weightKg",
              e.target.value === "" ? null : Number(e.target.value),
            )
          }
          className="h-6 w-16 px-1.5 text-xs tabular-nums"
        />
        <span className="text-[10px] text-muted-foreground">kg</span>
      </div>

      {/* Reps */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          placeholder="—"
          value={set.reps ?? ""}
          onChange={(e) =>
            onChange?.(
              "reps",
              e.target.value === "" ? null : Number(e.target.value),
            )
          }
          className="h-6 w-16 px-1.5 text-xs tabular-nums"
        />
        <span className="text-[10px] text-muted-foreground">reps</span>
      </div>

      {/* Feeling */}
      <Select
        value={set.feeling ?? ""}
        onValueChange={(v) => onChange?.("feeling", v as TFeeling)}
      >
        <SelectTrigger className="h-6 text-xs px-1.5">
          <SelectValue placeholder="feel" />
        </SelectTrigger>
        <SelectContent>
          {FEELINGS.map((f) => (
            <SelectItem key={f} value={f} className="text-xs">
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SetCell;
