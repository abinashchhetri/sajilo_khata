// Nutrition page — meals. Tabs: Today, History, Prep, Plan.

"use client";

import { useState } from "react";
import { Plus, Upload, UtensilsCrossed, Trash2, Boxes, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { CsvImportDialog } from "@/components/shared/CsvImportDialog";
import { DayMacroStrip } from "@/components/meals/DayMacroStrip";
import { PlannedMealCard } from "@/components/meals/PlannedMealCard";
import { PrepBatchCard } from "@/components/meals/PrepBatchCard";
import { MealLogCard } from "@/components/meals/MealLogCard";
import { MealLogsList } from "@/components/meals/MealLogsList";
import { MealPlanView } from "@/components/meals/MealPlanView";
import { QuickAddMealDialog } from "@/components/meals/QuickAddMealDialog";
import { PrepFormDialog } from "@/components/meals/PrepFormDialog";
import { PrepBatchesView } from "@/components/meals/PrepBatchesView";
import { useGetMealToday } from "@/hooks/react-query/meals/get-meal-today.hook";
import { useHandleImportMealPlan } from "@/hooks/react-query/meals/import-meal-plan.hook";
import { useHandleClearMealPlan } from "@/hooks/react-query/meals/clear-meal-plan.hook";

const MEAL_CSV_FORMAT =
  "Columns: day, meal, name, calories, protein, carbs, fat, notes";
const MEAL_CSV_SAMPLE = `day,meal,name,calories,protein,carbs,fat,notes
Monday,breakfast,Oatmeal & berries,350,10,65,5,
Monday,lunch,Chicken & rice,600,40,80,10,
Monday,dinner,Salmon & sweet potato,700,45,60,25,
Tuesday,breakfast,Eggs & toast,400,15,45,15,
Tuesday,lunch,Turkey sandwich,550,35,60,15,`;

const EMPTY_SUMMARY = { inserted: 0, daysCovered: 0, skipped: 0, warnings: [] };

// Small labelled section header with an optional count chip.
function SectionHeading({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-eyebrow uppercase tracking-wide text-ink-faint">
        {label}
      </h3>
      {count != null && count > 0 && (
        <span className="rounded-full bg-muted px-1.5 text-eyebrow text-ink-muted tabular-nums">
          {count}
        </span>
      )}
    </div>
  );
}

// Tab content wrapper with clear heading
function TabSection({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-heading-3 text-foreground">{title}</h2>
          {description && (
            <p className="mt-0.5 text-body-sm text-ink-muted">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

export default function MealsPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [prepOpen, setPrepOpen] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const { today, isLoading } = useGetMealToday();
  const { handleImport, isPending: isImporting } = useHandleImportMealPlan();
  const { handleClear, isPending: isClearing } = useHandleClearMealPlan();

  const hasContent =
    (today?.plan.length ?? 0) > 0 ||
    (today?.prepBatches.length ?? 0) > 0 ||
    (today?.logs.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-heading-3 text-foreground">Nutrition</h1>
            <p className="text-body-sm text-ink-muted">
              Track meals, log prep, and monitor your macros.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setQuickAddOpen(true)}>
              <Plus size={15} />
              <span className="hidden sm:inline">Quick add</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportOpen(true)}
            >
              <Upload size={15} />
              <span className="hidden sm:inline">Import plan</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="today" className="w-full">
        {/* Tab descriptions */}
        <div className="mb-3 grid grid-cols-4 gap-2 rounded-lg border border-hairline bg-canvas-soft p-2">
          <div className="text-center">
            <div className="text-body-sm font-medium text-foreground">Today</div>
            <p className="text-caption text-ink-faint">Logged meals</p>
          </div>
          <div className="text-center">
            <div className="text-body-sm font-medium text-foreground">History</div>
            <p className="text-caption text-ink-faint">Past weeks</p>
          </div>
          <div className="text-center">
            <div className="text-body-sm font-medium text-foreground">Prep</div>
            <p className="text-caption text-ink-faint">Batches & portions</p>
          </div>
          <div className="text-center">
            <div className="text-body-sm font-medium text-foreground">Plan</div>
            <p className="text-caption text-ink-faint">Weekly meals</p>
          </div>
        </div>
        <TabsList className="grid h-10 w-full grid-cols-4 gap-1 bg-canvas">
          <TabsTrigger value="today" className="gap-1.5">
            <UtensilsCrossed size={15} />
            <span className="hidden sm:inline">Today</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <CheckCircle2 size={15} />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="prep" className="gap-1.5">
            <Boxes size={15} />
            <span className="hidden sm:inline">Prep</span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="gap-1.5">
            <Calendar size={15} />
            <span className="hidden sm:inline">Plan</span>
          </TabsTrigger>
        </TabsList>

        {/* Today — logged meals */}
        <TabsContent value="today" className="space-y-5 pt-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ) : !hasContent ? (
            <TabSection
              title="Today's meals"
              description={today ? today.dayName : "No meals yet"}
            >
              <EmptyState
                icon={<UtensilsCrossed size={22} strokeWidth={1.5} />}
                message="Nothing logged yet"
                description="Quick add a meal or select from your plan"
                ctaLabel="Quick add"
                onCta={() => setQuickAddOpen(true)}
              />
            </TabSection>
          ) : (
            <TabSection
              title="Today's meals"
              description={today ? today.dayName : ""}
            >
              <div className="space-y-4">
                {today && today.logs.length > 0 && (
                  <div className="rounded-lg border border-hairline bg-canvas-soft p-3">
                    <DayMacroStrip logs={today.logs} />
                  </div>
                )}

                {today && today.plan.length > 0 && (
                  <section className="space-y-2">
                    <SectionHeading label="Planned meals" count={today.plan.length} />
                    <div className="space-y-2">
                      {today.plan.map((meal) => (
                        <PlannedMealCard key={meal.id} meal={meal} />
                      ))}
                    </div>
                  </section>
                )}

                {today && today.prepBatches.length > 0 && (
                  <section className="space-y-2">
                    <SectionHeading
                      label="Prep available"
                      count={today.prepBatches.length}
                    />
                    <div className="space-y-2">
                      {today.prepBatches.map((batch) => (
                        <PrepBatchCard key={batch.id} batch={batch} />
                      ))}
                    </div>
                  </section>
                )}

                {today && today.logs.length > 0 && (
                  <section className="space-y-2">
                    <SectionHeading label="Already logged" count={today.logs.length} />
                    <div className="space-y-2">
                      {today.logs.map((log) => (
                        <MealLogCard key={log.id} log={log} />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </TabSection>
          )}
        </TabsContent>

        {/* History — past weeks */}
        <TabsContent value="history" className="pt-4">
          <TabSection
            title="Meal history"
            description="All your logged meals going back in time"
          >
            <MealLogsList />
          </TabSection>
        </TabsContent>

        {/* Prep — batches & portions */}
        <TabsContent value="prep" className="space-y-3 pt-4">
          <TabSection
            title="Meal prep"
            description="Batch-cook once, log portions through the week"
            action={
              <Button size="sm" onClick={() => setPrepOpen(true)}>
                <Plus size={15} />
                <span className="hidden sm:inline">Add prep</span>
              </Button>
            }
          >
            <PrepBatchesView onAdd={() => setPrepOpen(true)} />
          </TabSection>
        </TabsContent>

        {/* Plan — weekly meals */}
        <TabsContent value="plan" className="space-y-3 pt-4">
          <TabSection
            title="Weekly plan"
            description="Your meals for each day of the week"
          >
            <div className="space-y-4">
              <MealPlanView onImport={() => setImportOpen(true)} />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ink-faint hover:text-destructive"
                  onClick={() => setClearConfirm(true)}
                  disabled={isClearing}
                >
                  <Trash2 size={14} />
                  Clear plan
                </Button>
              </div>
            </div>
          </TabSection>
        </TabsContent>
      </Tabs>

      <QuickAddMealDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
      <PrepFormDialog open={prepOpen} onOpenChange={setPrepOpen} />

      <CsvImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import meal plan"
        formatHint={MEAL_CSV_FORMAT}
        sampleCsv={MEAL_CSV_SAMPLE}
        isPending={isImporting}
        onImport={async (csv) => (await handleImport(csv)) ?? EMPTY_SUMMARY}
      />

      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear meal plan?"
        description="This deletes your entire weekly plan. This cannot be undone."
        confirmLabel="Clear plan"
        onConfirm={async () => {
          await handleClear();
          setClearConfirm(false);
        }}
        isPending={isClearing}
      />
    </div>
  );
}
