// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Layout
// ─────────────────────────────────────────────────────────────────────────────
// Route-group layout for all protected pages under (dashboard)/.
// Two guards run in sequence:
//   1. Auth guard — redirects unauthenticated users to /login.
//   2. Onboarding guard — redirects users with no accounts to /setup.
//      The /setup page itself is inside this route group (for Provider context)
//      but renders bare — no Sidebar/Navbar — so it never triggers a loop.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useAuth } from "@/hooks/context/use-auth.hook";
import { useGetOnboardingStatus } from "@/hooks/react-query/auth/get-onboarding-status.hook";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import MusicPlayerProvider from "@/providers/music-player.provider";
import MusicPlayer from "@/components/music/MusicPlayer";
import { ROUTES } from "@/lib/constants/routes.constants";

// ─────── Component ───────────────────────────────────────────────────────────

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const { isOnboardingComplete, isLoading: onboardingLoading } =
    useGetOnboardingStatus();
  const router = useRouter();
  const pathname = usePathname();

  // Auth redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  // Onboarding redirect — only fires once both auth and onboarding are resolved
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      !onboardingLoading &&
      !isOnboardingComplete &&
      pathname !== ROUTES.SETUP
    ) {
      router.replace(ROUTES.SETUP);
    }
  }, [isLoading, isAuthenticated, onboardingLoading, isOnboardingComplete, pathname, router]);

  // Spinner while either loading state is pending
  if (isLoading || (isAuthenticated && onboardingLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Render nothing while auth redirect is in flight
  if (!isAuthenticated) return null;

  // Setup page — bare layout (no sidebar/navbar) so new users can create their
  // first account without the normal shell appearing before onboarding completes
  if (pathname === ROUTES.SETUP && !isOnboardingComplete) {
    return (
      <MusicPlayerProvider>
        {children}
      </MusicPlayerProvider>
    );
  }

  // Render nothing while onboarding redirect is in flight
  if (!isOnboardingComplete) return null;

  return (
    <MusicPlayerProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar />
          {/* pb-24 reserves space for the fixed player bar at the bottom */}
          <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-6 md:pb-24">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>
      <MusicPlayer />
    </MusicPlayerProvider>
  );
};

export default DashboardLayout;
