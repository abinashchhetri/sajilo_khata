// ─────────────────────────────────────────────────────────────────────────────
// ImportPlaylistDialog
// ─────────────────────────────────────────────────────────────────────────────
// Three steps in one dialog:
//   1. url      — paste a link, shape-check it locally, then Preview
//   2. preview  — what will be imported + where it should go
//   3. progress — hand off to ImportProgressCard
//
// Closing the dialog mid-import does NOT cancel or lose anything: all state
// lives on the server, and the playlists page shows a strip for the running
// import. Nothing here is persisted to component state or localStorage.
//
// Preview and start each take 2–3 seconds server-side, so both buttons show a
// pending state rather than appearing frozen.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImportProgressCard from "@/components/playlists/import/ImportProgressCard";
import { useGetImportPreview } from "@/hooks/react-query/playlist-import/use-preview-import.hook";
import { useHandleStartImport } from "@/hooks/react-query/playlist-import/use-start-import.hook";
import { useGetPlaylists } from "@/hooks/react-query/playlists/get-playlists.hook";
import { IMPORT_CONSTANTS } from "@/lib/constants/import.constants";
import { getApiErrorMessage } from "@/utils/api-error.utils";
import { formatDuration } from "@/utils/format.utils";
import type { TStartImportBody } from "@/types/playlists/import.types";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Set when an import is already running — the dialog opens straight to it. */
  activeImportId?: string | null;
}

type TStep = "url" | "preview" | "progress";
type TDestination = "new" | "existing";

// ─────── Helpers ─────────────────────────────────────────────────────────────

// Cheap client-side shape check so an obviously wrong link doesn't burn one of
// the 20 previews/hour. The server remains the authority — it returns precise,
// user-facing messages we surface verbatim.
const looksLikePlaylistUrl = (raw: string): boolean =>
  /(?:youtube\.com|youtu\.be|music\.youtube\.com)\/.*[?&]list=/.test(raw) ||
  /open\.spotify\.com\/(playlist|album)\//.test(raw);

const looksLikeSpotify = (raw: string): boolean =>
  /open\.spotify\.com/.test(raw);

// ─────── Component ───────────────────────────────────────────────────────────

