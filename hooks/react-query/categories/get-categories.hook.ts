// ─────────────────────────────────────────────────────────────────────────────
// useGetCategories
// ─────────────────────────────────────────────────────────────────────────────
// Fetches all categories visible to the current user (system + own custom).
// Used by the settings categories page and any future transaction form that
// needs a category picker.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchCategories } from "@/services/categories/categories.service";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import type { ICategory } from "@/types/categories/categories.types";

export const useGetCategories = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES.ALL],
    queryFn: fetchCategories,
  });

  const categories: ICategory[] = data?.data ?? [];
  const systemCategories = categories.filter((c) => c.userId === null);
  const customCategories = categories.filter((c) => c.userId !== null);

  return { categories, systemCategories, customCategories, isLoading, isError };
};
