// ─────────────────────────────────────────────────────────────────────────────
// AccountList
// ─────────────────────────────────────────────────────────────────────────────
// Renders a responsive grid of AccountCards. Shows EmptyState when the array
// is empty. Loading and error states are handled by the parent page.
// ─────────────────────────────────────────────────────────────────────────────

import { Wallet } from "lucide-react";

import AccountCard from "@/components/accounts/AccountCard";
import EmptyState from "@/components/shared/EmptyState";
import type { IAccount } from "@/types/accounts/accounts.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  accounts: IAccount[];
  onAddAccount?: () => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const AccountList = ({ accounts, onAddAccount }: Props) => {
  if (accounts.length === 0) {
    return (
      <EmptyState
        icon={<Wallet size={24} />}
        message="No accounts yet"
        description="Add a cash, bank, eSewa, or Khalti account to get started."
        ctaLabel="Add Account"
        onCta={onAddAccount}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};

export default AccountList;
