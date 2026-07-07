import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { submitReview } from "@/services/courseService";
import type { Course, CourseReview, ReviewFormValues } from "@/types/course";

/**
 * Submits a review and optimistically prepends it to the cached course, so the
 * new comment appears instantly without a refetch.
 */
export function useSubmitReview(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation<CourseReview, Error, ReviewFormValues>({
    mutationFn: (values) => submitReview(courseId, values),
    onSuccess: (review) => {
      queryClient.setQueryData<Course>(queryKeys.courses.detail(courseId), (current) =>
        current ? { ...current, reviews: [review, ...current.reviews] } : current,
      );
    },
  });
}
