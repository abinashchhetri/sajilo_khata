// Summary card for one workout session.

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Clock, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { feelingEmoji } from "@/utils/health-format.utils";
import type { IWorkoutSession } from "@/types/fitness/workouts.types";

interface SessionCardProps {
  session: IWorkoutSession;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
  highlight?: boolean;
}

export function SessionCard({
  session,
  onDelete,
  isDeleting = false,
  highlight = false,
}: SessionCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const emoji = feelingEmoji(session.feeling);
  const doneCount = session.exercises.filter((e) => !e.skipped).length;

  return (
    <>
      <Card className={highlight ? "shadow-level-1" : undefined}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-body-sm font-medium text-foreground">
                  {session.title || "Workout"}
                </span>
                {emoji && <span className="shrink-0 text-base leading-none">{emoji}</span>}
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
                <span className="tabular-nums">
                  {format(new Date(session.performedAt), "EEE, MMM d · h:mm a")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Dumbbell size={12} />
                  {doneCount} {doneCount === 1 ? "exercise" : "exercises"}
                </span>
                {session.durationMinutes != null && (
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Clock size={12} />
                    {session.durationMinutes}m
                  </span>
                )}
              </div>
            </div>

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-ink-faint hover:text-destructive"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
                aria-label="Delete workout"
              >
                <Trash2 size={14} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete workout?"
        description="This will permanently remove this logged session. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete?.(session.id);
          setShowConfirm(false);
        }}
        isPending={isDeleting}
      />
    </>
  );
}
