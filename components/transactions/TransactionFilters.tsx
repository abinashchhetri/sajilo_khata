"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetAccounts } from "@/hooks/react-query/accounts/get-accounts.hook";
import { useGetCategories } from "@/hooks/react-query/categories/get-categories.hook";
import type { IAccount } from "@/types/accounts/accounts.types";
import type { ICategory } from "@/types/categories/categories.types";
import type { TTransactionType, IFindAllTransactionsParams } from "@/types/transactions/transactions.types";

// ─────── Types ───────────────────────────────────────────────────────────────

export interface TransactionFilterState {
  accountId?: string;
  type?: TTransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

interface Props {
  filters: TransactionFilterState;
  onChange: (filters: TransactionFilterState) => void;
  onReset: () => void;
}

const ALL_VALUE = "_all_";

// ─────── Component ───────────────────────────────────────────────────────────

const TransactionFilters = ({ filters, onChange, onReset }: Props) => {
  const { accounts } = useGetAccounts();
  const { categories } = useGetCategories();

  const activeAccounts = (accounts ?? []).filter((a: IAccount) => !a.isArchived);

  const patch = (key: keyof TransactionFilterState, value: string | undefined) =>
    onChange({ ...filters, [key]: value });

  const fromSelect =
    (key: keyof TransactionFilterState) => (value: string) =>
      patch(key, value === ALL_VALUE ? undefined : value);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-end gap-2">
      {/* Account */}
      <Select
        value={filters.accountId ?? ALL_VALUE}
        onValueChange={fromSelect("accountId")}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All accounts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All accounts</SelectItem>
          {activeAccounts.map((a: IAccount) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type */}
      <Select
        value={filters.type ?? ALL_VALUE}
        onValueChange={fromSelect("type")}
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All types</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="in_transit">In Transit</SelectItem>
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={filters.categoryId ?? ALL_VALUE}
        onValueChange={fromSelect("categoryId")}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>All categories</SelectItem>
          {categories.map((c: ICategory) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date from */}
      <Input
        type="date"
        className="w-44"
        value={filters.startDate ?? ""}
        onChange={(e) => patch("startDate", e.target.value || undefined)}
      />

      {/* Date to */}
      <Input
        type="date"
        className="w-44"
        value={filters.endDate ?? ""}
        onChange={(e) => patch("endDate", e.target.value || undefined)}
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default TransactionFilters;
