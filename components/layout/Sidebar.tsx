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
  Music,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/context/use-auth.hook";
import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";

// ─────── Nav config ──────────────────────────────────────────────────────────

const FINANCE_NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Accounts", href: ROUTES.ACCOUNTS, icon: Wallet },
  { label: "Transfers", href: ROUTES.TRANSFERS, icon: ArrowLeftRight },
  { label: "Investments", href: ROUTES.INVESTMENTS, icon: TrendingUp },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
] as const;

const MUSIC_NAV_ITEMS = [
  { label: "Music", href: ROUTES.MUSIC, icon: Music },
] as const;

const HEALTH_NAV_ITEMS = [
  { label: "Fitness", href: ROUTES.WORKOUTS, icon: Dumbbell },
  { label: "Nutrition", href: ROUTES.MEALS, icon: UtensilsCrossed },
] as const;

// ─────── Component ───────────────────────────────────────────────────────────

const NavLink = ({
  href,
  icon: Icon,
  label,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) => (
  <Link
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

const Sidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-hairline bg-canvas md:flex">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-hairline px-4">
        <span className="text-title text-foreground">Sajilo Khata</span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col px-2 py-4">
        {/* Finance group */}
        <div className="flex flex-col gap-1">
          {FINANCE_NAV_ITEMS.map(({ label, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={label}
              isActive={isActive(href)}
            />
          ))}
        </div>

        {/* Separator between finance and music */}
        <div className="mx-1 my-3 h-px bg-border" />

        {/* Music group */}
        <div className="flex flex-col gap-1">
          {MUSIC_NAV_ITEMS.map(({ label, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={label}
              isActive={isActive(href)}
            />
          ))}
        </div>

        {/* Separator between music and health */}
        <div className="mx-1 my-3 h-px bg-border" />

        {/* Health group */}
        <div className="flex flex-col gap-1">
          {HEALTH_NAV_ITEMS.map(({ label, href, icon }) => (
            <NavLink
              key={href}
              href={href}
              icon={icon}
              label={label}
              isActive={isActive(href)}
            />
          ))}
        </div>
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
