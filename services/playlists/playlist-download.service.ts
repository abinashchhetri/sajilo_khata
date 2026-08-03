// ─────────────────────────────────────────────────────────────────────────────
// Playlist Download Service
// ─────────────────────────────────────────────────────────────────────────────
// Offline downloads: the ZIP manifest, the ZIP stream itself, and single-track
// presigned links.
//
// The ZIP deliberately does NOT go through apiClient. Axios buffers the whole
// response body before resolving, which would hold an entire archive in memory
// and defeat the streaming design outright. It uses raw fetch, replicating the
// same two auth paths services/index.ts sets up for axios: the httpOnly cookie
// (credentials: "include") and the localStorage Bearer token that Safari needs
// because ITP strips cross-origin cookies.
//
// The single-track download does not stream either — that endpoint hands back
// a presigned S3 URL, so the browser is pointed straight at storage. The bytes
// never touch our server and the user gets their native download manager.
// ─────────────────────────────────────────────────────────────────────────────

import apiClient from "@/services";
import { ACCESS_TOKEN_KEY } from "@/lib/constants/auth-storage.constants";
import { DOWNLOAD_CONSTANTS } from "@/lib/constants/download.constants";
import { TOAST_MESSAGES } from "@/lib/constants/toast-messages.constants";
import type { TApiResponse } from "@/types/api.types";
import type {
  IDownloadManifest,
  ITrackDownloadLink,
  IStreamZipArgs,
  TStreamZipResult,
  TShowSaveFilePicker,
} from "@/types/playlists/download.types";

// ─────── Plain JSON endpoints ────────────────────────────────────────────────

// Always call this before downloading — it is the only way to know the size
// (and therefore which strategy is safe) before committing the user.
export const fetchDownloadManifest = async (
  playlistId: string,
): Promise<TApiResponse<IDownloadManifest>> => {
  const { data } = await apiClient.get(
    `/playlists/${playlistId}/download/manifest`,
  );
  return data;
};

// Short-lived presigned S3 link for one track.
export const fetchTrackDownloadUrl = async (
  trackId: string,
): Promise<TApiResponse<ITrackDownloadLink>> => {
  const { data } = await apiClient.get(
    `/playlists/tracks/${trackId}/download`,
  );
  return data;
};

// ─────── Helpers ─────────────────────────────────────────────────────────────

// Narrows onto the File System Access API without a global augmentation.
// Present on Chrome/Edge desktop and Chrome Android 121+; absent on Firefox
// and Safari, which fall back to the blob path.
const getSaveFilePicker = (): TShowSaveFilePicker | null => {
  if (typeof window === "undefined") return null;
  const picker = (
    window as unknown as { showSaveFilePicker?: TShowSaveFilePicker }
  ).showSaveFilePicker;
  return typeof picker === "function" ? picker : null;
};

