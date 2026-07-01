// ─────────────────────────────────────────────────────────────────────────────
// Category Types
// ─────────────────────────────────────────────────────────────────────────────
// Interfaces scoped to the categories feature.
// Mirrors the backend Category entity and DTOs exactly.
// userId === null identifies a system category (seeded server-side, read-only).
// ─────────────────────────────────────────────────────────────────────────────

export interface ICategory {
  id: string;
  userId: string | null;
  name: string;
  icon: string;
  color: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

// Shape for POST /categories
export interface ICreateCategory {
  name: string;
  icon?: string;
  color?: string;
  keywords?: string[];
}

// Shape for PATCH /categories/:id
export interface IUpdateCategory {
  name?: string;
  icon?: string;
  color?: string;
  keywords?: string[];
}
