import CoursePageHeader from "@/components/course/CoursePageHeader";
import CourseDetailsSkeleton from "@/components/course/CourseDetailsSkeleton";
import { COURSE_BREADCRUMBS } from "@/constants/course";

/**
 * Route-level loading UI. Shown by Next.js while the server awaits the course
 * prefetch in page.tsx, replacing the old client-side `isLoading` screen. It
 * renders the same page shell + skeleton so nothing shifts when data arrives.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <CoursePageHeader breadcrumbs={COURSE_BREADCRUMBS} />
      <div className="mx-auto max-w-page px-4 py-row xl:px-0">
        <CourseDetailsSkeleton />
      </div>
    </div>
  );
}
