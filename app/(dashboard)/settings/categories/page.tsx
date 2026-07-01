// ─────────────────────────────────────────────────────────────────────────────
// Settings — Categories Page
// ─────────────────────────────────────────────────────────────────────────────
// Lists all categories split into two sections: system (read-only) and custom
// (fully editable). Users can add new custom categories via the dialog.
// System categories are seeded by the backend and cannot be modified here.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CategoryList from "@/components/categories/CategoryList";
import CategoryForm from "@/components/categories/CategoryForm";
import Loader from "@/components/shared/Loader";
import { useGetCategories } from "@/hooks/react-query/categories/get-categories.hook";
import { useHandleCreateCategory } from "@/hooks/react-query/categories/post-category.hook";

// ─────── Component ───────────────────────────────────────────────────────────

const CategoriesSettingsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { systemCategories, customCategories, isLoading } = useGetCategories();
  const { handleCreateCategory, isPending } = useHandleCreateCategory();

  const handleCreate = async (data: Parameters<typeof handleCreateCategory>[0]) => {
    await handleCreateCategory(data);
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            System categories are read-only. Add custom categories for your own spending patterns.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <Loader label="Loading categories…" className="py-16" />
      ) : (
        <CategoryList
          systemCategories={systemCategories}
          customCategories={customCategories}
        />
      )}

      {/* Create dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSubmit={handleCreate} isPending={isPending} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesSettingsPage;
