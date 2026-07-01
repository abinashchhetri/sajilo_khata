// ─────────────────────────────────────────────────────────────────────────────
// Badge
// ─────────────────────────────────────────────────────────────────────────────
// Generic colored pill used as the base for AccountTypeBadge and CategoryBadge.
// Accepts inline style props for dynamic colors (category colors come from the
// backend as hex strings and can't be expressed as static Tailwind classes).
// For static variants (account type), callers use className instead.
// ─────────────────────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
  // Inline CSS color values for dynamic backend-driven colors (e.g. hex categories)
  bgColor?: string;
  textColor?: string;
  className?: string;
}

// ─────── Component ───────────────────────────────────────────────────────────

const Badge = ({ children, bgColor, textColor, className }: Props) => {
  return (
    <span
      className={cn(
        // badge-pill — eyebrow typography, fully pill-shaped
        "inline-flex items-center rounded-full px-2 py-0.5 text-eyebrow",
        className,
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
