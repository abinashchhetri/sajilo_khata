// Exercise selector for progress chart

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetExerciseNames } from "@/hooks/react-query/workouts/get-exercise-names.hook";
import { Skeleton } from "@/components/ui/skeleton";

interface ExercisePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ExercisePicker({ value, onChange }: ExercisePickerProps) {
  const { exercises, isLoading } = useGetExerciseNames();

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an exercise" />
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
