// ─────────────────────────────────────────────────────────────────────────────
// Pending Share
// ─────────────────────────────────────────────────────────────────────────────
// Remembers which shared playlist a signed-out visitor was trying to save, so
// they land back on it after signing in instead of on the dashboard.
//
// Why localStorage rather than a ?next= param: the OAuth round trip leaves our
// origin entirely (app → backend → Google → backend → /callback), and nothing
// carries a query string through that. localStorage is the only thing that
// survives it intact.
//
// Entries expire — someone who abandons sign-in and returns days later should
// not be yanked into a share flow they have forgotten about.
// ─────────────────────────────────────────────────────────────────────────────

const PENDING_SHARE_KEY = "pending_share_token";
const PENDING_SHARE_TTL_MS = 1000 * 60 * 30; // 30 minutes

interface IPendingShare {
  token: string;
  savedAt: number;
}

// Called just before sending a signed-out visitor to log in.
export const setPendingShareToken = (token: string): void => {
  if (typeof window === "undefined" || !token) return;
  try {
    const payload: IPendingShare = { token, savedAt: Date.now() };
    localStorage.setItem(PENDING_SHARE_KEY, JSON.stringify(payload));
  } catch {
    // Private-mode / quota failures are non-fatal — the user simply lands on
    // the dashboard instead, which is inconvenient but not broken.
  }
};

// Reads and validates the pending token. Returns null when absent, malformed
// or expired, clearing it in the latter two cases so it cannot linger.
export const getPendingShareToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_SHARE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    const token =
      typeof parsed === "object" && parsed !== null
        ? (parsed as IPendingShare).token
        : undefined;
    const savedAt =
      typeof parsed === "object" && parsed !== null
        ? (parsed as IPendingShare).savedAt
        : undefined;

    if (typeof token !== "string" || typeof savedAt !== "number") {
      clearPendingShareToken();
      return null;
    }
    if (Date.now() - savedAt > PENDING_SHARE_TTL_MS) {
      clearPendingShareToken();
      return null;
    }
    return token;
  } catch {
    clearPendingShareToken();
    return null;
  }
};

// Always call once the intent has been acted on, successfully or not — a
// token left behind would hijack the next sign-in too.
export const clearPendingShareToken = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_SHARE_KEY);
  } catch {
    // nothing useful to do
  }
};
