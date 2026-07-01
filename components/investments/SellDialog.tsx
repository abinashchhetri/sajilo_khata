// ─────────────────────────────────────────────────────────────────────────────
// SellDialog
// ─────────────────────────────────────────────────────────────────────────────
// Records a partial or full sale of a NEPSE holding. Quantity is capped at the
// shares currently held (metadata.quantity) — selling more than that is not a
// valid transaction. Brokerage fee is optional and only affects net proceeds
// shown for context; it is sent through as-is for the backend to factor into
// realized gain/loss, which this dialog never computes itself.
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
import { useHandleCreateInvestmentTransaction } from "@/hooks/react-query/investments/post-investment-transaction.hook";
import type { IInvestment, INepseMetadata } from "@/types/investments/investments.types";

// ─────── Schema ──────────────────────────────────────────────────────────────

const buildSellSchema = (availableQuantity: number) =>
  z.object({
    quantity: z.coerce
      .number()
      .positive("Must be greater than 0")
      .max(availableQuantity, `Cannot sell more than ${availableQuantity} shares`),
    pricePerUnit: z.coerce.number().positive("Must be greater than 0"),
    brokerageFee: z.coerce.number().min(0, "Must be 0 or greater").optional(),
  });

type TSellValues = z.infer<ReturnType<typeof buildSellSchema>>;

const todayInputValue = () => new Date().toISOString().slice(0, 10);

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  investment: IInvestment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const SellDialog = ({ investment, open, onOpenChange }: Props) => {
  const availableQuantity = (investment.metadata as INepseMetadata).quantity;
  const { handleCreateInvestmentTransaction, isPending } =
    useHandleCreateInvestmentTransaction(investment.id);

  const form = useForm<TSellValues>({
    resolver: zodResolver(buildSellSchema(availableQuantity)),
    defaultValues: {
      quantity: undefined,
      pricePerUnit: undefined,
      brokerageFee: undefined,
    },
  });

  const quantity = form.watch("quantity");
  const pricePerUnit = form.watch("pricePerUnit");
  const brokerageFee = form.watch("brokerageFee");
  const grossProceeds = (quantity || 0) * (pricePerUnit || 0);
  const netProceeds = grossProceeds - (brokerageFee || 0);

  const handleSubmit = async (data: TSellValues) => {
    await handleCreateInvestmentTransaction({
      transactionType: "sell",
      quantity: data.quantity,
      pricePerUnit: data.pricePerUnit,
      date: todayInputValue(),
      ...(data.brokerageFee ? { brokerageFee: data.brokerageFee } : {}),
    });
    form.reset({ quantity: undefined, pricePerUnit: undefined, brokerageFee: undefined });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Sell Shares</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {investment.name} · you hold {availableQuantity} shares
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity to Sell</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={availableQuantity}
                        step="1"
                        placeholder="0"
                        autoFocus
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sell Price / Unit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="brokerageFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brokerage Fee (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {grossProceeds > 0 && (
              <div className="rounded-lg bg-muted/50 p-3 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Gross proceeds</span>
                  <span className="tabular-nums">{formatCurrency(grossProceeds)}</span>
                </div>
                <div className="mt-1 flex justify-between font-semibold">
                  <span>Net proceeds</span>
                  <span className="tabular-nums">{formatCurrency(netProceeds)}</span>
                </div>
              </div>
            )}

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
                {isPending ? "Selling…" : "Confirm Sale"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SellDialog;
