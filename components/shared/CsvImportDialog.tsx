// CSV import dialog — reusable for both workout and meal plans.
// Notion chrome: modal card, tight mono textarea, collapsible format hint,
// success panel using the sticker-green accent (status = sticker palette).

"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface ImportResult {
  inserted: number;
  daysCovered: number;
  skipped: number;
  warnings: string[];
}

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formatHint: string;
  sampleCsv: string;
  isPending: boolean;
  onImport: (csv: string) => Promise<ImportResult>;
}

export function CsvImportDialog({
  open,
  onOpenChange,
  title,
  formatHint,
  sampleCsv,
  isPending,
  onImport,
}: CsvImportDialogProps) {
  const [csv, setCsv] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const handleImport = async () => {
    try {
      const summary = await onImport(csv);
      setResult(summary);
      setCsv("");
    } catch {
      // Errors surface via the hook's onError + global axios interceptor.
    }
  };

  const handleClose = () => {
    if (isPending) return;
    setCsv("");
    setResult(null);
    setIsFormatOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Paste your CSV below — this seeds your weekly plan.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <textarea
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              placeholder="Paste CSV rows here…"
              spellCheck={false}
              className="h-44 w-full resize-none rounded-xs border border-input bg-canvas p-3 font-mono text-caption text-foreground placeholder:text-ink-faint focus-visible:border-ring focus-visible:shadow-level-1 focus-visible:outline-none disabled:opacity-50"
              disabled={isPending}
            />

            <Collapsible
              open={isFormatOpen}
              onOpenChange={setIsFormatOpen}
              className="overflow-hidden rounded-md border border-hairline"
            >
              <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2.5 text-body-sm font-medium text-ink-secondary transition-colors hover:bg-muted">
                <ChevronDown
                  size={15}
                  className={cn(
                    "text-ink-faint transition-transform",
                    isFormatOpen && "rotate-180",
                  )}
                />
                Expected format
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 border-t border-hairline bg-canvas-soft p-3">
                <p className="text-caption text-ink-muted">{formatHint}</p>
                <pre className="overflow-x-auto rounded-xs bg-canvas p-2.5 font-mono text-[11px] leading-relaxed text-ink-secondary">
                  {sampleCsv}
                </pre>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!csv.trim() || isPending}>
                {isPending ? "Importing…" : "Import"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-md border border-hairline bg-canvas-soft p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-accent-green"
              />
              <div>
                <p className="text-body-sm font-medium text-foreground">
                  Imported {result.inserted}{" "}
                  {result.inserted === 1 ? "row" : "rows"} across{" "}
                  {result.daysCovered}{" "}
                  {result.daysCovered === 1 ? "day" : "days"}
                </p>
                {result.skipped > 0 && (
                  <p className="mt-0.5 text-caption text-ink-muted">
                    {result.skipped} {result.skipped === 1 ? "row" : "rows"}{" "}
                    skipped
                  </p>
                )}
              </div>
            </div>

            {result.warnings.length > 0 && (
              <div className="rounded-md border border-hairline bg-canvas-soft p-3">
                <div className="mb-2 flex items-center gap-1.5 text-caption font-medium text-destructive">
                  <AlertTriangle size={14} />
                  {result.warnings.length}{" "}
                  {result.warnings.length === 1 ? "warning" : "warnings"}
                </div>
                <div className="max-h-40 space-y-1 overflow-y-auto">
                  {result.warnings.map((warning, idx) => (
                    <p key={idx} className="text-caption text-ink-muted">
                      • {warning}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
