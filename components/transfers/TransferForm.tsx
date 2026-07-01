// ─────────────────────────────────────────────────────────────────────────────
// TransferForm
// ─────────────────────────────────────────────────────────────────────────────
// Form for creating a transfer between two of the user's own accounts.
//
// Same-account guard: the .refine() on CreateTransferSchema catches this at
// the Zod level so the request never fires. The From select also excludes the
// currently selected To account, and vice versa, as a visual hint.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import {
  CreateTransferSchema,
  type TCreateTransfer,
} from "@/lib/validations/create-transfer.validation";
import type { IAccount } from "@/types/accounts/accounts.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  onSubmit: (data: TCreateTransfer) => Promise<void>;
  isPending: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const TransferForm = ({ onSubmit, isPending }: Props) => {
  const { accounts } = useGetAccounts();
  const activeAccounts = (accounts ?? []).filter((a: IAccount) => !a.isArchived);

  const form = useForm<TCreateTransfer>({
    resolver: zodResolver(CreateTransferSchema),
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: undefined,
      note: "",
    },
  });

  const fromAccountId = form.watch("fromAccountId");
  const toAccountId = form.watch("toAccountId");

  const handleSubmit = async (data: TCreateTransfer) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* From account — excludes whichever account is selected as To */}
        <FormField
          control={form.control}
          name="fromAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>From</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeAccounts
                    .filter((a: IAccount) => a.id !== toAccountId)
                    .map((a: IAccount) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* To account — excludes whichever account is selected as From */}
        <FormField
          control={form.control}
          name="toAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {activeAccounts
                    .filter((a: IAccount) => a.id !== fromAccountId)
                    .map((a: IAccount) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
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

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. rent payment" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Transferring…" : "Transfer"}
        </Button>
      </form>
    </Form>
  );
};

export default TransferForm;
