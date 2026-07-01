// ─────────────────────────────────────────────────────────────────────────────
// Auth Types
// ─────────────────────────────────────────────────────────────────────────────
// Interfaces scoped to the auth feature.
// Mirrors the backend User entity — if the backend adds a field, update here.
// ─────────────────────────────────────────────────────────────────────────────

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
}
