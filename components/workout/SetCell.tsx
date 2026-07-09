"use client";

import { useState } from "react";
import { X } from "lucide-react";

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
  // Fires once — only when weight + reps + feeling are all non-empty.
  onCommit?: (weight: number, reps: number, feeling: TFeeling) => void;
  onDelete?: () => void;
}

const FEELINGS: TFeeling[] = ["light", "average", "medium", "hard"];

const fmt = (v: number | null | undefined, suffix = "") =>
  v != null ? `${v}${suffix}` : "—";

// ─────── Component ───────────────────────────────────────────────────────────

const SetCell = ({ set, mode, onCommit, onDelete }: Props) => {
  const [localWeight, setLocalWeight] = useState<number | "">(
    set.weightKg || "",
  );
  const [localReps, setLocalReps] = useState<number | "">(set.reps || "");
  const [localFeeling, setLocalFeeling] = useState<TFeeling | "">(
    set.feeling ?? "",
  );

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

  // Fire ONE API call only when all three fields are filled.
  const tryCommit = (
    w: number | "",
    r: number | "",
    f: TFeeling | "",
  ) => {
    if (w !== "" && r !== "" && f !== "") {
      onCommit?.(Number(w), Number(r), f);
    }
  };

  return (
    <div
      key={set.sessionSetId ?? set.setNumber}
      className={cn(
        "flex min-w-[140px] flex-col gap-1 border-l-2 px-2 py-1.5",
        set.isCompleted
          ? "border-l-green-500 bg-green-500/10"
          : "border-l-transparent",
      )}
    >
      {/* Delete button */}
      {onDelete && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDelete}
            className="flex h-4 w-4 items-center justify-center rounded text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={10} />
          </button>
        </div>
      )}
      {/* Weight — commits on blur once all fields are filled */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          step={0.5}
          placeholder="—"
          value={localWeight}
          onChange={(e) =>
            setLocalWeight(e.target.value === "" ? "" : Number(e.target.value))
          }
          onBlur={() => tryCommit(localWeight, localReps, localFeeling)}
          className="h-6 w-16 px-1.5 text-xs tabular-nums"
        />
        <span className="text-[10px] text-muted-foreground">kg</span>
      </div>

      {/* Reps — commits on blur once all fields are filled */}
      <div className="flex items-center gap-1">
        <Input
          type="number"
          min={0}
          placeholder="—"
          value={localReps}
          onChange={(e) =>
            setLocalReps(e.target.value === "" ? "" : Number(e.target.value))
          }
          onBlur={() => tryCommit(localWeight, localReps, localFeeling)}
          className="h-6 w-16 px-1.5 text-xs tabular-nums"
        />
        <span className="text-[10px] text-muted-foreground">reps</span>
      </div>

      {/* Feeling — commits immediately on select (last field in natural flow) */}
      <Select
        value={localFeeling}
        onValueChange={(v) => {
          const f = v as TFeeling;
          setLocalFeeling(f);
          tryCommit(localWeight, localReps, f);
        }}
      >
        <SelectTrigger className="h-6 px-1.5 text-xs">
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
