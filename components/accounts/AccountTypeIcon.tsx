// ─────────────────────────────────────────────────────────────────────────────
// AccountTypeIcon
// ─────────────────────────────────────────────────────────────────────────────
// Maps each account type to a lucide-react icon and a brand-adjacent color.
// Used in AccountCard and the account detail header. Does not render text —
// pair with a label if the icon alone is not enough context.
// ─────────────────────────────────────────────────────────────────────────────

import { Wallet, Landmark, Smartphone, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { EAccountType, type TAccountType } from "@/types/global.types";

// ─────── Config ──────────────────────────────────────────────────────────────

const ACCOUNT_TYPE_CONFIG: Record<
  TAccountType,
  { icon: LucideIcon; className: string }
> = {
  [EAccountType.CASH]: { icon: Wallet, className: "text-accent-green" },
  [EAccountType.BANK]: { icon: Landmark, className: "text-accent-sky" },
  [EAccountType.ESEWA]: { icon: Smartphone, className: "text-accent-teal" },
  [EAccountType.KHALTI]: { icon: CreditCard, className: "text-accent-purple-deep" },
};

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  type: TAccountType;
  size?: number;
  className?: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const AccountTypeIcon = ({ type, size = 18, className }: Props) => {
  const config = ACCOUNT_TYPE_CONFIG[type];
  if (!config) return null;
  const { icon: Icon, className: colorClass } = config;

  return <Icon size={size} className={cn(colorClass, className)} />;
};

export default AccountTypeIcon;
