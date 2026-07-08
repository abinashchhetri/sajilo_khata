// Create a meal-prep batch.

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MealPrepSchema,
  type TMealPrepForm,
} from "@/lib/validations/meal-prep.validation";
import { MEAL_TYPE_LABEL } from "@/utils/health-format.utils";
import { useHandleCreatePrep } from "@/hooks/react-query/meals/post-prep.hook";
import type { TMealType } from "@/types/nutrition/meals.types";

const MEAL_TYPES: TMealType[] = ["breakfast", "lunch", "dinner", "snack"];

interface PrepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrepFormDialog({ open, onOpenChange }: PrepFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TMealPrepForm>({
    resolver: zodResolver(MealPrepSchema),
  });

  const mealType = watch("mealType");
  const { handleCreate, isPending } = useHandleCreatePrep();

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: TMealPrepForm) => {
    await handleCreate(data);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add prep batch</DialogTitle>
          <DialogDescription>
            Batch-cook once, then log portions through the week.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-eyebrow text-ink-faint">Batch name</span>
            <Input
              {...register("name")}
              placeholder="Grilled chicken breasts"
              autoFocus
            />
            {errors.name && (
              <span className="text-caption text-destructive">
                {errors.name.message}
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-eyebrow text-ink-faint">Portions</span>
              <Input
                {...register("totalPortions")}
                type="number"
                inputMode="numeric"
                placeholder="5"
                className="tabular-nums"
              />
              {errors.totalPortions && (
                <span className="text-caption text-destructive">
                  {errors.totalPortions.message}
                </span>
              )}
            </label>
            <label className="space-y-1">
              <span className="text-eyebrow text-ink-faint">Type (optional)</span>
              <Select
                value={mealType}
                onValueChange={(v) => setValue("mealType", v as TMealType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {MEAL_TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="space-y-1">
            <span className="text-eyebrow text-ink-faint">
              Per portion (optional)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Input
                {...register("caloriesPerPortion")}
                type="number"
                inputMode="numeric"
                placeholder="Calories"
                className="tabular-nums"
              />
              <Input
                {...register("proteinPerPortionG")}
                type="number"
                inputMode="decimal"
                placeholder="Protein (g)"
                className="tabular-nums"
              />
              <Input
                {...register("carbsPerPortionG")}
                type="number"
                inputMode="decimal"
                placeholder="Carbs (g)"
                className="tabular-nums"
              />
              <Input
                {...register("fatPerPortionG")}
                type="number"
                inputMode="decimal"
                placeholder="Fat (g)"
                className="tabular-nums"
              />
            </div>
          </div>

          <label className="block space-y-1">
            <span className="text-eyebrow text-ink-faint">
              Expires (optional)
            </span>
            <Input {...register("expiresAt")} type="date" />
          </label>

          <label className="block space-y-1">
            <span className="text-eyebrow text-ink-faint">Notes</span>
            <Textarea {...register("notes")} placeholder="…" rows={2} />
          </label>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create batch"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
