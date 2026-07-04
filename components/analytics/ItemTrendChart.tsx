// ─────────────────────────────────────────────────────────────────────────────
// ItemTrendChart
// ─────────────────────────────────────────────────────────────────────────────
// Recharts LineChart plotting a single item's monthly spend trend.
// Rendered only when an item has been selected from TopItemsList.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format.utils";
import { useGetItemTrend } from "@/hooks/react-query/analytics/get-item-trend.hook";
import type { IAnalyticsParams } from "@/types/analytics/analytics.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  itemName: string;
  params?: IAnalyticsParams;
}

// ─────── Tooltip ─────────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { value: number; payload: { month: string } }[];
}) => {
  if (!active || !payload?.length) return null;
  const month = payload[0].payload.month;
  return (
    <div className="rounded-md border border-hairline bg-canvas px-3 py-2 shadow-level-1 text-body-sm">
      <p className="font-medium text-foreground">
        {format(parseISO(`${month}-01`), "MMM yyyy")}
      </p>
      <p className="text-ink-muted">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

// ─────── Component ───────────────────────────────────────────────────────────

const ItemTrendChart = ({ itemName, params }: Props) => {
  const { trend, isLoading } = useGetItemTrend(itemName, params);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <Skeleton className="h-5 w-48 mb-3" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (trend.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base capitalize">&quot;{itemName}&quot; — Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-8 text-center text-body-sm text-ink-muted">
            No trend data found for this item.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Format month labels "2025-01" → "Jan 25"
  const chartData = trend.map((pt) => ({
    month: pt.month,
    label: format(parseISO(`${pt.month}-01`), "MMM yy"),
    total: pt.total,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base capitalize">
          &quot;{itemName}&quot; — Monthly Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#615d59" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#615d59" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={42}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#0075de"
              strokeWidth={2}
              dot={{ r: 3, fill: "#0075de", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ItemTrendChart;
