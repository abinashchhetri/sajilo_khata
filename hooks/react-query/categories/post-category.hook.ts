// ─────────────────────────────────────────────────────────────────────────────
// useHandleCreateCategory
// ─────────────────────────────────────────────────────────────────────────────
// Creates a custom category. On success, invalidates the category list so the
// new entry appears immediately.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createCategory } from "@/services/categories/categories.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleCreateCategory = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES.ALL] });
      toast.success(TOAST_MESSAGES.CATEGORIES.CREATED);
    },
  });

  const handleCreateCategory = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleCreateCategory, isPending };
};
