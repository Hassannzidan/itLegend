import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { fetchCourse } from "@/services/courseService";
import type { Course } from "@/types/course";

/**
 * Loads a single course. React Query handles caching, loading and error state so
 * components stay declarative and free of manual fetch/effect plumbing.
 */
export function useCourse(courseId: string) {
  return useQuery<Course>({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => fetchCourse(courseId),
  });
}
