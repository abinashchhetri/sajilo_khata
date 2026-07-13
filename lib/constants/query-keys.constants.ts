// ─────────────────────────────────────────────────────────────────────────────
// QUERY_KEYS
// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for all TanStack Query cache keys.
// Changing a key here updates every hook that uses it — no scattered strings.
// ─────────────────────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  AUTH: {
    CURRENT_USER: "current-user",
    ONBOARDING_STATUS: "onboarding-status",
  },

  ACCOUNTS: {
    ALL: "all-accounts",
    SINGLE: (id: string) => ["account", id] as const,
    DEFAULT: "default-account",
    VOICE_KEYWORDS: "accounts-voice-keywords",
  },

  TRANSACTIONS: {
    ALL: (filters?: object) => ["all-transactions", filters] as const,
    SINGLE: (id: string) => ["transaction", id] as const,
  },

  TRANSFERS: {
    ALL: "all-transfers",
    SINGLE: (id: string) => ["transfer", id] as const,
  },

  INVESTMENTS: {
    ALL: "all-investments",
    SINGLE: (id: string) => ["investment", id] as const,
    SUMMARY: "investments-summary",
  },

  INVESTMENT_TRANSACTIONS: {
    // Omitting params yields a 2-element key so invalidateQueries matches
    // every cached page for the investment, not just the unfiltered one.
    ALL: (investmentId: string, params?: object) =>
      params === undefined
        ? (["investment-transactions", investmentId] as const)
        : (["investment-transactions", investmentId, params] as const),
  },

  ANALYTICS: {
    DASHBOARD: (range?: object) => ["analytics-dashboard", range] as const,
    CATEGORIES: (range?: object) => ["analytics-categories", range] as const,
    ACCOUNTS_VIEW: "analytics-accounts",
    TOP_ITEMS: (range?: object) => ["analytics-top-items", range] as const,
    ITEM_TREND: (itemName: string) =>
      ["analytics-item-trend", itemName] as const,
    NET_WORTH: "analytics-net-worth",
    RECENT: "analytics-recent",
  },

  CATEGORIES: {
    ALL: "all-categories",
  },

  MUSIC: {
    PRESIGNED: (id: string) => ["music-presigned", id] as const,
    RECOMMENDATIONS: (id: string) => ["music-recommendations", id] as const,
    HISTORY: (params?: object) => ["music-history", params] as const,
    SEARCH: (q: string) => ["music-search", q] as const,
    FIND: (q: string) => ["music-find", q] as const,
    QUEUE: "music-queue",
  },

  PLAYLISTS: {
    ALL: "all-playlists",
    SINGLE: (id: string) => ["playlist", id] as const,
  },

  WORKOUT: {
    PLAN: "workout-plan",
    PLAN_DAY: (day: string) => ["workout-plan-day", day] as const,
    SESSIONS: (params?: Record<string, unknown>) =>
      ["workout-sessions", params] as const,
    SESSION: (id: string) => ["workout-session", id] as const,
    TODAY_SESSION: "workout-today-session",
    PROGRESS: (exerciseName: string) =>
      ["workout-progress", exerciseName] as const,
  },

  MEALS: {
    TODAY: "meals-today",
    PLAN: "meals-plan",
    PREP: "meals-prep",
    LOGS: (filters?: object) => ["meal-logs", filters] as const,
  },

  SOLANA_PAY: {
    REQUEST: (id: string) => ["solana-pay-request", id] as const,
    STATUS: (id: string) => ["solana-pay-status", id] as const,
  },

  X402: {
    PREVIEW: ["x402-preview"] as const,
  },
} as const;
