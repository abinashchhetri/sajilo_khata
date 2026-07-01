// ─────────────────────────────────────────────────────────────────────────────
// AccountForm
// ─────────────────────────────────────────────────────────────────────────────
// Shared form for creating and editing accounts.
// In edit mode: the type select is disabled (type is immutable after creation)
// and the initial balance field is hidden (balance is derived from transactions).
// The onSubmit callback is provided by the parent so the form itself has no
// knowledge of whether it's creating or updating.
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
import {
  CreateAccountSchema,
  type TCreateAccount,
} from "@/lib/validations/create-account.validation";
import { EAccountType, type TAccountType } from "@/types/global.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  mode: "create" | "edit";
  defaultValues?: {
    name?: string;
    type?: TAccountType;
  };
  onSubmit: (data: TCreateAccount) => Promise<void>;
  isPending: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const AccountForm = ({ mode, defaultValues, onSubmit, isPending }: Props) => {
  const form = useForm<TCreateAccount>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? EAccountType.CASH,
      initialBalance: 0,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    if (mode === "create") form.reset();
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Savings Account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account type — immutable after creation */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={mode === "edit"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EAccountType.CASH}>Cash</SelectItem>
                  <SelectItem value={EAccountType.BANK}>Bank</SelectItem>
                  <SelectItem value={EAccountType.ESEWA}>eSewa</SelectItem>
                  <SelectItem value={EAccountType.KHALTI}>Khalti</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Initial balance — create mode only */}
        {mode === "create" && (
          <FormField
            control={form.control}
            name="initialBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Balance (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? mode === "create"
              ? "Adding…"
              : "Saving…"
            : mode === "create"
              ? "Add Account"
              : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
