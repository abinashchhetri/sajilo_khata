// Single editable exercise row in the workout log form

"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { FieldArrayWithId, UseFormRegister } from "react-hook-form";

interface ExerciseLogRowProps {
  index: number;
  field: FieldArrayWithId;
  plannedSets?: number | null;
  plannedReps?: number | null;
  plannedWeight?: number | null;
  isPreFilled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
}

export function ExerciseLogRow({
  index,
  field,
  plannedSets,
  plannedReps,
  plannedWeight,
  isPreFilled,
  register,
}: ExerciseLogRowProps) {
  const placeholderText =
    plannedSets && plannedReps && plannedWeight
      ? `${plannedSets}×${plannedReps} @ ${plannedWeight}`
      : "";

  return (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Input
            {...register(`exercises.${index}.exerciseName`)}
            placeholder="Exercise name"
            disabled={isPreFilled}
            className="text-sm"
          />
        </div>
        <Checkbox
          {...register(`exercises.${index}.skipped`)}
          className="ml-2"
          title="Skip this exercise"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label className="text-xs">Completed Sets</Label>
          <Input
            {...register(`exercises.${index}.completedSets`)}
            type="number"
            placeholder={`${plannedSets ?? ""}`}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Actual Reps</Label>
          <Input
            {...register(`exercises.${index}.actualReps`)}
            type="number"
            placeholder={`${plannedReps ?? ""}`}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">Actual Weight</Label>
          <Input
            {...register(`exercises.${index}.actualWeight`)}
            type="number"
            placeholder={`${plannedWeight ?? ""}`}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
