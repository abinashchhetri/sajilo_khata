// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Layout
// ─────────────────────────────────────────────────────────────────────────────
// Route-group layout for all protected pages under (dashboard)/.
// Checks auth state once here — every child page is unconditionally protected,
// so there is no per-page guard needed. Shows a spinner while auth resolves to
// avoid a flash of unauthenticated content before the redirect fires.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/context/use-auth.hook";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { ROUTES } from "@/lib/constants/routes.constants";

// ─────── Component ───────────────────────────────────────────────────────────

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Render nothing while the redirect is in flight so there's no content flash
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        {/* pb-16 creates space for the fixed MobileNav on small screens */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default DashboardLayout;
