import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import { queryKeys } from "@/constants/queryKeys";
import type { Course, CourseReview } from "@/types/course";

// Mock the service so the test is fast and deterministic (no 600ms mock delay)
// and we assert purely on the cache-writing behavior of the hook.
vi.mock("@/services/courseService", () => ({
  submitReview: vi.fn(),
}));
import { submitReview } from "@/services/courseService";

const NEW_REVIEW: CourseReview = {
  id: "new-1",
  author: "You",
  date: "Just now",
  text: "Great course",
};

const existingReview: CourseReview = {
  id: "r1",
  author: "Sara",
  date: "Oct 1, 2021",
  text: "Existing",
};

function makeCourse(): Course {
  return {
    id: "c1",
    slug: "c1",
    title: "Course",
    instructor: { id: "i1", name: "Teacher" },
    progress: 0,
    progressLabel: "You",
    socials: [],
    materials: [],
    curriculum: [],
    reviews: [existingReview],
  };
}

function makeWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * useSubmitReview is where the app mutates cached server state: on success it
 * prepends the returned review into the cached course so the comment appears
 * without a refetch. This is the highest-value hook test — it verifies the cache
 * write lands on the exact query key, preserves existing data, and (crucially)
 * doesn't blow up when there's no cache entry to update.
 */
describe("useSubmitReview", () => {
  beforeEach(() => {
    (submitReview as Mock).mockReset().mockResolvedValue(NEW_REVIEW);
  });

  it("prepends the new review into the cached course on success", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const key = queryKeys.courses.detail("c1");
    queryClient.setQueryData<Course>(key, makeCourse());

    const { result } = renderHook(() => useSubmitReview("c1"), {
      wrapper: makeWrapper(queryClient),
    });

    await result.current.mutateAsync({ comment: "Great course" });

    await waitFor(() => {
      const course = queryClient.getQueryData<Course>(key);
      expect(course?.reviews).toHaveLength(2);
      // New review is first; the pre-existing one is preserved after it.
      expect(course?.reviews[0]).toEqual(NEW_REVIEW);
      expect(course?.reviews[1]).toEqual(existingReview);
    });
  });

  it("calls the service with the course id and form values", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result } = renderHook(() => useSubmitReview("c1"), {
      wrapper: makeWrapper(queryClient),
    });

    await result.current.mutateAsync({ comment: "Nice" });

    expect(submitReview).toHaveBeenCalledWith("c1", { comment: "Nice" });
  });

  it("does not throw when there is no cached course to update", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const { result } = renderHook(() => useSubmitReview("c1"), {
      wrapper: makeWrapper(queryClient),
    });

    await expect(
      result.current.mutateAsync({ comment: "Great course" }),
    ).resolves.toEqual(NEW_REVIEW);
    // Guard keeps the cache untouched (undefined) rather than seeding garbage.
    expect(
      queryClient.getQueryData(queryKeys.courses.detail("c1")),
    ).toBeUndefined();
  });
});
