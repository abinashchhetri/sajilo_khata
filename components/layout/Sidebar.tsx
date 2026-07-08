"use client";

import { useEffect, useState } from "react";
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
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/context/use-auth.hook";
import { ROUTES } from "@/lib/constants/routes.constants";
import { cn } from "@/lib/utils";

// ─────── Nav config ──────────────────────────────────────────────────────────

const FINANCE_ITEMS = [
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: ReceiptText },
  { label: "Accounts", href: ROUTES.ACCOUNTS, icon: Wallet },
  { label: "Transfers", href: ROUTES.TRANSFERS, icon: ArrowLeftRight },
  { label: "Investments", href: ROUTES.INVESTMENTS, icon: TrendingUp },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
] as const;

const MUSIC_ITEMS = [
  { label: "Library", href: ROUTES.MUSIC, icon: Music },
] as const;

const HEALTH_ITEMS = [
  { label: "Workout", href: ROUTES.HEALTH.WORKOUT, icon: Dumbbell },
  { label: "Nutrition", href: ROUTES.MEALS, icon: UtensilsCrossed },
] as const;

const SECTIONS = [
  { key: "finance", label: "Finance", icon: Wallet, items: FINANCE_ITEMS },
  { key: "music", label: "Music", icon: Music, items: MUSIC_ITEMS },
  { key: "health", label: "Health", icon: Heart, items: HEALTH_ITEMS },
] as const;

type SectionKey = (typeof SECTIONS)[number]["key"];

const LS_KEY = "sidebar_open_sections";

const readLS = (): SectionKey[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SectionKey[]) : [];
  } catch {
    return [];
  }
};

const writeLS = (sections: SectionKey[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(sections));
  } catch {
    // ignore
  }
};

// ─────── Helpers ─────────────────────────────────────────────────────────────

const NavLink = ({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-2.5 rounded-sm px-3 py-1.5 text-[13px] transition-colors",
      isActive
        ? "bg-sidebar-accent font-medium text-primary"
        : "font-normal text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
    )}
  >
    <Icon className="h-3.5 w-3.5 shrink-0" />
    {label}
  </Link>
);

// ─────── Component ───────────────────────────────────────────────────────────

const Sidebar = () => {
  const { logout } = useAuth();
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  // Which accordion section is the active route in?
  const activeSection = (): SectionKey | null => {
    for (const s of SECTIONS) {
      if (s.items.some((item) => isActive(item.href))) return s.key;
    }
    return null;
  };

  const [openSections, setOpenSections] = useState<SectionKey[]>([]);

  // On mount: merge persisted + active section
  useEffect(() => {
    const saved = readLS();
    const active = activeSection();
    const merged = active && !saved.includes(active)
      ? [...saved, active]
      : saved;
    setOpenSections(merged);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When route changes, ensure the active section is always open
  useEffect(() => {
    const active = activeSection();
    if (active) {
      setOpenSections((prev) => {
        if (prev.includes(active)) return prev;
        const next = [...prev, active];
        writeLS(next);
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleAccordionChange = (values: string[]) => {
    const next = values as SectionKey[];
    setOpenSections(next);
    writeLS(next);
  };

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-hairline bg-canvas md:flex">
      {/* Brand */}
      <div className="flex h-14 items-center border-b border-hairline px-4">
        <span className="text-title text-foreground">Sajilo Khata</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-3">
        {/* Dashboard — standalone top link */}
        <Link
          href={ROUTES.DASHBOARD}
          className={cn(
            "flex items-center gap-2.5 rounded-sm px-3 py-1.5 text-[13px] transition-colors",
            isActive(ROUTES.DASHBOARD)
              ? "bg-sidebar-accent font-medium text-primary"
              : "font-normal text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
          )}
        >
          <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
          Dashboard
        </Link>

        <div className="my-1 h-px bg-border" />

        {/* Accordion sections */}
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={handleAccordionChange}
          className="mt-1 space-y-0"
        >
          {SECTIONS.map(({ key, label, icon: SectionIcon, items }) => (
            <AccordionItem key={key} value={key} className="border-none">
              <AccordionTrigger className="hover:bg-transparent [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-muted-foreground">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SectionIcon className="h-4 w-4 shrink-0" />
                  {label}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-1">
                <div className="flex flex-col gap-0.5 pl-0">
                  {items.map(({ label: lbl, href, icon }) => (
                    <NavLink
                      key={href}
                      href={href}
                      icon={icon}
                      label={lbl}
                      isActive={isActive(href)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
