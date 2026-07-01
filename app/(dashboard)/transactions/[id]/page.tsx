"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import TransactionHeader from "@/components/transactions/TransactionHeader";
import LineItemsList from "@/components/transactions/LineItemsList";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Loader from "@/components/shared/Loader";
import { useGetTransaction } from "@/hooks/react-query/transactions/get-transaction.hook";
import { useHandleUpdateTransaction } from "@/hooks/react-query/transactions/update-transaction.hook";
import { useHandleDeleteTransaction } from "@/hooks/react-query/transactions/delete-transaction.hook";
import { useGetCategories } from "@/hooks/react-query/categories/get-categories.hook";
import { formatDate } from "@/utils/date.utils";
import { formatCurrency } from "@/utils/format.utils";
import { ROUTES } from "@/lib/constants/routes.constants";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ICategory } from "@/types/categories/categories.types";

// ─────── Edit schema (note + category only) ──────────────────────────────────

const EditSchema = z.object({
  note: z.string().trim().optional(),
  categoryId: z.string().optional(),
});
type TEditFields = z.infer<typeof EditSchema>;

const NO_CATEGORY = "_none_";

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { transaction, isLoading } = useGetTransaction(id);
  const { categories } = useGetCategories();
  const { handleUpdateTransaction, isPending: isUpdating } =
    useHandleUpdateTransaction();
  const { handleDeleteTransaction, isPending: isDeleting } =
    useHandleDeleteTransaction();

  const form = useForm<TEditFields>({
    resolver: zodResolver(EditSchema),
    values: {
      note: transaction?.note ?? "",
      categoryId: transaction?.category?.id ?? NO_CATEGORY,
    },
  });

  if (isLoading) {
    return <Loader label="Loading transaction…" className="py-32" />;
  }

  if (!transaction) {
    return (
      <div className="py-32 text-center text-sm text-muted-foreground">
        Transaction not found.
      </div>
    );
  }

  const handleEdit = form.handleSubmit(async (values) => {
    await handleUpdateTransaction({
      transactionId: id,
      body: {
        note: values.note || undefined,
        categoryId:
          values.categoryId === NO_CATEGORY ? null : values.categoryId,
      },
    });
    setIsEditOpen(false);
  });

  const handleDelete = async () => {
    await handleDeleteTransaction(id);
    router.push(ROUTES.TRANSACTIONS);
  };

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <button
        onClick={() => router.push(ROUTES.TRANSACTIONS)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        All Transactions
      </button>

      {/* Summary card */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <TransactionHeader transaction={transaction} />

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 border-t pt-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(transaction.transactedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="font-medium tabular-nums">
                {formatCurrency(transaction.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Entry Method</p>
              <p className="font-medium capitalize">{transaction.entryMethod}</p>
            </div>
            {transaction.note && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Note</p>
                <p className="font-medium italic">{transaction.note}</p>
              </div>
            )}
          </div>

          {/* Line items */}
          {transaction.lineItems.length > 0 && (
            <LineItemsList items={transaction.lineItems} />
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil size={14} />
          Edit Note / Category
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash2 size={14} />
          Delete
        </Button>
      </div>

      {/* Edit dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleEdit} className="space-y-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? NO_CATEGORY}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="No category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NO_CATEGORY}>No category</SelectItem>
                        {categories.map((c: ICategory) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Note{" "}
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. lunch with team"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUpdating} className="w-full">
                {isUpdating ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete transaction?"
        description="This will permanently remove the transaction and reverse the effect on your account balance. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default TransactionDetailPage;
