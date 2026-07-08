// Summary card for one workout session

"use client";

import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useState } from "react";
import type { IWorkoutSession } from "@/types/fitness/workouts.types";

interface SessionCardProps {
  session: IWorkoutSession;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function SessionCard({
  session,
  onDelete,
  isDeleting = false,
}: SessionCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const feeling = session.feeling
    ? ["😫", "😐", "😊", "😄", "🔥"][session.feeling - 1]
    : null;

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm">
                  {session.title || "Workout"}
                </p>
                {feeling && <span className="text-lg">{feeling}</span>}
              </div>
              <p className="text-xs text-muted-foreground">
                {format(new Date(session.performedAt), "MMM d, h:mm a")}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.exercises.length} exercise{session.exercises.length !== 1 ? "s" : ""}
                {session.durationMinutes && ` • ${session.durationMinutes}m`}
              </p>
            </div>

            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(true)}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Delete workout?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete?.(session.id);
          setShowConfirm(false);
        }}
      />
    </>
  );
}
