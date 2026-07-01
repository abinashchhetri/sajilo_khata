// ─────────────────────────────────────────────────────────────────────────────
// useAuth
// ─────────────────────────────────────────────────────────────────────────────
// Thin hook that reads from AuthProvider's context.
// Returns { user, isLoading, isAuthenticated, logout }.
// Throws if used outside of AuthProvider.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useContext } from "react";

import { AuthContext } from "@/providers/auth.provider";
import type { IAuthContext } from "@/providers/auth.provider";

export const useAuth = (): IAuthContext => useContext(AuthContext);
