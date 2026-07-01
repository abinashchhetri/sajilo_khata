// ─────────────────────────────────────────────────────────────────────────────
// CategoryList
// ─────────────────────────────────────────────────────────────────────────────
// Renders two sections: system categories (read-only, no action affordances)
// and custom categories (editable and deletable). Edit/delete are shown only
// for custom categories — system category rows have no action buttons at all,
// not even disabled ones, to make the read-only status unambiguous.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import CategoryBadge from "@/components/shared/CategoryBadge";
import CategoryForm from "@/components/categories/CategoryForm";
import { useHandleUpdateCategory } from "@/hooks/react-query/categories/update-category.hook";
import { useHandleDeleteCategory } from "@/hooks/react-query/categories/delete-category.hook";
import type { ICategory, IUpdateCategory } from "@/types/categories/categories.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  systemCategories: ICategory[];
  customCategories: ICategory[];
}

// ─────── Sub-component ───────────────────────────────────────────────────────

interface CategoryRowProps {
  category: ICategory;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CategoryRow = ({ category, onEdit, onDelete }: CategoryRowProps) => (
  <div className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <CategoryBadge category={category} />
        {category.userId === null && (
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
            System
          </span>
        )}
      </div>
      {category.keywords.length > 0 && (
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {category.keywords.join(", ")}
        </p>
      )}
    </div>

    {/* Actions only appear for custom categories */}
    {onEdit && onDelete && (
      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    )}
  </div>
);

// ─────── Component ───────────────────────────────────────────────────────────

const CategoryList = ({ systemCategories, customCategories }: Props) => {
  const [editTarget, setEditTarget] = useState<ICategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ICategory | null>(null);

  const { handleUpdateCategory, isPending: isUpdating } = useHandleUpdateCategory();
  const { handleDeleteCategory, isPending: isDeleting } = useHandleDeleteCategory();

  const handleEdit = async (data: IUpdateCategory & { keywords: string[] }) => {
    if (!editTarget) return;
    await handleUpdateCategory({ categoryId: editTarget.id, body: data });
    setEditTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await handleDeleteCategory(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* System categories — read-only */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          System Categories
        </h3>
        <div className="space-y-2">
          {systemCategories.map((cat) => (
            <CategoryRow key={cat.id} category={cat} />
          ))}
        </div>
      </div>

      {/* Custom categories — fully editable */}
      {customCategories.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Custom Categories
          </h3>
          <div className="space-y-2">
            {customCategories.map((cat) => (
              <CategoryRow
                key={cat.id}
                category={cat}
                onEdit={() => setEditTarget(cat)}
                onDelete={() => setDeleteTarget(cat)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <CategoryForm
              defaultValues={editTarget}
              onSubmit={handleEdit}
              isPending={isUpdating}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="Transactions already labelled with this category will lose their category. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
};

export default CategoryList;
