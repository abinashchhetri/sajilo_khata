"use client";

import { useRef, useState } from "react";
import { Upload, FileText, AlertCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useHandleImportPlan } from "@/hooks/react-query/workout/import-plan.hook";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─────── CSV Preview Parser (display-only) ───────────────────────────────────

interface IPreviewRow {
  day: string;
  bodyPart: string;
  exerciseName: string;
  setNumber: string;
  targetWeightKg: string;
  targetReps: string;
  targetFeeling: string;
}

const parsePreview = (text: string): IPreviewRow[] => {
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines
    .slice(1, 8) // show at most 7 preview rows
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = cols[i] ?? "";
      });
      return {
        day: obj["day"] ?? "",
        bodyPart: obj["bodypart"] ?? obj["body_part"] ?? obj["body part"] ?? "",
        exerciseName:
          obj["exercisename"] ?? obj["exercise_name"] ?? obj["exercise"] ?? "",
        setNumber: obj["setnumber"] ?? obj["set_number"] ?? obj["set"] ?? "",
        targetWeightKg:
          obj["targetweightkg"] ??
          obj["target_weight_kg"] ??
          obj["weight"] ??
          "",
        targetReps:
          obj["targetreps"] ?? obj["target_reps"] ?? obj["reps"] ?? "",
        targetFeeling:
          obj["targetfeeling"] ??
          obj["target_feeling"] ??
          obj["feeling"] ??
          "",
      } as IPreviewRow;
    });
};

// ─────── Component ───────────────────────────────────────────────────────────

const WorkoutPlanImport = ({ open, onOpenChange }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [planName, setPlanName] = useState("");
  const [preview, setPreview] = useState<IPreviewRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const { handleImportPlan, isPending } = useHandleImportPlan();

  const handleFile = async (f: File) => {
    setFile(f);
    setErrors([]);
    const text = await f.text();
    setPreview(parsePreview(text));
    if (!planName) setPlanName(f.name.replace(/\.csv$/i, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleConfirm = async () => {
    if (!file || !planName.trim()) return;
    setErrors([]);
    const result = await handleImportPlan(file, planName.trim());
    if (!result) {
      // mutation threw — toast handled in hook; stay open for correction
      return;
    }
    if (result.errors?.length) {
      setErrors(result.errors);
      return;
    }
    // Success — reset and close
    setFile(null);
    setPlanName("");
    setPreview([]);
    setErrors([]);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (isPending) return;
    setFile(null);
    setPlanName("");
    setPreview([]);
    setErrors([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90dvh] w-[95vw] flex-col overflow-hidden rounded-xl sm:w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Workout Plan</DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto pr-0.5">
          {/* Plan name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Plan name
            </label>
            <Input
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="e.g. Push Pull Legs"
              className="text-sm"
            />
          </div>

          {/* Drop zone */}
          <div
            className={`relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
              dragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/50"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {file ? (
              <div className="flex items-center gap-2 text-sm">
                <FileText size={16} className="text-primary" />
                <span className="font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview([]);
                    setErrors([]);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <Upload size={24} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop a CSV or click to browse
                </p>
                <p className="text-xs text-muted-foreground/60">
                  Columns: day, bodyPart, exerciseName, setNumber,
                  targetWeightKg, targetReps, targetFeeling
                </p>
              </>
            )}
          </div>

          {/* Error list */}
          {errors.length > 0 && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                <AlertCircle size={13} />
                Import errors — fix the CSV and re-upload:
              </div>
              <ul className="ml-5 list-disc space-y-0.5 text-xs text-destructive/80">
                {errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          {/* CSV preview */}
          {preview.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                Preview (first {preview.length} rows)
              </p>
              <div className="overflow-x-auto rounded-lg border border-hairline">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-hairline bg-muted/40">
                      {[
                        "Day",
                        "Body Part",
                        "Exercise",
                        "Set",
                        "Weight",
                        "Reps",
                        "Feeling",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-2 py-1.5 text-left font-medium text-muted-foreground whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-hairline last:border-0"
                      >
                        <td className="px-2 py-1.5 text-foreground">
                          {row.day}
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground">
                          {row.bodyPart}
                        </td>
                        <td className="px-2 py-1.5 text-foreground">
                          {row.exerciseName}
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground tabular-nums">
                          {row.setNumber}
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground tabular-nums">
                          {row.targetWeightKg}kg
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground tabular-nums">
                          {row.targetReps}
                        </td>
                        <td className="px-2 py-1.5 text-muted-foreground">
                          {row.targetFeeling}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!file || !planName.trim() || isPending || errors.length > 0}
              className="w-full sm:w-auto sm:min-w-28"
            >
              {isPending ? "Importing…" : "Confirm Import"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutPlanImport;
