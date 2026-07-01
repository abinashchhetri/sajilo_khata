// ─────────────────────────────────────────────────────────────────────────────
// TransactionForm
// ─────────────────────────────────────────────────────────────────────────────
// Manual transaction entry form. Three modes driven by the type select:
//   expense / income  → dynamic line-items field array (useFieldArray)
//   in_transit        → single totalAmount field, no line items
// The Zod .refine() enforces this split so both paths share one schema.
// totalAmount and category are always computed server-side — the form never
// lets the user enter a total for expense/income or pick a category.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateTransactionSchema,
  type TCreateTransaction,
} from "@/lib/validations/create-transaction.validation";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import type { IAccount } from "@/types/accounts/accounts.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  onSubmit: (data: TCreateTransaction) => Promise<void>;
  isPending: boolean;
  defaultAccountId?: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionForm = ({ onSubmit, isPending, defaultAccountId }: Props) => {
  const { accounts } = useGetAccounts();
  const activeAccounts = (accounts ?? []).filter((a: IAccount) => !a.isArchived);

  const defaultAccount =
    activeAccounts.find((a: IAccount) => a.isDefault) ?? activeAccounts[0];

  const form = useForm<TCreateTransaction>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      accountId: defaultAccountId ?? defaultAccount?.id ?? "",
      type: "expense",
      lineItems: [{ name: "", amount: 0 }],
      totalAmount: undefined,
      note: "",
      transactedAt: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const selectedType = form.watch("type");
  const isLineItemMode = selectedType !== "in_transit";

  // When defaultAccount resolves after initial render, backfill accountId if empty
  useEffect(() => {
    if (!form.getValues("accountId") && defaultAccount?.id) {
      form.setValue("accountId", defaultAccount.id);
    }
  }, [defaultAccount, form]);

  // Reset conditional fields when type switches so stale values don't leak
  useEffect(() => {
    if (selectedType === "in_transit") {
      form.setValue("lineItems", []);
      form.clearErrors("lineItems");
    } else {
      form.setValue("totalAmount", undefined);
      form.clearErrors("totalAmount");
      if (form.getValues("lineItems")?.length === 0) {
        form.setValue("lineItems", [{ name: "", amount: 0 }]);
      }
    }
  }, [selectedType, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.reset({
      accountId: values.accountId,
      type: "expense",
      lineItems: [{ name: "", amount: 0 }],
      totalAmount: undefined,
      note: "",
      transactedAt: format(new Date(), "yyyy-MM-dd"),
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account */}
        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeAccounts.map((account: IAccount) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Line items — expense / income only */}
        {isLineItemMode && (
          <div className="space-y-2">
            <p className="text-sm font-medium leading-none">Items</p>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.name`}
                  render={({ field: f }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Item name" {...f} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`lineItems.${index}.amount`}
                  render={({ field: f }) => (
                    <FormItem className="w-28">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          step="0.01"
                          {...f}
                          onChange={(e) =>
                            f.onChange(e.target.valueAsNumber || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-0 h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}

            {/* Validation error for the whole lineItems array (from .refine) */}
            {form.formState.errors.lineItems?.root?.message && (
              <p className="text-xs text-destructive">
                {form.formState.errors.lineItems.root.message}
              </p>
            )}
            {typeof form.formState.errors.lineItems?.message === "string" && (
              <p className="text-xs text-destructive">
                {form.formState.errors.lineItems.message}
              </p>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => append({ name: "", amount: 0 })}
            >
              <Plus size={14} />
              Add Item
            </Button>
          </div>
        )}

        {/* Total amount — in_transit only */}
        {!isLineItemMode && (
          <FormField
            control={form.control}
            name="totalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    min={0}
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Date */}
        <FormField
          control={form.control}
          name="transactedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Note{" "}
                <span className="text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g. lunch with team" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving…" : "Save Transaction"}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;
