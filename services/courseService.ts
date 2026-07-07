import { DEFAULT_COURSE, MOCK_COURSES } from "@/constants/course";
import type { Course, CourseReview, ReviewFormValues } from "@/types/course";

/**
 * Data-access layer for courses.
 *
 * This is the single seam between the UI and the backend. Today it resolves mock
 * data with a simulated latency; to go live, swap the bodies for calls through the
 * shared `api` client (`@/lib/api`), e.g. `api.get<Course>(`/courses/${courseId}`)` —
 * no component or hook would change.
 */

const NETWORK_DELAY_MS = 600;

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Fetch a single course by its route id. Falls back to the demo course. */
export async function fetchCourse(courseId: string): Promise<Course> {
  await delay(NETWORK_DELAY_MS);
  return MOCK_COURSES[courseId] ?? DEFAULT_COURSE;
}

/** Persist a new review. Returns the created review so the cache can update. */
export async function submitReview(
  courseId: string,
  values: ReviewFormValues,
): Promise<CourseReview> {
  await delay(NETWORK_DELAY_MS);
  return {
    // Deterministic id derived from the course + content keeps this pure-ish for
    // a mock; a real backend would return a server-generated id.
    id: `${courseId}-${values.comment.length}-${values.comment.slice(0, 8)}`,
    author: "You",
    date: "Just now",
    text: values.comment.trim(),
  };
}
