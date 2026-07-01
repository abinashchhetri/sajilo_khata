// ─────────────────────────────────────────────────────────────────────────────
// useHandleUpdateCategory
// ─────────────────────────────────────────────────────────────────────────────
// Updates a custom category's name, icon, color, or keywords.
// System categories are blocked in the UI before this hook is ever called.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateCategory } from "@/services/categories/categories.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleUpdateCategory = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES.ALL] });
      toast.success(TOAST_MESSAGES.CATEGORIES.UPDATED);
    },
  });

  const handleUpdateCategory = async (
    ...args: Parameters<typeof mutateAsync>
  ) => mutateAsync(...args);

  return { handleUpdateCategory, isPending };
};
