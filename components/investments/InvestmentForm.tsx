// ─────────────────────────────────────────────────────────────────────────────
// InvestmentForm
// ─────────────────────────────────────────────────────────────────────────────
// Handles both create and edit flows. Type-specific metadata fields are rendered
// conditionally based on the selected type.
//
// Internal schema is flat (all metadata fields optional at the form level,
// validated conditionally by superRefine) to avoid TypeScript discriminated-union
// incompatibilities with React Hook Form's Control type. The submit handler
// transforms flat values into the structured ICreateInvestment shape before
// calling onSubmit.
//
// In edit mode: type is locked; currentValue is hidden (UpdateValueDialog owns it).
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import type {
  IInvestment,
  ICreateInvestment,
  INepseMetadata,
  ISipMetadata,
  IFdMetadata,
} from "@/types/investments/investments.types";

// ─────── Internal flat schema ────────────────────────────────────────────────
// All metadata fields are optional at the schema level; superRefine enforces
// the right subset based on the selected type.

const FormSchema = z
  .object({
    type: z.enum(["nepse", "sip", "fd"] as const),
    name: z.string().trim().min(1, "Name is required"),
    investedAmount: z.coerce.number().positive("Must be greater than 0"),
    currentValue: z.coerce.number().min(0, "Must be 0 or greater").optional(),
    note: z.string().trim().optional(),
    // NEPSE
    scrip: z.string().trim().optional(),
    quantity: z.coerce.number().optional(),
    buyPricePerUnit: z.coerce.number().optional(),
    broker: z.string().trim().optional(),
    // SIP
    fundName: z.string().trim().optional(),
    monthlyAmount: z.coerce.number().optional(),
    unitsHeld: z.coerce.number().optional(),
    // FD
    bankName: z.string().trim().optional(),
    interestRate: z.coerce.number().optional(),
    maturityDate: z.string().optional(),
    principal: z.coerce.number().optional(),
  })
  .superRefine((data, ctx) => {
    const err = (message: string, path: string) =>
      ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: [path] });

    if (data.type === "nepse") {
      if (!data.scrip?.trim()) err("Scrip symbol is required", "scrip");
      if (!data.quantity || data.quantity <= 0)
        err("Quantity must be greater than 0", "quantity");
      if (!data.buyPricePerUnit || data.buyPricePerUnit <= 0)
        err("Buy price must be greater than 0", "buyPricePerUnit");
    } else if (data.type === "sip") {
      if (!data.fundName?.trim()) err("Fund name is required", "fundName");
      if (!data.monthlyAmount || data.monthlyAmount <= 0)
        err("Monthly amount must be greater than 0", "monthlyAmount");
    } else if (data.type === "fd") {
      if (!data.bankName?.trim()) err("Bank name is required", "bankName");
      if (!data.interestRate || data.interestRate <= 0)
        err("Interest rate must be greater than 0", "interestRate");
      if (!data.maturityDate) err("Maturity date is required", "maturityDate");
      if (!data.principal || data.principal <= 0)
        err("Principal must be greater than 0", "principal");
    }
  });

type TFormValues = z.infer<typeof FormSchema>;

// ─────── Helpers ─────────────────────────────────────────────────────────────

const toFormValues = (inv: IInvestment): TFormValues => {
  const base = {
    type: inv.type,
    name: inv.name,
    investedAmount: inv.investedAmount,
    note: inv.note ?? "",
  };
  if (inv.type === "nepse") {
    const m = inv.metadata as INepseMetadata;
    return {
      ...base,
      scrip: m.scrip,
      quantity: m.quantity,
      buyPricePerUnit: m.buyPricePerUnit,
      broker: m.broker ?? "",
    };
  }
  if (inv.type === "sip") {
    const m = inv.metadata as ISipMetadata;
    return { ...base, fundName: m.fundName, monthlyAmount: m.monthlyAmount, unitsHeld: m.unitsHeld };
  }
  const m = inv.metadata as IFdMetadata;
  return {
    ...base,
    bankName: m.bankName,
    interestRate: m.interestRate,
    maturityDate: m.maturityDate,
    principal: m.principal,
  };
};

