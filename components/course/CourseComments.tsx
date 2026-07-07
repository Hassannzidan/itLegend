"use client";

import { MessageSquare } from "lucide-react";
import CommentItem from "@/components/course/CommentItem";
import ReviewForm from "@/components/course/ReviewForm";
import { useSubmitReview } from "@/hooks/useSubmitReview";
import type { CourseReview, ReviewFormValues } from "@/types/course";

/** Anchor id used by the section nav to scroll to the comments. */
export const COMMENTS_SECTION_ID = "course-comments";

interface CourseCommentsProps {
  courseId: string;
  reviews: CourseReview[];
}

/** Empty state shown when a course has no reviews yet. */
function EmptyComments() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-border py-12 text-center text-muted-foreground">
      <MessageSquare className="h-9 w-9 opacity-60" aria-hidden="true" />
      <p className="text-lg font-semibold text-heading">No comments yet</p>
      <p className="text-sm">Be the first to share your thoughts on this course.</p>
    </div>
  );
}

/**
 * Comments section: the review list (or an empty state) followed by the review
 * form. Submitting optimistically prepends the new review via React Query.
 */
export default function CourseComments({ courseId, reviews }: CourseCommentsProps) {
  const { mutateAsync, isPending } = useSubmitReview(courseId);

  const handleSubmit = async (values: ReviewFormValues) => {
    await mutateAsync(values);
  };

  return (
    <section
      id={COMMENTS_SECTION_ID}
      className="mt-14 scroll-mt-24 md:mt-16"
      aria-label="Comments"
    >
      <h3 className="mb-5 text-heading-lg font-semibold text-heading">Comments</h3>

      {reviews.length === 0 ? (
        <EmptyComments />
      ) : (
        <div>
          {reviews.map((review) => (
            <CommentItem key={review.id} review={review} />
          ))}
        </div>
      )}

      <ReviewForm onSubmit={handleSubmit} isSubmitting={isPending} />
    </section>
  );
}
