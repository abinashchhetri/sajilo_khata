// ─────────────────────────────────────────────────────────────────────────────
// PlaylistForm
// ─────────────────────────────────────────────────────────────────────────────
// Shared form for creating and editing playlists. The parent supplies
// defaultValues for edit mode and an onSubmit handler that dispatches to
// either the create or update mutation.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

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
import type { ICreatePlaylist } from "@/types/playlists/playlists.types";

// ─────── Schema ──────────────────────────────────────────────────────────────

const PlaylistSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be 50 characters or fewer"),
  description: z.string().max(200, "Description must be 200 characters or fewer").optional(),
  coverUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

type TPlaylistForm = z.infer<typeof PlaylistSchema>;

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  defaultValues?: Partial<ICreatePlaylist>;
  onSubmit: (data: ICreatePlaylist) => void;
  isPending: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const PlaylistForm = ({ defaultValues, onSubmit, isPending }: Props) => {
  const form = useForm<TPlaylistForm>({
    resolver: zodResolver(PlaylistSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      coverUrl: defaultValues?.coverUrl ?? "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name,
      description: values.description || undefined,
      coverUrl: values.coverUrl || undefined,
    });
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My playlist" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                <span className="text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <textarea
                  placeholder="What's this playlist about?"
                  className="flex min-h-[80px] w-full resize-none rounded-xs border border-input bg-canvas px-2.5 py-1.5 text-body-sm text-foreground placeholder:text-ink-faint focus-visible:border-ring focus-visible:outline-none focus-visible:shadow-level-1 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cover URL */}
        <FormField
          control={form.control}
          name="coverUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Cover URL{" "}
                <span className="text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : (
            "Save Playlist"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PlaylistForm;
