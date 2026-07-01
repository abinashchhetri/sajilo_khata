// ─────────────────────────────────────────────────────────────────────────────
// Investments Page
// ─────────────────────────────────────────────────────────────────────────────
// Portfolio view: PortfolioSummaryCard at the top, InvestmentTypeTabs to filter,
// investment list below. Two dialog flows: add (create) and edit. The value-
// update flow is handled inside InvestmentCard → UpdateValueDialog directly.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Plus, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PortfolioSummaryCard from "@/components/investments/PortfolioSummaryCard";
import InvestmentTypeTabs from "@/components/investments/InvestmentTypeTabs";
import InvestmentCard from "@/components/investments/InvestmentCard";
import InvestmentForm from "@/components/investments/InvestmentForm";
import { useGetInvestments } from "@/hooks/react-query/investments/get-investments.hook";
import { useHandleCreateInvestment } from "@/hooks/react-query/investments/post-investment.hook";
import { useHandleUpdateInvestment } from "@/hooks/react-query/investments/update-investment.hook";
import type {
  IInvestment,
  ICreateInvestment,
  TInvestmentType,
} from "@/types/investments/investments.types";

// ─────── Component ───────────────────────────────────────────────────────────

const InvestmentsPage = () => {
  const [activeType, setActiveType] = useState<TInvestmentType | "all">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] =
    useState<IInvestment | null>(null);

  const { investments, isLoading } = useGetInvestments(
    activeType === "all" ? undefined : { type: activeType },
  );
  const { handleCreateInvestment, isPending: isCreating } =
    useHandleCreateInvestment();
  const { handleUpdateInvestment, isPending: isUpdating } =
    useHandleUpdateInvestment();

  const handleCreate = async (data: ICreateInvestment) => {
    await handleCreateInvestment(data);
    setIsCreateOpen(false);
  };

  const handleEdit = async (data: ICreateInvestment) => {
    if (!editingInvestment) return;
    await handleUpdateInvestment({
      investmentId: editingInvestment.id,
      body: {
        name: data.name,
        investedAmount: data.investedAmount,
        note: data.note ?? null,
        metadata: data.metadata,
      },
    });
    setEditingInvestment(null);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-foreground">Investments</h1>
          <p className="text-sm text-muted-foreground">
            NEPSE shares, SIPs, and fixed deposits
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Add Investment
        </Button>
      </div>

      {/* Portfolio summary */}
      <PortfolioSummaryCard />

      {/* Type filter tabs */}
      <InvestmentTypeTabs activeType={activeType} onChange={setActiveType} />

      {/* Investment list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : investments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <TrendingUp size={40} strokeWidth={1.25} />
          <p className="text-sm">
            {activeType === "all"
              ? "No investments yet — add your first one"
              : `No ${activeType.toUpperCase()} investments`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {investments.map((inv) => (
            <InvestmentCard
              key={inv.id}
              investment={inv}
              onEdit={setEditingInvestment}
            />
          ))}
        </div>
      )}

      {/* Add investment dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Investment</DialogTitle>
          </DialogHeader>
          <InvestmentForm
            mode="create"
            onSubmit={handleCreate}
            isPending={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* Edit investment dialog */}
      <Dialog
        open={!!editingInvestment}
        onOpenChange={(open) => !open && setEditingInvestment(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Investment</DialogTitle>
          </DialogHeader>
          {editingInvestment && (
            <InvestmentForm
              mode="edit"
              defaultInvestment={editingInvestment}
              onSubmit={handleEdit}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestmentsPage;
