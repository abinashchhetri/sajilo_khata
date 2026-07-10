// ─────────────────────────────────────────────────────────────────────────────
// Accounts Page
// ─────────────────────────────────────────────────────────────────────────────
// Lists all accounts for the current user. Includes a toggle to show/hide
// archived accounts and a dialog to add a new account.
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
import AccountList from "@/components/accounts/AccountList";
import AccountForm from "@/components/accounts/AccountForm";
import ReceivePaymentButton from "@/components/solana-pay/ReceivePaymentButton";
import Loader from "@/components/shared/Loader";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import { useHandleCreateAccount } from "@/hooks/react-query/accounts/post-account.hook";
import type { TCreateAccount } from "@/lib/validations/create-account.validation";

// ─────── Component ───────────────────────────────────────────────────────────

const AccountsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(true);

  const { accounts, isLoading } = useGetAccounts(
    showArchived ? { includeArchived: true } : undefined,
  );
  const { handleCreateAccount, isPending } = useHandleCreateAccount();

  const handleSubmit = async (data: TCreateAccount) => {
    await handleCreateAccount(data);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-foreground">Accounts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your cash, bank, eSewa, and Khalti accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowArchived((prev) => !prev)}
          >
            {showArchived ? "Hide Archived" : "Show Archived"}
          </Button>
          <ReceivePaymentButton />
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} />
            Add Account
          </Button>
        </div>
      </div>

      {/* Account list */}
      {isLoading ? (
        <Loader label="Loading accounts…" className="py-16" />
      ) : (
        <AccountList
          accounts={accounts ?? []}
          onAddAccount={() => setIsCreateOpen(true)}
        />
      )}

      {/* Add account dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
          </DialogHeader>
          <AccountForm
            mode="create"
            onSubmit={handleSubmit}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountsPage;
