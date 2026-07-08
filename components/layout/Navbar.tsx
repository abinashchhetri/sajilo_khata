"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ReceiptText,
  ArrowLeftRight,
  Wallet,
  TrendingUp,
  BarChart3,
  Settings,
  Music,
  Dumbbell,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/context/use-auth.hook";
import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";

// ─────── Nav config (mirrors Sidebar) ────────────────────────────────────────

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

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-canvas px-4 md:px-6">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Brand — centered on mobile, left-aligned on desktop */}
        <span className="absolute left-1/2 -translate-x-1/2 text-body-sm font-medium text-muted-foreground md:static md:translate-x-0">
          Sajilo Khata
        </span>

        {/* Right: avatar + name + logout */}
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
          )}
          <span className="hidden text-sm font-medium md:inline">
            {user?.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* ── Mobile side drawer ─────────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          drawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeDrawer}
        aria-hidden
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-canvas shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Drawer header */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-hairline px-4">
          <span className="text-title text-foreground">Sajilo Khata</span>
          <button
            onClick={closeDrawer}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
          <div className="flex flex-col gap-0.5">
            {FINANCE_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeDrawer}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          <div className="mx-1 my-3 h-px bg-border" />

          <div className="flex flex-col gap-0.5">
            {MUSIC_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeDrawer}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>

          <div className="mx-1 my-3 h-px bg-border" />

          <div className="flex flex-col gap-0.5">
            {HEALTH_NAV_ITEMS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={closeDrawer}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors",
                  isActive(href)
                    ? "bg-sidebar-accent text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer: user card + logout */}
        <div className="shrink-0 border-t border-hairline px-2 py-3">
          <div className="mb-2 flex items-center gap-3 rounded-sm px-3 py-2">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
            )}
            <p className="min-w-0 truncate text-sm font-medium text-foreground">
              {user?.name}
            </p>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-sm text-muted-foreground hover:text-foreground"
            onClick={() => {
              logout();
              closeDrawer();
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
