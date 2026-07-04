// @deprecated — the backend now manages the queue. This hook is a no-op kept
// to avoid import errors while callers are migrated to the queue system.
"use client";

export const useHandlePrepareNext = () => ({
  handlePrepareNext: async (_trackId: string) => undefined,
  isPending: false,
});
