import CourseProgress from "@/components/course/CourseProgress";
import WeekSection from "@/components/course/WeekSection";
import type { Course } from "@/types/course";

interface CourseSidebarProps {
  course: Course;
}

/**
 * Right-hand column: the "Topics for This Course" heading, the completion
 * progress bar and the curriculum weeks.
 */
export default function CourseSidebar({ course }: CourseSidebarProps) {
  return (
    <aside aria-label="Course curriculum">
      <h2 className="mb-12 text-heading-md font-semibold text-heading">Topics for This Course</h2>

      <CourseProgress value={course.progress} label={course.progressLabel} />

      <div>
        {course.curriculum.map((week) => (
          <WeekSection key={week.id} week={week} />
        ))}
      </div>
    </aside>
  );
}
