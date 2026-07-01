// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
// Top navigation bar shown on all dashboard pages. Displays the user's avatar
// and name on the right with a logout button. Full responsive behavior
// (mobile hamburger menu, notification bell, etc.) is added in Step 11.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/context/use-auth.hook";

// ─────── Component ───────────────────────────────────────────────────────────

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-hairline bg-canvas px-4 md:px-6">
      <div className="flex items-center gap-2">
        {/* Page title slot — individual pages override via <title> */}
        <span className="text-body-sm font-medium text-muted-foreground">
          Sajilo Khata
        </span>
      </div>

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
  );
};

export default Navbar;
