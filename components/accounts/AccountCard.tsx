// ─────────────────────────────────────────────────────────────────────────────
// AccountCard
// ─────────────────────────────────────────────────────────────────────────────
// Displays a single account's name, type icon, live balance, and status badges.
// Archived accounts are rendered with reduced opacity and a muted style to
// signal they are inactive without hiding them from the list.
// Clicking the card navigates to the account detail page.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import AccountTypeIcon from "@/components/accounts/AccountTypeIcon";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format.utils";
import { ROUTES } from "@/lib/constants/routes.constants";
import { EAccountType } from "@/types/global.types";
import type { IAccount } from "@/types/accounts/accounts.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  account: IAccount;
}

// ─────── Component ───────────────────────────────────────────────────────────

const ACCOUNT_TYPE_LABEL: Record<EAccountType, string> = {
  [EAccountType.CASH]: "Cash",
  [EAccountType.BANK]: "Bank",
  [EAccountType.ESEWA]: "eSewa",
  [EAccountType.KHALTI]: "Khalti",
};

const AccountCard = ({ account }: Props) => {
  const { id, name, type, currentBalance, isDefault, isArchived } = account;

  return (
    <Link href={ROUTES.ACCOUNT_DETAIL(id)} className="block">
      <Card
        className={cn(
          "transition-shadow hover:shadow-md",
          // Archived accounts are de-emphasized but remain visible
          isArchived && "opacity-60 grayscale",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            {/* Left: icon + name + type */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <AccountTypeIcon type={type} size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">
                  {ACCOUNT_TYPE_LABEL[type]}
                </p>
              </div>
            </div>

            {/* Right: badges */}
            <div className="flex shrink-0 flex-col items-end gap-1">
              {isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Star size={10} />
                  Default
                </span>
              )}
              {isArchived && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Archived
                </span>
              )}
            </div>
          </div>

          {/* Balance */}
          <p
            className={cn(
              "mt-3 text-title tabular-nums",
              currentBalance < 0 && "text-destructive",
            )}
          >
            {formatCurrency(currentBalance)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AccountCard;
