// Per-exercise progress chart (recharts) + best-record stat tiles.
// Chart series use the brand chart tokens (sticker palette), never primary.

"use client";

import { format } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { IExerciseProgress } from "@/types/fitness/workouts.types";

interface ProgressChartProps {
  progress: IExerciseProgress;
}

interface StatTileProps {
  label: string;
  value: string;
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-md border border-hairline bg-card p-3 text-center">
      <p className="text-eyebrow text-ink-faint">{label}</p>
      <p className="mt-1 text-body-md font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  );
}

export function ProgressChart({ progress }: ProgressChartProps) {
  if (!progress.points.length) {
    return (
      <p className="py-8 text-center text-body-sm text-ink-muted">
        No data yet for this exercise
      </p>
    );
  }

  const chartData = progress.points.map((p) => ({
    date: format(new Date(p.performedAt), "d MMM"),
    estimated1RM: p.estimated1RM ?? undefined,
    actualWeight: p.actualWeight ?? undefined,
  }));

  const has1RM = progress.points.some((p) => p.estimated1RM !== null);
  const hasWeight = progress.points.some((p) => p.actualWeight !== null);
  const { bests } = progress;
  const tiles = [
    bests.maxWeight != null && {
      label: "Max weight",
      value: `${bests.maxWeight.toFixed(1)} kg`,
    },
    bests.maxEst1RM != null && {
      label: "Best 1RM",
      value: `${bests.maxEst1RM.toFixed(1)} kg`,
    },
    bests.maxVolume != null && {
      label: "Max volume",
      value: `${bests.maxVolume.toFixed(0)} kg`,
    },
  ].filter(Boolean) as StatTileProps[];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-hairline bg-card p-4">
        <div className="overflow-x-auto">
          <div className="h-60 min-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--hairline)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--ink-faint)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--hairline)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--ink-faint)" }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--hairline)",
                    fontSize: 12,
                    boxShadow: "var(--shadow-level-1)",
                  }}
                />
                {has1RM && (
                  <Line
                    type="monotone"
                    dataKey="estimated1RM"
                    stroke="var(--chart-1)"
                    name="Est. 1RM"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
                {hasWeight && (
                  <Line
                    type="monotone"
                    dataKey="actualWeight"
                    stroke="var(--chart-2)"
                    name="Weight"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-4 text-caption text-ink-muted">
          {has1RM && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--chart-1)" }} />
              Est. 1RM
            </span>
          )}
          {hasWeight && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--chart-2)" }} />
              Weight
            </span>
          )}
        </div>
      </div>

      {tiles.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {tiles.map((t) => (
            <StatTile key={t.label} label={t.label} value={t.value} />
          ))}
        </div>
      )}
    </div>
  );
}
