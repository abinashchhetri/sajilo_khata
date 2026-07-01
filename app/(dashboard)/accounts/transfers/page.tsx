// ─────────────────────────────────────────────────────────────────────────────
// Transfers Page
// ─────────────────────────────────────────────────────────────────────────────
// Lists all transfers and lets the user create new ones.
// Nested under /accounts since a transfer is an accounts-level operation.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransferList from "@/components/transfers/TransferList";
import TransferForm from "@/components/transfers/TransferForm";
import { useHandleCreateTransfer } from "@/hooks/react-query/transfers/post-transfer.hook";
import type { TCreateTransfer } from "@/lib/validations/create-transfer.validation";

// ─────── Component ───────────────────────────────────────────────────────────

const TransfersPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { handleCreateTransfer, isPending } = useHandleCreateTransfer();

  const handleSubmit = async (data: TCreateTransfer) => {
    await handleCreateTransfer(data);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-foreground">Transfers</h1>
          <p className="text-sm text-muted-foreground">
            Move money between your own accounts
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          New Transfer
        </Button>
      </div>

      {/* Transfer list */}
      <TransferList />

      {/* New transfer dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Transfer</DialogTitle>
          </DialogHeader>
          <TransferForm onSubmit={handleSubmit} isPending={isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransfersPage;
