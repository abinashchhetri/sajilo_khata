// Exercise selector for the progress chart.

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExerciseNames } from "@/hooks/react-query/workouts/get-exercise-names.hook";

interface ExercisePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExercisePicker({ value, onChange }: ExercisePickerProps) {
  const { exercises, isLoading } = useGetExerciseNames();

  if (isLoading) return <Skeleton className="h-9 w-full rounded-xs" />;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Choose an exercise to track" />
      </SelectTrigger>
      <SelectContent>
        {exercises.map((ex) => (
          <SelectItem key={ex} value={ex}>
            {ex}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
