// ─────────────────────────────────────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────────────────────────────────────
// All app routes in one place.
// Use these when doing router.push() or building href values.
// Never write a route path string directly in a component or hook.
// ─────────────────────────────────────────────────────────────────────────────

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  CALLBACK: "/callback",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  TRANSACTION_DETAIL: (id: string) => `/transactions/${id}`,
  ACCOUNTS: "/accounts",
  ACCOUNT_DETAIL: (id: string) => `/accounts/${id}`,
  TRANSFERS: "/accounts/transfers",
  INVESTMENTS: "/investments",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
  MUSIC: "/music",
  PLAYLIST_DETAIL: (id: string) => `/music/playlists/${id}`,
  SETUP: "/setup",
  HEALTH: {
    WORKOUT: "/health/workout",
    WORKOUT_HISTORY: "/health/workout/history",
  },
  MEALS: "/meals",
} as const;