const toCreateInvestment = (data: TFormValues): ICreateInvestment => {
  const base = {
    name: data.name,
    investedAmount: data.investedAmount,
    currentValue: data.currentValue ?? 0,
    ...(data.note ? { note: data.note } : {}),
  };
  if (data.type === "nepse") {
    return {
      ...base,
      type: "nepse",
      metadata: {
        scrip: data.scrip!,
        quantity: data.quantity!,
        buyPricePerUnit: data.buyPricePerUnit!,
        ...(data.broker ? { broker: data.broker } : {}),
      },
    };
  }
  if (data.type === "sip") {
    return {
      ...base,
      type: "sip",
      metadata: {
        fundName: data.fundName!,
        monthlyAmount: data.monthlyAmount!,
        ...(typeof data.unitsHeld === "number" ? { unitsHeld: data.unitsHeld } : {}),
      },
    };
  }
  return {
    ...base,
    type: "fd",
    metadata: {
      bankName: data.bankName!,
      interestRate: data.interestRate!,
      maturityDate: data.maturityDate!,
      principal: data.principal!,
    },
  };
};

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  mode: "create" | "edit";
  defaultInvestment?: IInvestment;
  onSubmit: (data: ICreateInvestment) => Promise<void>;
  isPending: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const InvestmentForm = ({
  mode,
  defaultInvestment,
  onSubmit,
  isPending,
}: Props) => {
  const form = useForm<TFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues:
      mode === "edit" && defaultInvestment
        ? toFormValues(defaultInvestment)
        : {
            type: "nepse",
            name: "",
            investedAmount: undefined,
            currentValue: undefined,
            note: "",
            scrip: "",
            quantity: undefined,
            buyPricePerUnit: undefined,
            broker: "",
          },
  });

  const type = form.watch("type");

  const handleTypeChange = (newType: TFormValues["type"]) => {
    form.setValue("type", newType);
    // Clear all metadata fields on type switch to avoid stale values
    form.resetField("scrip");
    form.resetField("quantity");
    form.resetField("buyPricePerUnit");
    form.resetField("broker");
    form.resetField("fundName");
    form.resetField("monthlyAmount");
    form.resetField("unitsHeld");
    form.resetField("bankName");
    form.resetField("interestRate");
    form.resetField("maturityDate");
    form.resetField("principal");
  };

  const handleSubmit = async (data: TFormValues) => {
    await onSubmit(toCreateInvestment(data));
    if (mode === "create") form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        {/* Type selector — locked in edit mode */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={(v) =>
                  handleTypeChange(v as TFormValues["type"])
                }
                value={field.value}
                disabled={mode === "edit"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="nepse">NEPSE</SelectItem>
                  <SelectItem value="sip">SIP</SelectItem>
                  <SelectItem value="fd">Fixed Deposit</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. NABIL shares" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Invested + Current (current hidden in edit — UpdateValueDialog owns it) */}
        <div className={mode === "create" ? "grid grid-cols-2 gap-3" : ""}>
          <FormField
            control={form.control}
            name="investedAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invested Amount</FormLabel>
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
          {mode === "create" && (
            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
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
          )}
        </div>

        {/* ── NEPSE metadata ── */}
        {type === "nepse" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="scrip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scrip</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. NABIL"
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        placeholder="0"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="buyPricePerUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Price / Unit</FormLabel>
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
              <FormField
                control={form.control}
                name="broker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Broker (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. NMB Capital"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {/* ── SIP metadata ── */}
        {type === "sip" && (
          <>
            <FormField
              control={form.control}
              name="fundName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fund Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. NIC Asia Growth Fund"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="monthlyAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Amount</FormLabel>
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
              <FormField
                control={form.control}
                name="unitsHeld"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units Held (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.001"
                        placeholder="0"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}

        {/* ── FD metadata ── */}
        {type === "fd" && (
          <>
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. NABIL Bank"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (%)</FormLabel>
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
              <FormField
                control={form.control}
                name="principal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Principal</FormLabel>
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
              name="maturityDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maturity Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Any additional notes…"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? mode === "create"
              ? "Adding…"
              : "Saving…"
            : mode === "create"
              ? "Add Investment"
              : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default InvestmentForm;
