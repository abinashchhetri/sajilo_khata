// ─────────────────────────────────────────────────────────────────────────────
// Login Page
// ─────────────────────────────────────────────────────────────────────────────
// Shows the Google OAuth sign-in button. If the user is already authenticated
// (e.g. they navigated here with a valid session), redirects straight to
// /dashboard so they skip the login screen without any action.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/context/use-auth.hook";
import GoogleLoginButton from "@/components/shared/GoogleLoginButton";
import { ROUTES } from "@/lib/constants/routes.constants";

// ─────── Component ───────────────────────────────────────────────────────────

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="text-center">
          <h1 className="text-display-2 text-foreground">Sajilo Khata</h1>
          <p className="mt-2 text-body-sm text-ink-muted">
            Your personal finance tracker for Nepal
          </p>
        </div>

        {/* Sign-in */}
        <div className="space-y-4">
          <GoogleLoginButton />
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
