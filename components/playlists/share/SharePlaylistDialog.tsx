// ─────────────────────────────────────────────────────────────────────────────
// SharePlaylistDialog
// ─────────────────────────────────────────────────────────────────────────────
// Owner-side sharing: fetch the link, copy or share it, and stop sharing.
//
// The link is fetched when the dialog opens. Getting it is idempotent, so
// reopening returns the same URL — the button is "Get link", never
// "Regenerate", because re-issuing would break links already sent.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2, Loader2, Share2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHandleCreateShareLink } from "@/hooks/react-query/playlist-share/use-share-link.hook";
import { useHandleRevokeShare } from "@/hooks/react-query/playlist-share/use-revoke-share.hook";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  playlistId: string;
  playlistName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─────── Helpers ─────────────────────────────────────────────────────────────

// navigator.clipboard needs a secure context and can be blocked outright;
// the execCommand path is deprecated but still the only fallback that works
// in those cases.
const copyText = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
};

// ─────── Component ───────────────────────────────────────────────────────────

const SharePlaylistDialog = ({
  playlistId,
  playlistName,
  open,
  onOpenChange,
}: Props) => {
  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(false);

  const { handleCreateShareLink, shareLink, isPending, resetShareLink } =
    useHandleCreateShareLink();
  const { handleRevokeShare, isPending: revokePending } =
    useHandleRevokeShare();

  // Fetch (or create) the link as soon as the dialog opens.
  useEffect(() => {
    if (open && !shareLink && !isPending) {
      handleCreateShareLink(playlistId).catch(() => undefined);
    }
    if (!open) {
      setCopied(false);
      setConfirmRevoke(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCopy = async () => {
    if (!shareLink) return;
    const ok = await copyText(shareLink.shareUrl);
    if (!ok) return;
    setCopied(true);
    toast.success(TOAST_MESSAGES.SHARE.LINK_COPIED);
    setTimeout(() => setCopied(false), 2000);
  };

  const onNativeShare = async () => {
    if (!shareLink) return;
    try {
      await navigator.share({
        title: playlistName,
        text: `Listen to "${playlistName}" on Sajilo Khata`,
        url: shareLink.shareUrl,
      });
    } catch {
      // Dismissing the share sheet throws — nothing to report.
    }
  };

  const onRevoke = async () => {
    await handleRevokeShare(playlistId);
    resetShareLink();
    onOpenChange(false);
  };

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-level-2">
        <DialogHeader>
          <DialogTitle className="text-title">Share playlist</DialogTitle>
          <DialogDescription className="text-body-sm text-muted-foreground">
            Anyone with this link can see {playlistName} and save their own
            copy. They don&apos;t need an account to view it.
          </DialogDescription>
        </DialogHeader>

        {/* ── Loading ───────────────────────────────────────────────────── */}
        {isPending && !shareLink && (
          <div className="space-y-2">
            <Skeleton className="h-9 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        )}

        {/* ── Link ──────────────────────────────────────────────────────── */}
        {shareLink && !confirmRevoke && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareLink.shareUrl}
                onFocus={(e) => e.currentTarget.select()}
                aria-label="Share link"
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={onCopy}
                aria-label="Copy share link"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {canNativeShare && (
                <Button size="sm" onClick={onNativeShare}>
                  <Share2 size={14} />
                  Share
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmRevoke(true)}
              >
                <Trash2 size={13} />
                Stop sharing
              </Button>
            </div>

            <p className="flex items-start gap-2 text-caption text-muted-foreground">
              <Link2 size={13} className="mt-0.5 shrink-0" />
              This is the only link for this playlist. Opening this dialog
              again gives you the same one.
            </p>
          </div>
        )}

        {/* ── Revoke confirm ────────────────────────────────────────────── */}
        {confirmRevoke && (
          <div className="space-y-4">
            <div className="rounded-md bg-muted px-3 py-2.5">
              <p className="text-body-sm text-foreground">
                Stop sharing this playlist?
              </p>
              <p className="mt-1 text-body-sm text-muted-foreground">
                Every link you&apos;ve already sent will stop working. Copies
                other people have already saved stay in their library and
                aren&apos;t affected.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmRevoke(false)}
                disabled={revokePending}
              >
                Keep sharing
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={onRevoke}
                disabled={revokePending}
              >
                {revokePending ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Stopping…
                  </>
                ) : (
                  "Stop sharing"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SharePlaylistDialog;
