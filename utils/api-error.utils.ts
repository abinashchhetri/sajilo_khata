// ─────────────────────────────────────────────────────────────────────────────
// API Error Utilities
// ─────────────────────────────────────────────────────────────────────────────
// The shared Axios instance rejects with `error.response.data` (see
// services/index.ts), so a caught error IS the backend's error envelope:
//   { success: false, statusCode, message, timestamp, path }
//
// The playlist-import endpoints return messages written specifically to be
// shown to users ("That is a Spotify album link, not a playlist..."), so these
// helpers read them safely without casting to `any`.
// ─────────────────────────────────────────────────────────────────────────────

interface IApiErrorEnvelope {
  success?: boolean;
  statusCode?: number;
  message?: string;
}

const asEnvelope = (error: unknown): IApiErrorEnvelope =>
  typeof error === "object" && error !== null
    ? (error as IApiErrorEnvelope)
    : {};

// Reads the server's user-facing message, falling back when absent.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const message = asEnvelope(error).message;
  return typeof message === "string" && message.length > 0 ? message : fallback;
};

// Reads the HTTP status so callers can branch (e.g. 409 = import already running).
export const getApiErrorStatus = (error: unknown): number | undefined =>
  asEnvelope(error).statusCode;
