// ─────────────────────────────────────────────────────────────────────────────
// CategoryForm
// ─────────────────────────────────────────────────────────────────────────────
// Form for creating and editing custom categories. Never shown for system
// categories — the parent (CategoryList) is responsible for that guard.
// Keywords are entered as a comma-separated string and split on submit.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ICON_OPTIONS, COLOR_OPTIONS } from "@/lib/constants/category.constants";
import { cn } from "@/lib/utils";
import type { ICategory } from "@/types/categories/categories.types";

// ─────── Schema ──────────────────────────────────────────────────────────────

const CategorySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60, "Name must be 60 characters or fewer"),
  icon: z.string().min(1, "Select an icon"),
  color: z.string().min(1, "Select a color"),
  // Raw textarea value — split into string[] on submit
  keywordsRaw: z.string(),
});

type TCategoryForm = z.infer<typeof CategorySchema>;

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  defaultValues?: Pick<ICategory, "name" | "icon" | "color" | "keywords">;
  onSubmit: (data: { name: string; icon: string; color: string; keywords: string[] }) => Promise<void>;
  isPending: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const CategoryForm = ({ defaultValues, onSubmit, isPending }: Props) => {
  const form = useForm<TCategoryForm>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      icon: defaultValues?.icon ?? ICON_OPTIONS[0].name,
      color: defaultValues?.color ?? COLOR_OPTIONS[0],
      keywordsRaw: defaultValues?.keywords?.join(", ") ?? "",
    },
  });

  const selectedIcon = form.watch("icon");
  const selectedColor = form.watch("color");

  const handleSubmit = form.handleSubmit(async ({ name, icon, color, keywordsRaw }) => {
    const keywords = keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    await onSubmit({ name, icon, color, keywords });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Rent" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Icon picker */}
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ name, component: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => field.onChange(name)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                      selectedIcon === name
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50",
                    )}
                    aria-label={name}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Color picker */}
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => field.onChange(hex)}
                    className={cn(
                      "h-7 w-7 rounded-full border-2 transition-transform",
                      selectedColor === hex
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105",
                    )}
                    style={{ backgroundColor: hex }}
                    aria-label={hex}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Keywords */}
        <FormField
          control={form.control}
          name="keywordsRaw"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords <span className="text-xs text-muted-foreground">(comma-separated, optional)</span></FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. rent, house, apartment"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Saving…" : "Save Category"}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;
