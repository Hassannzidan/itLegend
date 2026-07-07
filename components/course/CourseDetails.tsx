"use client";

import CoursePageHeader from "@/components/course/CoursePageHeader";
import VideoPlayer from "@/components/course/VideoPlayer";
import SocialLinks from "@/components/course/SocialLinks";
import CourseMaterials from "@/components/course/CourseMaterials";
import CourseComments from "@/components/course/CourseComments";
import CourseSidebar from "@/components/course/CourseSidebar";
import CourseDetailsSkeleton from "@/components/course/CourseDetailsSkeleton";
import { useCourse } from "@/hooks/useCourse";
import { useWideMode } from "@/hooks/useWideMode";
import { cn } from "@/lib/utils";

interface CourseDetailsProps {
  courseId: string;
}

const BREADCRUMBS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Course Details" },
];

/** Centered page container matching the reference max width and gutters. */
function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-page px-4 xl:px-0 ${className}`}>{children}</div>;
}

/**
 * Top-level client container for the Course Details page. Owns data fetching
 * (React Query) and the responsive content/sidebar layout; each child is a
 * focused presentational component.
 */
export default function CourseDetails({ courseId }: CourseDetailsProps) {
  const { data: course, isLoading, isError, refetch } = useCourse(courseId);
  const { isWide, toggle: toggleWide } = useWideMode();

  return (
    <div className="min-h-screen bg-background">
      <CoursePageHeader title={course?.title} breadcrumbs={BREADCRUMBS} />

      <Container className="py-row">
        {isLoading && <CourseDetailsSkeleton />}

        {isError && (
          <div
            role="alert"
            className="flex items-center justify-between gap-4 rounded-sm border border-destructive/40 bg-badge-time px-5 py-4 text-destructive"
          >
            <span>We couldn&apos;t load this course. Please try again.</span>
            <button
              onClick={() => refetch()}
              className="rounded-sm border border-destructive px-3 py-1 text-sm font-semibold hover:bg-destructive hover:text-white"
            >
              Retry
            </button>
          </div>
        )}

        {course && (
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
              <SocialLinks links={course.socials} />
              <CourseMaterials materials={course.materials} />
              <CourseComments courseId={course.id} reviews={course.reviews} />
            </div>

            {/* Sidebar (grid area: sidebar) */}
            <div className={cn("course-area-sidebar mt-14", isWide ? "md:mt-14" : "md:mt-0")}>
              <CourseSidebar course={course} />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
