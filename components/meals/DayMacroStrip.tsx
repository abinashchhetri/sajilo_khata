// Day-total macro summary strip. Sums only non-null macros across the day's
// logs (a missing macro is skipped, never treated as 0). Renders nothing if the
// day has no macro data at all.

import { Card, CardContent } from "@/components/ui/card";
import type { IMealLog } from "@/types/nutrition/meals.types";

interface Props {
  logs: IMealLog[];
}

interface Total {
  sum: number;
  present: boolean;
}

function totalOf(logs: IMealLog[], key: keyof IMealLog): Total {
  let sum = 0;
  let present = false;
  for (const log of logs) {
    const v = log[key];
    if (typeof v === "number") {
      sum += v;
      present = true;
    }
  }
  return { sum, present };
}

export function DayMacroStrip({ logs }: Props) {
  const cals = totalOf(logs, "calories");
  const protein = totalOf(logs, "proteinG");
  const carbs = totalOf(logs, "carbsG");
  const fat = totalOf(logs, "fatG");

  if (!cals.present && !protein.present && !carbs.present && !fat.present) {
    return null;
  }

  const items = [
    { label: "Calories", value: cals, unit: "" },
    { label: "Protein", value: protein, unit: "g" },
    { label: "Carbs", value: carbs, unit: "g" },
    { label: "Fat", value: fat, unit: "g" },
  ];

  return (
    <Card>
      <CardContent className="grid grid-cols-4 gap-2 p-4">
        {items.map((it) => (
          <div key={it.label}>
            <p className="text-eyebrow text-ink-faint">{it.label}</p>
            <p className="mt-0.5 text-body-md font-semibold tabular-nums text-foreground">
              {it.value.present
                ? `${Math.round(it.value.sum)}${it.unit}`
                : "—"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
