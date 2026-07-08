"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import { useGetProgress } from "@/hooks/react-query/workout/get-progress.hook";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  exerciseNames: string[];
}

// ─────── Component ───────────────────────────────────────────────────────────

const ExerciseProgress = ({ exerciseNames }: Props) => {
  const [selected, setSelected] = useState(exerciseNames[0] ?? "");

  const { points, isLoading } = useGetProgress(selected);

  const chartData = points.map((p) => ({
    date: format(parseISO(p.sessionDate), "d MMM"),
    weight: p.maxWeightKg,
    sets: p.setsCompleted,
  }));

  return (
    <div className="space-y-3">
      {/* Exercise selector */}
      <div className="flex items-center gap-3">
        <Select
          value={selected}
          onValueChange={setSelected}
          disabled={exerciseNames.length === 0}
        >
          <SelectTrigger className="w-64 text-sm">
            <SelectValue placeholder="Select an exercise…" />
          </SelectTrigger>
          <SelectContent>
            {exerciseNames.map((name) => (
              <SelectItem key={name} value={name} className="text-sm">
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected && (
          <p className="text-xs text-muted-foreground">
            Max weight per session
          </p>
        )}
      </div>

      {/* Chart */}
      {isLoading ? (
        <Skeleton className="h-48 w-full rounded-lg" />
      ) : !selected || exerciseNames.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={20} />}
          message="No exercise selected"
          description="Import a plan and log sessions to see progress."
        />
      ) : chartData.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={20} />}
          message="No data yet"
          description="Log a session with this exercise to see progress over time."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-hairline p-4">
          <div style={{ minWidth: Math.max(chartData.length * 60, 320), height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}kg`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--popover))",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number) => [`${value} kg`, "Max weight"]}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseProgress;
