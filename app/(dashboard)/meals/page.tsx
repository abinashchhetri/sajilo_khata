// Nutrition tracking page — meals with tabs for Today, History, Prep, Plan

"use client";

import { useState } from "react";
import { Plus, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { CsvImportDialog } from "@/components/shared/CsvImportDialog";
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

const MEAL_CSV_FORMAT = "day,meal,name,calories,protein,carbs,fat,notes";
const MEAL_CSV_SAMPLE = `Monday,breakfast,Oatmeal with berries,350,10,65,5,
Monday,lunch,Grilled chicken + rice,600,40,80,10,
Monday,dinner,Salmon + sweet potato,700,45,60,25,
Tuesday,breakfast,Eggs + toast,400,15,45,15,
Tuesday,lunch,Turkey sandwich,550,35,60,15,
Tuesday,dinner,Pasta + vegetables,650,25,100,15,`;

export default function MealsPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [prepOpen, setPrepOpen] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);

  const { today, isLoading: isTodayLoading } = useGetMealToday();
  const { handleImport, isPending: isImporting } = useHandleImportMealPlan();
  const { handleClear, isPending: isClearing } = useHandleClearMealPlan();

  if (isTodayLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const dayTotalCalories = today?.logs.reduce(
    (sum, log) => sum + (log.calories || 0),
    0
  ) ?? 0;

  const dayTotalProtein = today?.logs.reduce(
    (sum, log) => sum + (log.proteinG || 0),
    0
  ) ?? 0;

  const dayTotalCarbs = today?.logs.reduce(
    (sum, log) => sum + (log.carbsG || 0),
    0
  ) ?? 0;

  const dayTotalFat = today?.logs.reduce(
    (sum, log) => sum + (log.fatG || 0),
    0
  ) ?? 0;

  const hasAnyMacros =
    today?.logs.some(
      (log) =>
        log.proteinG !== null ||
        log.carbsG !== null ||
        log.fatG !== null
    ) ?? false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nutrition</h1>
          <p className="text-muted-foreground text-sm">Track your meals</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setQuickAddOpen(true)}>
            <Plus size={16} className="mr-2" />
            Quick Add
          </Button>
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Plus size={16} className="mr-2" />
            Import Plan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="prep">Prep</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {hasAnyMacros && (
            <Card className="bg-muted">
              <CardContent className="p-4">
                <div className="flex gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Calories</p>
                    <p className="font-semibold">{dayTotalCalories}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-semibold">
                      {dayTotalProtein.toFixed(1)}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="font-semibold">
                      {dayTotalCarbs.toFixed(1)}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="font-semibold">
                      {dayTotalFat.toFixed(1)}g
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {today?.plan && today.plan.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Planned Meals</h3>
                <div className="space-y-2">
                  {today.plan.map((meal) => (
                    <PlannedMealCard key={meal.id} meal={meal} />
                  ))}
                </div>
              </div>
            )}

            {today?.prepBatches && today.prepBatches.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Prep Available</h3>
                <div className="space-y-2">
                  {today.prepBatches.map((batch) => (
                    <PrepBatchCard key={batch.id} batch={batch} />
                  ))}
                </div>
              </div>
            )}

            {today?.logs && today.logs.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Logged Today</h3>
                <div className="space-y-2">
                  {today.logs.map((log) => (
                    <MealLogCard key={log.id} log={log} />
                  ))}
                </div>
              </div>
            )}

            {!today?.logs?.length &&
              !today?.plan?.length &&
              !today?.prepBatches?.length && (
                <EmptyState
                  message="No meals yet"
                  description="Quick add or import a plan to get started"
                />
              )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <MealLogsList />
        </TabsContent>

        <TabsContent value="prep" className="space-y-4">
          <Button onClick={() => setPrepOpen(true)}>
            <Plus size={16} className="mr-2" />
            Add Prep
          </Button>
          <PrepBatchesView />
        </TabsContent>

        <TabsContent value="plan" className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setClearConfirm(true)}
              disabled={isClearing}
            >
              Clear Plan
            </Button>
          </div>
          <MealPlanView />
        </TabsContent>
      </Tabs>

      <QuickAddMealDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />

      <PrepFormDialog open={prepOpen} onOpenChange={setPrepOpen} />

      <CsvImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import Meal Plan"
        formatHint={`CSV format: ${MEAL_CSV_FORMAT}`}
        sampleCsv={MEAL_CSV_SAMPLE}
        isPending={isImporting}
        onImport={async (csv) => {
          const result = await handleImport(csv);
          return result || { inserted: 0, daysCovered: 0, skipped: 0, warnings: [] };
        }}
      />

      <ConfirmDialog
        open={clearConfirm}
        onOpenChange={setClearConfirm}
        title="Clear meal plan?"
        description="This will delete the entire weekly plan. This cannot be undone."
        confirmLabel="Clear"
        onConfirm={async () => {
          await handleClear();
          setClearConfirm(false);
        }}
      />
    </div>
  );
}
