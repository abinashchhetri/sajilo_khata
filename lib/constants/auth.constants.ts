// ─────────────────────────────────────────────────────────────────────────────
// Auth Constants
// ─────────────────────────────────────────────────────────────────────────────
// JWT lives in httpOnly cookies set by the backend — the frontend never reads
// or stores the token value directly. These names just need to match what
// the backend sets so logout/clearing logic knows what to ask the backend to clear.
// ─────────────────────────────────────────────────────────────────────────────

export const ACCESS_TOKEN_COOKIE_NAME = "access_token";
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
