// Prep batch creation dialog

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MealPrepSchema, type TMealPrepForm } from "@/lib/validations/meal-prep.validation";
import { useHandleCreatePrep } from "@/hooks/react-query/meals/post-prep.hook";

interface PrepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrepFormDialog({
  open,
  onOpenChange,
}: PrepFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TMealPrepForm>({
    resolver: zodResolver(MealPrepSchema),
  });

  const { handleCreate, isPending } = useHandleCreatePrep();

  const handleFormSubmit = async (data: TMealPrepForm) => {
    await handleCreate(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Prep Batch</DialogTitle>
          <DialogDescription>
            Create a new meal prep batch
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Batch Name</Label>
            <Input
              {...register("name")}
              placeholder="Grilled chicken breasts"
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="mealType">Meal Type (optional)</Label>
            <Select
              onValueChange={(value) =>
                register("mealType").onChange({
                  target: {
                    value: value as "breakfast" | "lunch" | "dinner" | "snack" | "",
                  },
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="–" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">–</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="totalPortions">Total Portions</Label>
            <Input
              {...register("totalPortions")}
              type="number"
              placeholder="5"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground block mb-2">
              Per Portion (all optional)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                {...register("caloriesPerPortion")}
                type="number"
                placeholder="Calories"
              />
              <Input
                {...register("proteinPerPortionG")}
                type="number"
                placeholder="Protein (g)"
              />
              <Input
                {...register("carbsPerPortionG")}
                type="number"
                placeholder="Carbs (g)"
              />
              <Input
                {...register("fatPerPortionG")}
                type="number"
                placeholder="Fat (g)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="expiresAt">Expires (optional)</Label>
            <Input {...register("expiresAt")} type="date" />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea {...register("notes")} placeholder="..." rows={2} />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isPending}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
