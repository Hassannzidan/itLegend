"use client";

import { useEffect } from "react";
import CoursePageHeader from "@/components/course/CoursePageHeader";
import { COURSE_BREADCRUMBS } from "@/constants/course";

interface CourseErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error boundary (must be a Client Component). Replaces the old
 * in-component `isError` block: if resolving the course on the server fails,
 * Next.js renders this instead of the page. `reset()` re-attempts the segment.
 */
export default function CourseError({ error, reset }: CourseErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <CoursePageHeader breadcrumbs={COURSE_BREADCRUMBS} />
      <div className="mx-auto max-w-page px-4 py-row xl:px-0">
        <div
          role="alert"
          className="flex items-center justify-between gap-4 rounded-sm border border-destructive/40 bg-badge-time px-5 py-4 text-destructive"
        >
          <span>We couldn&apos;t load this course. Please try again.</span>
          <button
            onClick={reset}
            className="rounded-sm border border-destructive px-3 py-1 text-sm font-semibold hover:bg-destructive hover:text-white"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
