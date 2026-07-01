// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────
// Left navigation panel visible on desktop (md+). Contains primary nav links
// and a logout button at the bottom. Hidden on mobile — MobileNav handles
// navigation there. Full active-state styling and collapse behavior added
// in Step 11.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/context/use-auth.hook";
import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";

// ─────── Nav config ──────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Accounts", href: ROUTES.ACCOUNTS, icon: Wallet },
  { label: "Transfers", href: ROUTES.TRANSFERS, icon: ArrowLeftRight },
  { label: "Investments", href: ROUTES.INVESTMENTS, icon: TrendingUp },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
] as const;

// ─────── Component ───────────────────────────────────────────────────────────

const Sidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-hairline bg-canvas md:flex">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-hairline px-4">
        <span className="text-title text-foreground">Sajilo Khata</span>
      </div>

      {/* Nav links — ex-app-shell-row: active state uses primary as the indicator */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-hairline px-2 py-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-sm text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
