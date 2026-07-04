// ─────────────────────────────────────────────────────────────────────────────
// AccountForm
// ─────────────────────────────────────────────────────────────────────────────
// Shared form for creating and editing accounts.
// In edit mode: the type select is disabled (type is immutable after creation)
// and the initial balance field is hidden (balance is derived from transactions).
// Voice Keywords field (edit only): tag chips the voice parser uses to match
// spoken account names — user types a word and presses Enter or comma to add.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateAccountSchema,
  type TCreateAccount,
} from "@/lib/validations/create-account.validation";
import { EAccountType, type TAccountType } from "@/types/global.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  mode: "create" | "edit";
  defaultValues?: {
    name?: string;
    type?: TAccountType;
  };
  defaultVoiceKeywords?: string[];
  onSubmit: (data: TCreateAccount, voiceKeywords: string[]) => Promise<void>;
  isPending: boolean;
}

// ─────── Component ───────────────────────────────────────────────────────────

const AccountForm = ({
  mode,
  defaultValues,
  defaultVoiceKeywords,
  onSubmit,
  isPending,
}: Props) => {
  const form = useForm<TCreateAccount>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? EAccountType.CASH,
      initialBalance: 0,
    },
  });

  // Voice keywords — edit mode only, managed outside Zod schema
  const [voiceKeywords, setVoiceKeywords] = useState<string[]>(
    defaultVoiceKeywords ?? [],
  );
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const cleaned = raw.trim().toLowerCase();
    if (cleaned && !voiceKeywords.includes(cleaned)) {
      setVoiceKeywords((prev) => [...prev, cleaned]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setVoiceKeywords((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === "Backspace" && !tagInput && voiceKeywords.length > 0) {
      removeTag(voiceKeywords[voiceKeywords.length - 1]);
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values, voiceKeywords);
    if (mode === "create") {
      form.reset();
      setVoiceKeywords([]);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Account name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Savings Account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account type — immutable after creation */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={mode === "edit"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={EAccountType.CASH}>Cash</SelectItem>
                  <SelectItem value={EAccountType.BANK}>Bank</SelectItem>
                  <SelectItem value={EAccountType.ESEWA}>eSewa</SelectItem>
                  <SelectItem value={EAccountType.KHALTI}>Khalti</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Initial balance — create mode only */}
        {mode === "create" && (
          <FormField
            control={form.control}
            name="initialBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Balance (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Voice Keywords — edit mode only */}
        {mode === "edit" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">
              Voice Keywords{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            {/* Tag chips + inline input */}
            <div
              className="flex min-h-9 flex-wrap gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-text"
              onClick={() => tagInputRef.current?.focus()}
            >
              {voiceKeywords.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => { if (tagInput) addTag(tagInput); }}
                placeholder={voiceKeywords.length === 0 ? "nabil, my bank, savings…" : ""}
                className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Words you say to identify this account. Press Enter or comma to add.
            </p>
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? mode === "create"
              ? "Adding…"
              : "Saving…"
            : mode === "create"
              ? "Add Account"
              : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default AccountForm;
