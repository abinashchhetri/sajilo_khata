// Quick-add meal dialog with voice support

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mic } from "lucide-react";
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
import { useHoldToRecord } from "@/hooks/voice/use-hold-to-record.hook";
import { MealLogSchema, type TMealLogForm } from "@/lib/validations/meal-log.validation";
import { parseMealVoice } from "@/utils/meal-voice-parser.utils";
import { useHandleCreateMealLog } from "@/hooks/react-query/meals/post-meal-log.hook";

interface QuickAddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAddMealDialog({
  open,
  onOpenChange,
}: QuickAddMealDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<TMealLogForm>({
    resolver: zodResolver(MealLogSchema),
  });

  const { handleCreate, isPending } = useHandleCreateMealLog();
  const { transcript, isRecording, startRecording, stopRecording } =
    useHoldToRecord({
      onTranscriptReady: (text) => {
        const parsed = parseMealVoice(text);
        setValue("name", parsed.name);
        if (parsed.calories !== null) {
          setValue("calories", parsed.calories);
        }
      },
    });

  const handleFormSubmit = async (data: TMealLogForm) => {
    await handleCreate({
      ...data,
      source: "freeform",
      entryMethod: isRecording ? "voice" : "form",
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Meal</DialogTitle>
          <DialogDescription>
            Add a meal quickly or use your voice
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Meal Name</Label>
            <div className="flex gap-2">
              <Input
                {...register("name")}
                placeholder="Chicken rice..."
                autoFocus
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                disabled={isPending}
                title={isRecording ? "Recording..." : "Hold to record"}
              >
                <Mic size={16} />
              </Button>
            </div>
            {transcript && (
              <p className="text-xs text-muted-foreground mt-1">
                Heard: {transcript}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="mealType">Meal Type (optional)</Label>
            <Select
              defaultValue=""
              onValueChange={(value) =>
                setValue(
                  "mealType",
                  value as "breakfast" | "lunch" | "dinner" | "snack" | undefined
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
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

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                {...register("calories")}
                type="number"
                placeholder="350"
              />
            </div>
            <div>
              <Label htmlFor="proteinG">Protein (g)</Label>
              <Input
                {...register("proteinG")}
                type="number"
                placeholder="25"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="carbsG">Carbs (g)</Label>
              <Input {...register("carbsG")} type="number" placeholder="45" />
            </div>
            <div>
              <Label htmlFor="fatG">Fat (g)</Label>
              <Input {...register("fatG")} type="number" placeholder="12" />
            </div>
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
              {isSubmitting ? "Adding..." : "Add Meal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