const buildAuthHeaders = (): HeadersInit => {
  const headers: Record<string, string> = {};
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// A user dismissing the save dialog throws AbortError, same as an aborted
// fetch. Both are cancellations, not failures — they must never toast an error.
const isAbort = (error: unknown): boolean =>
  error instanceof DOMException && error.name === "AbortError";

// Errors arrive as normal JSON with a 4xx status before the stream begins.
const readErrorMessage = async (response: Response): Promise<string> => {
  if (response.status === 429) return TOAST_MESSAGES.DOWNLOAD.RATE_LIMITED;
  try {
    const body: unknown = await response.json();
    const message =
      typeof body === "object" && body !== null
        ? (body as { message?: unknown }).message
        : undefined;
    if (typeof message === "string" && message.length > 0) return message;
  } catch {
    // Non-JSON body — fall through to the generic message.
  }
  return TOAST_MESSAGES.DOWNLOAD.FAILED;
};

const triggerAnchorDownload = (href: string, filename: string): void => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

// ─────── The ZIP stream ──────────────────────────────────────────────────────

export const streamPlaylistZip = async ({
  playlistId,
  suggestedFilename,
  totalBytes,
  onProgress,
  signal,
}: IStreamZipArgs): Promise<TStreamZipResult> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/playlists/${playlistId}/download`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: buildAuthHeaders(),
      credentials: "include",
      signal,
    });
  } catch (error) {
    if (isAbort(error)) return { kind: "cancelled" };
    return { kind: "error", message: TOAST_MESSAGES.DOWNLOAD.FAILED };
  }

  // 404 / 429 / 5xx land here with a JSON body, before any streaming starts.
  if (!response.ok) {
    return { kind: "error", message: await readErrorMessage(response) };
  }
  if (!response.body) {
    return { kind: "error", message: TOAST_MESSAGES.DOWNLOAD.FAILED };
  }

  // Audio bytes only — the finished ZIP is marginally larger (container +
  // playlist.json), so progress is clamped to 99% and snapped at the end.
  const headerTotal = Number(
    response.headers.get("X-Playlist-Audio-Bytes") ?? 0,
  );
  const total = headerTotal > 0 ? headerTotal : totalBytes;

  // ── Strategy A: stream straight to disk ─────────────────────────────────
  const picker = getSaveFilePicker();
  if (picker) {
    let writable: Awaited<
      ReturnType<Awaited<ReturnType<TShowSaveFilePicker>>["createWritable"]>
    > | null = null;

    try {
      const handle = await picker({
        suggestedName: suggestedFilename,
        types: [
          {
            description: "ZIP archive",
            accept: { [DOWNLOAD_CONSTANTS.ZIP_MIME]: [".zip"] },
          },
        ],
      });
      writable = await handle.createWritable();

      const reader = response.body.getReader();
      let received = 0;

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        await writable.write(value);
        received += value.length;
        onProgress(received, total);
      }

      await writable.close();
      return { kind: "saved", strategy: "stream" };
    } catch (error) {
      // Leave no half-written file behind, whether cancelled or failed.
      if (writable) {
        await writable.abort().catch(() => undefined);
      }
      if (isAbort(error)) return { kind: "cancelled" };

      // The picker can also fail for reasons that aren't the user's doing —
      // most often lost transient activation, since it is called after the
      // fetch resolves. Falling back to blob keeps the download working
      // instead of dead-ending, as long as the size is safe.
      if (!writable && totalBytes <= DOWNLOAD_CONSTANTS.BLOCK_BLOB_BYTES) {
        return saveViaBlob({ response, total, suggestedFilename, onProgress });
      }
      return { kind: "error", message: TOAST_MESSAGES.DOWNLOAD.FAILED };
    }
  }

  // ── Strategy B: blob fallback ────────────────────────────────────────────
  // Guarded by the caller too, but re-checked here so the service can never
  // be talked into buffering something oversized.
  if (totalBytes > DOWNLOAD_CONSTANTS.BLOCK_BLOB_BYTES) {
    return { kind: "error", message: TOAST_MESSAGES.DOWNLOAD.TOO_LARGE };
  }
  return saveViaBlob({ response, total, suggestedFilename, onProgress });
};

// Collects the stream in memory, then hands the assembled archive to the
// browser. Memory-bound by definition — only reached under BLOCK_BLOB_BYTES.
const saveViaBlob = async ({
  response,
  total,
  suggestedFilename,
  onProgress,
}: {
  response: Response;
  total: number;
  suggestedFilename: string;
  onProgress: (received: number, total: number) => void;
}): Promise<TStreamZipResult> => {
  let objectUrl: string | null = null;

  try {
    const reader = response.body!.getReader();
    const chunks: Uint8Array[] = [];
    let received = 0;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      onProgress(received, total);
    }

    const blob = new Blob(chunks as BlobPart[], {
      type: DOWNLOAD_CONSTANTS.ZIP_MIME,
    });
    // Drop references before creating the URL so the chunk array can be
    // collected rather than being held alongside the assembled blob.
    chunks.length = 0;

    objectUrl = URL.createObjectURL(blob);
    triggerAnchorDownload(objectUrl, suggestedFilename);

    return { kind: "saved", strategy: "blob" };
  } catch (error) {
    if (isAbort(error)) return { kind: "cancelled" };
    return { kind: "error", message: TOAST_MESSAGES.DOWNLOAD.FAILED };
  } finally {
    // Revoke on every path — success, cancel and error alike — or the blob
    // stays pinned in memory for the life of the document.
    if (objectUrl) {
      // A microtask of delay lets the click be dispatched before the URL dies.
      setTimeout(() => URL.revokeObjectURL(objectUrl as string), 0);
    }
  }
};

// ─────── Single track ────────────────────────────────────────────────────────

// The presigned URL is self-authenticating and already carries
// Content-Disposition, so this is a plain navigation — no fetch, no blob.
export const triggerTrackDownload = (link: ITrackDownloadLink): void => {
  triggerAnchorDownload(link.url, link.filename);
};
