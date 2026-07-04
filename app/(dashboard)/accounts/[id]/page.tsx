// ─────────────────────────────────────────────────────────────────────────────
// Account Detail Page
// ─────────────────────────────────────────────────────────────────────────────
// Shows a single account's details with actions: edit name, set as default,
// archive/unarchive, and delete. Delete is gated by ConfirmDialog — the backend
// will reject it if the account has existing transactions and the hook surfaces
// TOAST_MESSAGES.ACCOUNTS.DELETE_BLOCKED in that case.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, Archive, ArchiveX, Trash2, Pencil, ArrowLeftRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AccountTypeIcon from "@/components/accounts/AccountTypeIcon";
import AccountForm from "@/components/accounts/AccountForm";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Loader from "@/components/shared/Loader";
import { useGetAccount } from "@/hooks/react-query/accounts/get-account.hook";
import { useHandleUpdateAccount } from "@/hooks/react-query/accounts/update-account.hook";
import { useHandleDeleteAccount } from "@/hooks/react-query/accounts/delete-account.hook";
import { formatCurrency } from "@/utils/format.utils";
import { formatDate } from "@/utils/date.utils";
import { ROUTES } from "@/lib/constants/routes.constants";
import { EAccountType } from "@/types/global.types";
import type { TCreateAccount } from "@/lib/validations/create-account.validation";

// ─────── Component ───────────────────────────────────────────────────────────

const ACCOUNT_TYPE_LABEL: Record<EAccountType, string> = {
  [EAccountType.CASH]: "Cash",
  [EAccountType.BANK]: "Bank",
  [EAccountType.ESEWA]: "eSewa",
  [EAccountType.KHALTI]: "Khalti",
};

const AccountDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { account, isLoading } = useGetAccount(id);
  const { handleUpdateAccount, isPending: isUpdating } =
    useHandleUpdateAccount();
  const { handleDeleteAccount, isPending: isDeleting } =
    useHandleDeleteAccount();

  if (isLoading) {
    return <Loader label="Loading account…" className="py-32" />;
  }

  if (!account) {
    return (
      <div className="py-32 text-center text-sm text-muted-foreground">
        Account not found.
      </div>
    );
  }

  const handleEdit = async (data: TCreateAccount, voiceKeywords: string[]) => {
    await handleUpdateAccount({ accountId: id, body: { name: data.name, voiceKeywords } });
    setIsEditOpen(false);
  };

  const handleSetDefault = async () => {
    await handleUpdateAccount({ accountId: id, body: { isDefault: true } });
  };

  const handleArchiveToggle = async () => {
    await handleUpdateAccount({
      accountId: id,
      body: { isArchived: !account.isArchived },
    });
    setIsArchiveOpen(false);
  };

  const handleDelete = async () => {
    await handleDeleteAccount(id);
    router.push(ROUTES.ACCOUNTS);
  };

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <button
        onClick={() => router.push(ROUTES.ACCOUNTS)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={15} />
        All Accounts
      </button>

      {/* Account header card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <AccountTypeIcon type={account.type} size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-title text-foreground">{account.name}</h2>
                  {account.isDefault && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <Star size={10} />
                      Default
                    </span>
                  )}
                  {account.isArchived && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Archived
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {ACCOUNT_TYPE_LABEL[account.type]}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Created {formatDate(account.createdAt)}
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Balance</p>
              <p
                className={
                  account.currentBalance < 0
                    ? "text-heading-2 text-destructive tabular-nums"
                    : "text-heading-2 text-foreground tabular-nums"
                }
              >
                {formatCurrency(account.currentBalance)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.TRANSFERS}>
            <ArrowLeftRight size={14} />
            Transfers
          </Link>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil size={14} />
          Edit Name
        </Button>

        {!account.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetDefault}
            disabled={isUpdating}
          >
            <Star size={14} />
            Set as Default
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            account.isArchived
              ? handleArchiveToggle()
              : setIsArchiveOpen(true)
          }
          disabled={isUpdating}
        >
          {account.isArchived ? (
            <>
              <ArchiveX size={14} />
              Unarchive
            </>
          ) : (
            <>
              <Archive size={14} />
              Archive
            </>
          )}
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

      {/* Edit name dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
          </DialogHeader>
          <AccountForm
            mode="edit"
            defaultValues={{ name: account.name, type: account.type }}
            defaultVoiceKeywords={account.voiceKeywords ?? []}
            onSubmit={handleEdit}
            isPending={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Archive confirm dialog */}
      <ConfirmDialog
        open={isArchiveOpen}
        onOpenChange={setIsArchiveOpen}
        title="Archive account?"
        description="Archived accounts are still visible in the list but won't appear in the default account picker or transaction forms. You can unarchive it at any time."
        confirmLabel="Archive"
        onConfirm={handleArchiveToggle}
        isPending={isUpdating}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete account?"
        description="This action cannot be undone. Accounts with existing transactions cannot be deleted — archive it instead."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default AccountDetailPage;
