// ─────────────────────────────────────────────────────────────────────────────
// ReactQueryProvider
// ─────────────────────────────────────────────────────────────────────────────
// Wraps the app in TanStack Query's QueryClientProvider using a singleton
// queryClient exported for direct use in mutation hooks (cache invalidation).
// Devtools are mounted only outside production to keep the bundle lean.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// ─────── Types ───────────────────────────────────────────────────────────────

interface Props {
  children: React.ReactNode;
}

// ─────── Singleton client ────────────────────────────────────────────────────

// Exported so mutation hooks can call queryClient.invalidateQueries() directly
// without needing useQueryClient() inside the hook body.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

// ─────── Component ───────────────────────────────────────────────────────────

const ReactQueryProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
