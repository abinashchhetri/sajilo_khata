// CSV import dialog — reusable for both workout and meal plans

"use client";

import { useState } from "react";
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
import { ChevronDown } from "lucide-react";

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formatHint: string;
  sampleCsv: string;
  isPending: boolean;
  onImport: (csv: string) => Promise<{
    inserted: number;
    daysCovered: number;
    skipped: number;
    warnings: string[];
  }>;
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
  const [result, setResult] = useState<{
    inserted: number;
    daysCovered: number;
    skipped: number;
    warnings: string[];
  } | null>(null);
  const [isFormatOpen, setIsFormatOpen] = useState(false);

  const handleImport = async () => {
    try {
      const summary = await onImport(csv);
      setResult(summary);
      setCsv("");
    } catch (err) {
      // Error is handled by the mutation hook's onError + global axios interceptor
    }
  };

  const handleClose = () => {
    if (!isPending) {
      setCsv("");
      setResult(null);
      setIsFormatOpen(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Paste your CSV data below or view the expected format
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">CSV Data</label>
              <textarea
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
                placeholder="Paste CSV here..."
                className="w-full h-40 font-mono text-sm border rounded-md p-2 resize-none"
                disabled={isPending}
              />
            </div>

            <Collapsible
              open={isFormatOpen}
              onOpenChange={setIsFormatOpen}
              className="border rounded-md"
            >
              <CollapsibleTrigger className="w-full flex items-center gap-2 p-3 hover:bg-muted">
                <ChevronDown
                  size={16}
                  className={`transition ${isFormatOpen ? "rotate-180" : ""}`}
                />
                <span className="text-sm font-medium">Expected Format</span>
              </CollapsibleTrigger>
              <CollapsibleContent className="border-t p-3 bg-muted text-sm space-y-2">
                <p className="text-xs text-muted-foreground">{formatHint}</p>
                <pre className="font-mono text-xs overflow-x-auto bg-background p-2 rounded">
                  {sampleCsv}
                </pre>
              </CollapsibleContent>
            </Collapsible>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClose} disabled={isPending}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!csv.trim() || isPending}
              >
                {isPending ? "Importing..." : "Import"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm font-medium text-green-900 dark:text-green-200">
                ✓ Imported {result.inserted} rows across {result.daysCovered} days
              </p>
              {result.skipped > 0 && (
                <p className="text-xs text-green-800 dark:text-green-300 mt-1">
                  {result.skipped} rows skipped
                </p>
              )}
            </div>

            {result.warnings.length > 0 && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-200 mb-2">
                  Warnings:
                </p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {result.warnings.map((warning, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-amber-800 dark:text-amber-300"
                    >
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
