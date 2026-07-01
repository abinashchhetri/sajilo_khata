// ─────────────────────────────────────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────────────────────────────────────
// Generic wrapper shapes matching the backend's TransformInterceptor envelope
// exactly. Every API call's response is typed through one of these.
// ─────────────────────────────────────────────────────────────────────────────

export interface TApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface TPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
