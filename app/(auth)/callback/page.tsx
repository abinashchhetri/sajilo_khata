"use client";

// ─────────────────────────────────────────────────────────────────────────────
// /callback — Google OAuth landing page for Safari ITP compatibility
// ─────────────────────────────────────────────────────────────────────────────
// Safari's Intelligent Tracking Prevention (ITP) blocks third-party cookies
// set by a cross-origin response (backend on trycloudflare.com, frontend on
// vercel.app). The backend embeds the JWT in the redirect URL hash fragment
// (#at=<accessToken>&rt=<refreshToken>) instead of relying solely on cookies.
//
// Hash fragments are never sent to the server, never appear in server logs,
// and are stripped from the Referer header — safe to carry short-lived JWTs.
//
// This page reads the hash, persists the tokens to localStorage, then hard-
// navigates to /dashboard. All subsequent API calls attach the token as
// "Authorization: Bearer" so Safari can authenticate without cookies.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { ROUTES } from "@/lib/constants/routes.constants";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "@/lib/constants/auth-storage.constants";

const CallbackPage = () => {
  useEffect(() => {
    const hash = window.location.hash.slice(1); // strip leading '#'
    const params = new URLSearchParams(hash);
    const at = params.get("at");
    const rt = params.get("rt");

    if (at) {
      localStorage.setItem(ACCESS_TOKEN_KEY, at);
      if (rt) localStorage.setItem(REFRESH_TOKEN_KEY, rt);
      // Hard navigate so the new localStorage token is picked up by the
      // Axios interceptor on the very first request in the dashboard.
      window.location.href = ROUTES.DASHBOARD;
    } else {
      // No token in hash — something went wrong. Fall back to login.
      window.location.href = ROUTES.LOGIN;
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-notion-bg">
      <Loader2 className="h-8 w-8 animate-spin text-notion-text-secondary" />
    </div>
  );
};

export default CallbackPage;
