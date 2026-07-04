// ─────────────────────────────────────────────────────────────────────────────
// TOAST_MESSAGES
// ─────────────────────────────────────────────────────────────────────────────
// Every user-facing toast string lives here.
// Never write a toast string inline in a hook or component.
// ─────────────────────────────────────────────────────────────────────────────

export const TOAST_MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: "Logged in successfully",
    LOGOUT_SUCCESS: "Logged out successfully",
    SESSION_EXPIRED: "Your session has expired, please log in again",
  },

  ACCOUNTS: {
    CREATED: "Account added successfully",
    UPDATED: "Account updated",
    DELETED: "Account removed",
    DELETE_BLOCKED: "Cannot delete an account with existing transactions",
  },

  TRANSACTIONS: {
    CREATED: "Transaction saved",
    UPDATED: "Transaction updated",
    DELETED: "Transaction deleted",
    VOICE_PARSE_FAILED: "Couldn't catch that — try again or use the form",
  },

  TRANSFERS: {
    CREATED: "Transfer completed",
    DELETED: "Transfer removed",
    SAME_ACCOUNT_ERROR: "Choose two different accounts to transfer between",
    INSUFFICIENT_BALANCE: "Insufficient balance",
  },

  INVESTMENTS: {
    CREATED: "Investment added",
    UPDATED: "Investment value updated",
    DELETED: "Investment removed",
  },

  INVESTMENT_TRANSACTIONS: {
    CREATED: "Transaction recorded",
    DELETED: "Transaction removed",
  },

  CATEGORIES: {
    CREATED: "Category added",
    UPDATED: "Category updated",
    DELETED: "Category removed",
    SYSTEM_READONLY: "System categories cannot be edited or deleted",
  },

  GENERIC: {
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
    SAVED: "Changes saved",
    DELETED: "Deleted successfully",
    UNAUTHORIZED: "You need to be logged in to do that",
  },

  MUSIC: {
    PLAY_ERROR: "Could not load track. Try again.",
    PREPARE_FAILED: "Next track is not ready yet.",
    DOWNLOAD_STARTED: "Track is being prepared...",
  },

  PLAYLISTS: {
    CREATED: "Playlist created",
    UPDATED: "Playlist updated",
    DELETED: "Playlist deleted",
    TRACK_ADDED: "Track added to playlist",
    TRACK_REMOVED: "Track removed from playlist",
    MUST_BE_CACHED: "Track must finish loading before adding to a playlist",
  },
} as const;
