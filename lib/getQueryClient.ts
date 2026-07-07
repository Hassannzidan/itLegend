import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

/**
 * Shared QueryClient factory for the App Router SSR + hydration flow.
 *
 * The default options live here (not in the provider) so the *server* client
 * that prefetches and the *browser* client that hydrates share identical config.
 * The 60s `staleTime` is what stops the client from re-requesting data that was
 * already prefetched on the server: the dehydrated entry lands "fresh", so the
 * mounting `useQuery` reads the cache instead of firing a duplicate fetch.
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      dehydrate: {
        // Also ship still-pending queries so streamed/suspended prefetches can
        // be picked up on the client without a refetch.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * On the server: a brand-new client per request, so one user's cache never
 * leaks into another's. In the browser: a single long-lived client, created
 * lazily and reused, so hydration and every component share one cache.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
