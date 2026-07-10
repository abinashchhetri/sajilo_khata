"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ReceivePaymentButton
// ─────────────────────────────────────────────────────────────────────────────
// Button that opens a form to create a Solana Pay payment request.
// Used on the accounts page and dashboard. Opens a form sheet first
// (amount + label + account selection) then opens the QR modal.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SolanaPayModal from "./SolanaPayModal";
import { useHandleCreatePaymentRequest } from "@/hooks/react-query/solana-pay/post-payment-request.hook";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import type { IPaymentRequestResponse } from "@/types/solana-pay/solana-pay.types";

const schema = z.object({
  amountUsdc: z.number().positive("Amount must be positive").max(100),
  label: z.string().min(1, "Label is required").max(100),
  accountId: z.string().uuid("Select an account").optional(),
});
type TForm = z.infer<typeof schema>;

interface Props {
  defaultAccountId?: string; // pre-select an account
}

const ReceivePaymentButton = ({ defaultAccountId }: Props) => {
  const [formOpen, setFormOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [paymentRequest, setPaymentRequest] = useState<IPaymentRequestResponse | null>(null);

  const { handleCreatePaymentRequest, isPending } = useHandleCreatePaymentRequest();
  const { accounts } = useGetAccounts();

  const form = useForm<TForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      amountUsdc: 0.01,
      label: "",
      accountId: defaultAccountId,
    },
  });

  const onSubmit = async (values: TForm) => {
    const result = await handleCreatePaymentRequest({
      amountUsdc: values.amountUsdc,
      label: values.label,
      accountId: values.accountId,
    });
    setPaymentRequest(result);
    setFormOpen(false);
    setQrOpen(true);
    form.reset();
  };

  return (
    <>
      <Button
        onClick={() => setFormOpen(true)}
        variant="outline"
        size="sm"
        className="border-purple-300 text-purple-700 hover:bg-purple-50"
      >
        <Zap className="h-4 w-4 mr-1.5 text-purple-500" />
        Receive via Solana
      </Button>

      {/* STEP 1: Amount + Label form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create Payment Request</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amountUsdc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (USDC)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is this for?</FormLabel>
                    <FormControl>
                      <Input placeholder="Coffee, lunch, split bill..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Log to account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts?.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Generating QR..." : "Generate QR Code"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* STEP 2: QR code + polling */}
      <SolanaPayModal
        isOpen={qrOpen}
        onClose={() => {
          setQrOpen(false);
          setPaymentRequest(null);
        }}
        paymentRequest={paymentRequest}
        isCreating={isPending}
      />
    </>
  );
};

export default ReceivePaymentButton;
