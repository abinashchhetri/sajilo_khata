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
import { getPendingShareToken } from "@/lib/pending-share";
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

      // Someone who signed in specifically to save a shared playlist goes
      // back to it, not to the dashboard. The token was stashed before the
      // OAuth round trip because nothing else survives leaving our origin.
      const pendingShare = getPendingShareToken();

      // Hard navigate so the new localStorage token is picked up by the
      // Axios interceptor on the very first request afterwards.
      window.location.href = pendingShare
        ? ROUTES.SHARED_PLAYLIST(pendingShare)
        : ROUTES.DASHBOARD;
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
