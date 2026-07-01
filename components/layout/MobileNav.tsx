// ─────────────────────────────────────────────────────────────────────────────
// MobileNav
// ─────────────────────────────────────────────────────────────────────────────
// Fixed bottom navigation bar visible on mobile only (hidden md+). Provides
// icon-based access to the five primary sections. Labels and active indicator
// styling are minimal here — full polish added in Step 11.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  ArrowLeftRight,
  Wallet,
  BarChart3,
} from "lucide-react";

import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";

// ─────── Nav config ──────────────────────────────────────────────────────────

// Settings and Investments are omitted from mobile nav — five tabs is the
// practical limit; Investments is accessible via the sidebar on desktop.
const MOBILE_NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Accounts", href: ROUTES.ACCOUNTS, icon: Wallet },
  { label: "Transfers", href: ROUTES.TRANSFERS, icon: ArrowLeftRight },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
] as const;

// ─────── Component ───────────────────────────────────────────────────────────

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-stretch border-t border-hairline bg-canvas md:hidden">
      {MOBILE_NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
