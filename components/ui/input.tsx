// ─────────────────────────────────────────────────────────────────────────────
// Input
// ─────────────────────────────────────────────────────────────────────────────
// shadcn-style input primitive. Forwards all native input props and ref so it
// integrates cleanly with React Hook Form's register() without any wrapper.
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react";

import { cn } from "@/lib/utils";

// ─────── Types ───────────────────────────────────────────────────────────────

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// ─────── Component ───────────────────────────────────────────────────────────

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // text-input — white surface, tight rounded-xs corners (deliberately
          // tighter than the pill CTAs), focus adds the soft Level-1 shadow.
          "flex h-9 w-full rounded-xs border border-input bg-canvas px-2.5 py-1.5 text-body-sm text-foreground file:border-0 file:bg-transparent file:text-body-sm file:font-medium placeholder:text-ink-faint focus-visible:border-ring focus-visible:shadow-level-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          // Date inputs: let the browser control vertical alignment internally;
          // extra right padding prevents the calendar button from overlapping the value.
          type === "date" && "py-0 pr-2 [&::-webkit-calendar-picker-indicator]:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
