"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Setup Page
// ─────────────────────────────────────────────────────────────────────────────
// First-time user onboarding. Forces the user to create at least one account
// before entering the dashboard. Once created, redirects to /dashboard.
// Skipped entirely for returning users who already have an account.
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "next/navigation";

import AccountForm from "@/components/accounts/AccountForm";
import { useHandleCreateAccount } from "@/hooks/react-query/accounts/post-account.hook";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { ROUTES } from "@/lib/constants/routes.constants";
import type { TCreateAccount } from "@/lib/validations/create-account.validation";

// ─────── Component ───────────────────────────────────────────────────────────

const SetupPage = () => {
  const router = useRouter();
  const { handleCreateAccount, isPending } = useHandleCreateAccount();

  const handleSetup = async (data: TCreateAccount) => {
    await handleCreateAccount(data);
    // Re-evaluate onboarding status so the layout stops redirecting here
    await queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.AUTH.ONBOARDING_STATUS],
    });
    router.replace(ROUTES.DASHBOARD);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-heading-3 font-bold text-foreground">
            Welcome to Sajilo Khata
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your first account to get started
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-level-1">
          <AccountForm
            mode="create"
            onSubmit={handleSetup}
            isPending={isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
