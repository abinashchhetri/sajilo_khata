// ─────────────────────────────────────────────────────────────────────────────
// useHandleDeleteCategory
// ─────────────────────────────────────────────────────────────────────────────
// Deletes a custom category. The delete service sets _skipToast so the Axios
// interceptor stays silent — this onError is the sole toast source.
// System categories are blocked in the UI before this hook is ever called.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteCategory } from "@/services/categories/categories.service";
import { queryClient } from "@/providers/react-query.provider";
import { QUERY_KEYS } from "@/lib/constants/query-keys.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

export const useHandleDeleteCategory = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES.ALL] });
      toast.success(TOAST_MESSAGES.CATEGORIES.DELETED);
    },
    onError: () => {
      toast.error(TOAST_MESSAGES.GENERIC.SOMETHING_WENT_WRONG);
    },
  });

  const handleDeleteCategory = async (categoryId: string) =>
    mutateAsync(categoryId);

  return { handleDeleteCategory, isPending };
};
