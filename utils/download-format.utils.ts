// ─────────────────────────────────────────────────────────────────────────────
// Download Format Utilities
// ─────────────────────────────────────────────────────────────────────────────
// Pure display helpers for the offline-download UI. `formatDuration` in
// format.utils.ts renders mm:ss, which reads badly for a multi-hour playlist
// ("190:00"), so long durations get their own formatter here.
// ─────────────────────────────────────────────────────────────────────────────

// 198234112 → "189 MB". Binary units, matching what an OS file manager shows.
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 MB";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  // Whole numbers past KB — "189 MB" reads better than "189.03 MB"
  const decimals = exponent <= 1 ? 0 : value < 10 ? 1 : 0;
  return `${value.toFixed(decimals)} ${units[exponent]}`;
};

// 11400 → "3h 10m", 600 → "10m", 45 → "1m" (never "0m" for a real track)
export const formatLongDuration = (totalSeconds: number): string => {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0m";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);

  if (hours > 0) return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  return `${Math.max(1, minutes)}m`;
};
