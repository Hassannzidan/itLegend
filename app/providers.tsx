"use client";

import { type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";

/**
 * Client-side providers. `getQueryClient()` returns the browser singleton, so
 * the cache here is the exact same one the server-dehydrated state is hydrated
 * into (see the route's <HydrationBoundary>) and that every `useQuery` reads —
 * which is why prefetched data isn't re-requested after hydration.
 */
export default function Providers({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