const ImportPlaylistDialog = ({
  open,
  onOpenChange,
  activeImportId = null,
}: Props) => {
  const [step, setStep] = useState<TStep>(activeImportId ? "progress" : "url");
  const [url, setUrl] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [importId, setImportId] = useState<string | null>(activeImportId);

  const [destination, setDestination] = useState<TDestination>("new");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [targetPlaylistId, setTargetPlaylistId] = useState("");

  const { preview, isFetching: previewFetching, error: previewError, runPreview } =
    useGetImportPreview(url.trim());
  const { handleStartImport, isPending: startPending } = useHandleStartImport();
  const { playlists } = useGetPlaylists();

  // ── Handlers ──────────────────────────────────────────────────────────────

  const resetAll = () => {
    setStep(activeImportId ? "progress" : "url");
    setUrl("");
    setLocalError(null);
    setImportId(activeImportId);
    setDestination("new");
    setNewPlaylistName("");
    setTargetPlaylistId("");
  };

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    // Reset only on close, and only once the dialog is actually dismissed —
    // the import itself keeps running server-side regardless.
    if (!next) resetAll();
  };

  const handlePreview = async () => {
    const trimmed = url.trim();
    setLocalError(null);

    if (!trimmed) {
      setLocalError("Paste a playlist link first.");
      return;
    }
    if (!looksLikePlaylistUrl(trimmed)) {
      setLocalError(
        "That does not look like a playlist link. Open the playlist and copy its URL — a single video link will not work.",
      );
      return;
    }

    const result = await runPreview();
    if (result.data?.data) {
      setNewPlaylistName(result.data.data.name);
      setStep("preview");
    }
  };

  const handleStart = async () => {
    const trimmed = url.trim();

    // Exactly one destination — sending both or neither is a 400.
    const body: TStartImportBody =
      destination === "new"
        ? {
            url: trimmed,
            createNewPlaylist: true,
            newPlaylistName: newPlaylistName.trim() || undefined,
          }
        : { url: trimmed, targetPlaylistId };

    try {
      const response = await handleStartImport(body);
      setImportId(response.data.importId);
      setStep("progress");
    } catch {
      // The interceptor already toasted the server's message; staying on the
      // preview step lets the user pick a different destination and retry.
    }
  };

  // ── Derived ───────────────────────────────────────────────────────────────

  const serverPreviewError = previewError
    ? getApiErrorMessage(
        previewError,
        "Couldn't read that playlist. Check the link and try again.",
      )
    : null;

  const showSpotifyHint = looksLikeSpotify(url);

  const canStart =
    destination === "new"
      ? true // the server falls back to the source name when left blank
      : !!targetPlaylistId;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg shadow-level-2">
        <DialogHeader>
          <DialogTitle className="text-title">
            {step === "progress" ? "Importing playlist" : "Import a playlist"}
          </DialogTitle>
          {step === "url" && (
            <DialogDescription className="text-body-sm text-muted-foreground">
              Paste a YouTube or YouTube Music playlist link. Tracks download in
              the background, so you can keep using the app.
            </DialogDescription>
          )}
        </DialogHeader>

        {/* ── Step 1: URL ──────────────────────────────────────────────────── */}
        {step === "url" && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="import-url">Playlist link</Label>
              <Input
                id="import-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setLocalError(null);
                }}
                placeholder="https://youtube.com/playlist?list=…"
                autoFocus
              />
            </div>

            {localError && (
              <p className="text-body-sm text-destructive">{localError}</p>
            )}

            {/* Server messages are written for users — show them verbatim */}
            {serverPreviewError && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
                {serverPreviewError}
              </p>
            )}

            {/* Spotify parses but the API is unavailable — point at a converter
                rather than building any Spotify-specific affordance. */}
            {showSpotifyHint && (
              <p className="rounded-md bg-muted px-3 py-2 text-body-sm text-muted-foreground">
                {IMPORT_CONSTANTS.SPOTIFY_CONVERTER_HINT}
              </p>
            )}

            {previewFetching ? (
              <div className="space-y-2">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={handlePreview}
                disabled={previewFetching}
              >
                <Search size={14} />
                Preview playlist
              </Button>
            )}
          </div>
        )}

        {/* ── Step 2: Preview + destination ────────────────────────────────── */}
        {step === "preview" && preview && (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {/* Source summary */}
            <div className="flex gap-3">
              {preview.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.coverUrl}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-md border border-hairline object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-title text-foreground">
                  {preview.name}
                </p>
                {preview.ownerName && (
                  <p className="truncate text-body-sm text-muted-foreground">
                    {preview.ownerName}
                  </p>
                )}
                <p className="text-caption text-muted-foreground">
                  {preview.importableTracks} track
                  {preview.importableTracks === 1 ? "" : "s"} · about{" "}
                  {preview.estimatedMinutes} min to finish
                </p>
              </div>
            </div>

            {/* The counts genuinely differ in practice (e.g. 100 of 183) —
                never hide this from the user. */}
            {preview.importableTracks < preview.totalTracks && (
              <p className="rounded-md bg-muted px-3 py-2 text-body-sm text-muted-foreground">
                Only the first {preview.importableTracks} of{" "}
                {preview.totalTracks} tracks can be imported. YouTube does not
                serve every entry publicly, and an import is capped at{" "}
                {IMPORT_CONSTANTS.MAX_TRACKS_PER_IMPORT} tracks.
              </p>
            )}

            {preview.alreadyCached > 0 && (
              <p className="rounded-md bg-accent-green/10 px-3 py-2 text-body-sm text-accent-green">
                {preview.alreadyCached} track
                {preview.alreadyCached === 1 ? " is" : "s are"} already on the
                server — those import instantly.
              </p>
            )}

            {/* Edge case: nothing to do */}
            {preview.importableTracks === 0 && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-body-sm text-destructive">
                There are no importable tracks in this playlist. It may be empty
                or entirely private.
              </p>
            )}

            {/* Destination */}
            <div className="space-y-2">
              <p className="text-eyebrow text-ink-faint">Import into</p>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-hairline px-3 py-2.5">
                <input
                  type="radio"
                  name="import-destination"
                  className="accent-primary"
                  checked={destination === "new"}
                  onChange={() => setDestination("new")}
                />
                <span className="text-body-sm text-foreground">
                  A new playlist
                </span>
              </label>

              {destination === "new" && (
                <div className="space-y-1.5 pl-7">
                  <Label htmlFor="new-playlist-name">Playlist name</Label>
                  <Input
                    id="new-playlist-name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder={preview.name}
                  />
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-hairline px-3 py-2.5">
                <input
                  type="radio"
                  name="import-destination"
                  className="accent-primary"
                  checked={destination === "existing"}
                  onChange={() => setDestination("existing")}
                  disabled={playlists.length === 0}
                />
                <span className="text-body-sm text-foreground">
                  An existing playlist
                  {playlists.length === 0 && (
                    <span className="text-ink-faint"> — you have none yet</span>
                  )}
                </span>
              </label>

              {destination === "existing" && (
                <div className="pl-7">
                  <Select
                    value={targetPlaylistId}
                    onValueChange={setTargetPlaylistId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a playlist" />
                    </SelectTrigger>
                    <SelectContent>
                      {playlists.map((playlist) => (
                        <SelectItem key={playlist.id} value={playlist.id}>
                          {playlist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Track list */}
            <div className="space-y-1.5">
              <p className="text-eyebrow text-ink-faint">Tracks</p>
              <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border border-hairline p-1">
                {preview.tracks.map((track) => (
                  <div
                    key={`${track.position}-${track.title}`}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted"
                  >
                    <span className="w-6 shrink-0 text-caption text-ink-faint">
                      {track.position + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">
                      {track.title}
                    </span>
                    {track.alreadyCached && (
                      <span className="shrink-0 text-caption text-accent-green">
                        cached
                      </span>
                    )}
                    {track.durationMs !== null && (
                      <span className="shrink-0 text-caption text-ink-faint">
                        {formatDuration(Math.round(track.durationMs / 1000))}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("url")}
                disabled={startPending}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                size="sm"
                onClick={handleStart}
                disabled={
                  startPending || !canStart || preview.importableTracks === 0
                }
              >
                {startPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Starting…
                  </>
                ) : (
                  `Import ${preview.importableTracks} tracks`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Progress ─────────────────────────────────────────────── */}
        {step === "progress" && importId && (
          <div className="max-h-[70vh] overflow-y-auto pr-1">
            <ImportProgressCard importId={importId} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportPlaylistDialog;
