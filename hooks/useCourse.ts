import { useQuery } from "@tanstack/react-query";
import { fetchCourse } from "@/services/courseService";
import type { Course } from "@/types/course";

/** Stable query keys, colocated so cache reads/writes never drift out of sync. */
export const courseKeys = {
  all: ["courses"] as const,
  detail: (courseId: string) => [...courseKeys.all, courseId] as const,
};

/**
 * Loads a single course. React Query handles caching, loading and error state so
 * components stay declarative and free of manual fetch/effect plumbing.
 */
export function useCourse(courseId: string) {
  return useQuery<Course>({
    queryKey: courseKeys.detail(courseId),
    queryFn: () => fetchCourse(courseId),
  });
}
