// Progress chart for an exercise using recharts

"use client";

import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IExerciseProgress } from "@/types/fitness/workouts.types";

interface ProgressChartProps {
  progress: IExerciseProgress;
}

export function ProgressChart({ progress }: ProgressChartProps) {
  if (!progress.points.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No data yet for this exercise
      </div>
    );
  }

  const chartData = progress.points.map((p) => ({
    date: format(new Date(p.performedAt), "d MMM"),
    estimated1RM: p.estimated1RM ?? undefined,
    actualWeight: p.actualWeight ?? undefined,
  }));

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="h-64 w-full min-w-max">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {progress.points.some((p) => p.estimated1RM !== null) && (
                <Line
                  type="monotone"
                  dataKey="estimated1RM"
                  stroke="#3b82f6"
                  name="Est. 1RM"
                  dot={false}
                  strokeWidth={2}
                />
              )}
              {progress.points.some((p) => p.actualWeight !== null) && (
                <Line
                  type="monotone"
                  dataKey="actualWeight"
                  stroke="#8b5cf6"
                  name="Weight"
                  dot={false}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {progress.bests.maxWeight !== null && (
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Max Weight</p>
              <p className="font-semibold">
                {progress.bests.maxWeight.toFixed(1)} kg
              </p>
            </CardContent>
          </Card>
        )}
        {progress.bests.maxEst1RM !== null && (
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Est. 1RM</p>
              <p className="font-semibold">
                {progress.bests.maxEst1RM.toFixed(1)} kg
              </p>
            </CardContent>
          </Card>
        )}
        {progress.bests.maxVolume !== null && (
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Max Volume</p>
              <p className="font-semibold">
                {progress.bests.maxVolume.toFixed(0)} kg
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
