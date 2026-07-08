// Quick-add meal dialog. Free-form log with optional macros and hold-to-talk
// voice capture (reuses useHoldToRecord + parseMealVoice).

"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useHoldToRecord } from "@/hooks/voice/use-hold-to-record.hook";
import {
  MealLogSchema,
  type TMealLogForm,
} from "@/lib/validations/meal-log.validation";
import { parseMealVoice } from "@/utils/meal-voice-parser.utils";
import { MEAL_TYPE_LABEL } from "@/utils/health-format.utils";
import { useHandleCreateMealLog } from "@/hooks/react-query/meals/post-meal-log.hook";
import type { TMealType } from "@/types/nutrition/meals.types";

const MEAL_TYPES: TMealType[] = ["breakfast", "lunch", "dinner", "snack"];

interface QuickAddMealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAddMealDialog({
  open,
  onOpenChange,
}: QuickAddMealDialogProps) {
  const [usedVoice, setUsedVoice] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TMealLogForm>({
    resolver: zodResolver(MealLogSchema),
  });

  const mealType = watch("mealType");
  const { handleCreate, isPending } = useHandleCreateMealLog();

  const { transcript, isRecording, isSupported, startRecording, stopRecording } =
    useHoldToRecord({
      onTranscriptReady: (text) => {
        const parsed = parseMealVoice(text);
        setValue("name", parsed.name);
        if (parsed.calories !== null) setValue("calories", parsed.calories);
        setUsedVoice(true);
      },
    });

  const close = () => {
    reset();
    setUsedVoice(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: TMealLogForm) => {
    await handleCreate({
      ...data,
      source: "freeform",
      entryMethod: usedVoice ? "voice" : "form",
    });
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : close())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick add meal</DialogTitle>
          <DialogDescription>
            Log something you ate — macros are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-eyebrow text-ink-faint">Meal</span>
            <div className="flex gap-2">
              <Input
                {...register("name")}
                placeholder="Chicken & rice…"
                autoFocus
              />
              {isSupported && (
                <button
                  type="button"
                  onPointerDown={startRecording}
                  onPointerUp={stopRecording}
                  onPointerLeave={stopRecording}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isRecording
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-hairline bg-canvas text-ink-muted hover:bg-muted",
                  )}
                  aria-label="Hold to record"
                  title="Hold to talk"
                >
                  <Mic size={15} />
                </button>
              )}
            </div>
            {errors.name && (
              <span className="text-caption text-destructive">
                {errors.name.message}
              </span>
            )}
            {isRecording && (
              <span className="text-caption text-primary">Listening…</span>
            )}
            {!isRecording && transcript && (
              <span className="text-caption text-ink-faint">
                Heard: “{transcript}”
              </span>
            )}
          </label>

          <label className="block space-y-1">
            <span className="text-eyebrow text-ink-faint">Type (optional)</span>
            <Select
              value={mealType}
              onValueChange={(v) => setValue("mealType", v as TMealType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a meal type" />
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

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-eyebrow text-ink-faint">Calories</span>
              <Input
                {...register("calories")}
                type="number"
                inputMode="numeric"
                placeholder="350"
                className="tabular-nums"
              />
            </label>
            <label className="space-y-1">
              <span className="text-eyebrow text-ink-faint">Protein (g)</span>
              <Input
                {...register("proteinG")}
                type="number"
                inputMode="decimal"
                placeholder="25"
                className="tabular-nums"
              />
            </label>
            <label className="space-y-1">
              <span className="text-eyebrow text-ink-faint">Carbs (g)</span>
              <Input
                {...register("carbsG")}
                type="number"
                inputMode="decimal"
                placeholder="45"
                className="tabular-nums"
              />
            </label>
            <label className="space-y-1">
              <span className="text-eyebrow text-ink-faint">Fat (g)</span>
              <Input
                {...register("fatG")}
                type="number"
                inputMode="decimal"
                placeholder="12"
                className="tabular-nums"
              />
            </label>
          </div>

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
              {isPending ? "Adding…" : "Add meal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
