// ─────────────────────────────────────────────────────────────────────────────
// InvestmentTypeTabs
// ─────────────────────────────────────────────────────────────────────────────
// Pill-style switcher for filtering investments by type.
// "All" passes undefined to the hook so no type filter is sent to the backend.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";
import type { TInvestmentType } from "@/types/investments/investments.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  activeType: TInvestmentType | "all";
  onChange: (type: TInvestmentType | "all") => void;
}

// ─────── Config ──────────────────────────────────────────────────────────────

const TABS: { label: string; value: TInvestmentType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "NEPSE", value: "nepse" },
  { label: "SIP", value: "sip" },
  { label: "FD", value: "fd" },
];

// ─────── Component ───────────────────────────────────────────────────────────

const InvestmentTypeTabs = ({ activeType, onChange }: Props) => {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {TABS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            activeType === value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default InvestmentTypeTabs;
