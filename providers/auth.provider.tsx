// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the current user on mount and exposes auth state to the entire app
// via AuthContext. Also provides a logout function that clears cookies via the
// backend and redirects to /login — components never call the service directly.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { createContext, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useGetCurrentUser } from "@/hooks/react-query/auth/get-current-user.hook";
import { logout as logoutService } from "@/services/auth/auth.service";
import { ROUTES } from "@/lib/constants/routes.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { IUser } from "@/types/auth/auth.types";

// ─────── Types ───────────────────────────────────────────────────────────────

export interface IAuthContext {
  user: IUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

// ─────── Context ─────────────────────────────────────────────────────────────

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
});

// ─────── Component ───────────────────────────────────────────────────────────

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useGetCurrentUser();

  const logout = useCallback(async () => {
    await logoutService();
    toast.success(TOAST_MESSAGES.AUTH.LOGOUT_SUCCESS);
    router.push(ROUTES.LOGIN);
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
