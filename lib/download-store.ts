// ─────────────────────────────────────────────────────────────────────────────
// Download Store
// ─────────────────────────────────────────────────────────────────────────────
// Download state lives outside React on purpose.
//
// A ZIP can take minutes. If the state lived in component state, navigating
// away from the playlist page would unmount the hook and either abort the
// transfer or orphan it silently. Keeping it in a module-level store means the
// download keeps running, and returning to the page re-attaches to it with
// live progress intact.
//
// Consumed through useSyncExternalStore, so getSnapshot must return a stable
// reference whenever nothing has actually changed — every mutation replaces
// the state object exactly once.
//
// NOTE: this survives navigation but cannot *render* anywhere the user goes,
// because nothing this feature owns is mounted above the route. A global
// progress indicator would need a provider in the dashboard layout.
// ─────────────────────────────────────────────────────────────────────────────

import type { TDownloadPhase } from "@/types/playlists/download.types";

export interface IDownloadState {
  phase: TDownloadPhase;
  playlistId: string | null;
  playlistName: string;
  /** Clamped to 99 while streaming; snaps to 100 only when the stream ends. */
  percent: number;
  received: number;
  /** 0 when the server sends no byte total — the UI then shows an
   *  indeterminate bar rather than a misleading percentage. */
  total: number;
  errorMessage: string | null;
}

const INITIAL_STATE: IDownloadState = {
  phase: "idle",
  playlistId: null,
  playlistName: "",
  percent: 0,
  received: 0,
  total: 0,
  errorMessage: null,
};

let state: IDownloadState = INITIAL_STATE;
let controller: AbortController | null = null;

const listeners = new Set<() => void>();

const emit = (): void => {
  listeners.forEach((listener) => listener());
};

export const downloadStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot(): IDownloadState {
    return state;
  },

  // Server render has no download in flight — always the initial object, so
  // the reference stays stable across calls.
  getServerSnapshot(): IDownloadState {
    return INITIAL_STATE;
  },

  setState(patch: Partial<IDownloadState>): void {
    state = { ...state, ...patch };
    emit();
  },

  reset(): void {
    state = INITIAL_STATE;
    controller = null;
    emit();
  },

  // ── Abort control ────────────────────────────────────────────────────────

  beginAbortable(): AbortSignal {
    controller = new AbortController();
    return controller.signal;
  },

  abort(): void {
    controller?.abort();
    controller = null;
  },

  isRunning(): boolean {
    return state.phase === "preparing" || state.phase === "downloading";
  },
};
