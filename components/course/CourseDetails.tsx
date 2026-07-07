"use client";

import CoursePageHeader from "@/components/course/CoursePageHeader";
import VideoPlayer from "@/components/course/VideoPlayer";
import CourseSectionNav from "@/components/course/CourseSectionNav";
import CourseMaterials from "@/components/course/CourseMaterials";
import CourseComments from "@/components/course/CourseComments";
import CourseSidebar from "@/components/course/CourseSidebar";
import { useCourse } from "@/hooks/useCourse";
import { useWideMode } from "@/hooks/useWideMode";
import { cn } from "@/lib/utils";
import { COURSE_BREADCRUMBS } from "@/constants/course";

interface CourseDetailsProps {
  courseId: string;
}

/** Centered page container matching the reference max width and gutters. */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-page px-4 xl:px-0 ${className}`}>{children}</div>;
}

/**
 * Top-level client container for the Course Details page. Data is prefetched on
 * the server and hydrated via <HydrationBoundary> (see the route's page.tsx), so
 * `useCourse` reads the cache synchronously and never issues its own request.
 * Loading and error states are handled by the route's loading.tsx / error.tsx.
 * This component owns only the interactive concerns: the responsive layout and
 * wide-mode toggle, with each child a focused presentational/client component.
 */
export default function CourseDetails({ courseId }: CourseDetailsProps) {
  const { data: course } = useCourse(courseId);
  const { isWide, toggle: toggleWide } = useWideMode();

  // The server prefetch guarantees data on first render; this guard only
  // satisfies the type (data is `Course | undefined`).
  if (!course) return null;

  return (
    <div className="min-h-screen bg-background">
      <CoursePageHeader title={course.title} breadcrumbs={COURSE_BREADCRUMBS} />

      <Container className="py-row">
        <div className="course-layout" data-wide={isWide ? "true" : "false"}>
          {/* Video player (grid area: player) */}
          <VideoPlayer
            className="course-area-player"
            src={course.videoUrl ?? ""}
            poster={course.imageUrl}
            title={course.title}
            isWide={isWide}
            onToggleWide={toggleWide}
          />

          {/* Main content (grid area: body) */}
          <div className="course-area-body">
            <CourseSectionNav course={course} />
            <CourseMaterials materials={course.materials} />
          </div>

          {/* Sidebar (grid area: sidebar) — on mobile this sits directly under
              Course Materials and above the comments. */}
          <div className={cn("course-area-sidebar mt-14", isWide ? "md:mt-14" : "md:mt-0")}>
            <CourseSidebar course={course} />
          </div>

          {/* Comments (grid area: comments) */}
          <div className="course-area-comments">
            <CourseComments courseId={course.id} reviews={course.reviews} />
          </div>
        </div>
      </Container>
    </div>
  );
}
