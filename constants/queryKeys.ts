/**
 * The single source of truth for React Query cache keys.
 *
 * Colocating every key here keeps reads and writes in perfect sync: a hook and a
 * mutation that must touch the same cache entry reference the exact same factory,
 * so keys can never quietly drift apart. Each domain gets a namespace whose
 * `all` prefix makes broad invalidation (`queryClient.invalidateQueries`) trivial.
 */
export const queryKeys = {
  courses: {
    all: ["courses"] as const,
    detail: (courseId: string) => [...queryKeys.courses.all, "detail", courseId] as const,
  },
} as const;
