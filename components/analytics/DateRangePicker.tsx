// ─────────────────────────────────────────────────────────────────────────────
// DateRangePicker
// ─────────────────────────────────────────────────────────────────────────────
// Single shared control that drives every analytics chart on the page.
// Defaults to the current month via getMonthRange(). Propagates changes
// upward via onRangeChange so the parent can feed the same range to all hooks.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { CalendarRange } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMonthRange } from "@/utils/date.utils";
import type { IDateRangeFilter } from "@/types/global.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  range: IDateRangeFilter;
  onRangeChange: (range: IDateRangeFilter) => void;
}

// ─────── Component ───────────────────────────────────────────────────────────

const DateRangePicker = ({ range, onRangeChange }: Props) => {
  const { startDate: defaultStart, endDate: defaultEnd } = getMonthRange();

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-md border border-hairline bg-canvas px-4 py-3 shadow-level-1">
      <CalendarRange size={15} className="shrink-0 text-ink-muted" />
      <span className="text-body-sm text-ink-muted">Period</span>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Label htmlFor="range-start" className="text-caption text-ink-muted whitespace-nowrap">
            From
          </Label>
          <Input
            id="range-start"
            type="date"
            className="w-44"
            value={range.startDate ?? defaultStart}
            onChange={(e) =>
              onRangeChange({ ...range, startDate: e.target.value || undefined })
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="range-end" className="text-caption text-ink-muted whitespace-nowrap">
            To
          </Label>
          <Input
            id="range-end"
            type="date"
            className="w-44"
            value={range.endDate ?? defaultEnd}
            onChange={(e) =>
              onRangeChange({ ...range, endDate: e.target.value || undefined })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
