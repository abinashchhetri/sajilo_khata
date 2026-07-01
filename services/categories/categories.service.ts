// ─────────────────────────────────────────────────────────────────────────────
// Categories Service
// ─────────────────────────────────────────────────────────────────────────────
// All HTTP calls related to categories.
// Each function maps to one backend endpoint under /api/v1/categories.
// No side effects — no toasts, no routing, no cache logic here.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/services";
import type { TApiResponse } from "@/types/api.types";
import type {
  ICategory,
  ICreateCategory,
  IUpdateCategory,
} from "@/types/categories/categories.types";

// Fetch all categories visible to the current user (system + own custom)
export const fetchCategories = async (): Promise<TApiResponse<ICategory[]>> => {
  const { data } = await apiClient.get("/categories");
  return data;
};

// Create a custom category — system categories are seeded server-side
export const createCategory = async (
  body: ICreateCategory,
): Promise<TApiResponse<ICategory>> => {
  const { data } = await apiClient.post("/categories", body);
  return data;
};

// Update a custom category by ID — backend rejects attempts on system categories
export const updateCategory = async ({
  categoryId,
  body,
}: {
  categoryId: string;
  body: IUpdateCategory;
}): Promise<TApiResponse<ICategory>> => {
  const { data } = await apiClient.patch(`/categories/${categoryId}`, body);
  return data;
};

// Delete a custom category by ID — backend rejects attempts on system categories
export const deleteCategory = async (categoryId: string): Promise<void> => {
  await apiClient.delete(`/categories/${categoryId}`, { _skipToast: true });
};
