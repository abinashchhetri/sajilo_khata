// ─────────────────────────────────────────────────────────────────────────────
// UpdateValueDialog
// ─────────────────────────────────────────────────────────────────────────────
// Focused dialog for updating currentValue only.
// This is a deliberate, distinct action — the backend creates a history snapshot
// on every value update, so it must never be folded into general editing.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formatCurrency } from "@/utils/format.utils";
import { useHandleUpdateInvestmentValue } from "@/hooks/react-query/investments/update-investment.hook";
import type { IInvestment } from "@/types/investments/investments.types";

// ─────── Schema ──────────────────────────────────────────────────────────────

const UpdateValueSchema = z.object({
  currentValue: z.coerce.number().min(0, "Value must be 0 or greater"),
});

type TUpdateValue = z.infer<typeof UpdateValueSchema>;

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  investment: IInvestment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const UpdateValueDialog = ({ investment, open, onOpenChange }: Props) => {
  const { handleUpdateInvestmentValue, isPending } =
    useHandleUpdateInvestmentValue();

  const form = useForm<TUpdateValue>({
    resolver: zodResolver(UpdateValueSchema),
    defaultValues: { currentValue: investment.currentValue },
  });

  const handleSubmit = async (data: TUpdateValue) => {
    await handleUpdateInvestmentValue({
      investmentId: investment.id,
      body: { currentValue: data.currentValue },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Update Value</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {investment.name} · was {formatCurrency(investment.currentValue)}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Current Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      autoFocus
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateValueDialog;
