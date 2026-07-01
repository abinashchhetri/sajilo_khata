// ─────────────────────────────────────────────────────────────────────────────
// Settings Page
// ─────────────────────────────────────────────────────────────────────────────
// Hub for all settings sections. Each section is a card that links to its own
// sub-page. New sections (default account, notifications, etc.) are added here.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import { Tag, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

// ─────── Settings sections config ────────────────────────────────────────────

const SETTINGS_SECTIONS = [
  {
    href: "/settings/categories",
    icon: Tag,
    label: "Categories",
    description: "Manage system and custom categories for labelling transactions",
  },
] as const;

// ─────── Component ───────────────────────────────────────────────────────────

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-heading-3 text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your preferences and app configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SETTINGS_SECTIONS.map(({ href, icon: Icon, label, description }) => (
          <Link key={href} href={href}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
