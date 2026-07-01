// ─────────────────────────────────────────────────────────────────────────────
// useMediaQuery
// ─────────────────────────────────────────────────────────────────────────────
// Returns true while a given CSS media query matches the current viewport.
// Initialises to false (SSR-safe) then hydrates on mount so Next.js server
// and client renders agree on the initial value.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) =>
      setMatches(event.matches);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};
