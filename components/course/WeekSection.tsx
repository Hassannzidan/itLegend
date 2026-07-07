import LessonItem from "@/components/course/LessonItem";
import type { CourseWeek } from "@/types/course";

interface WeekSectionProps {
  week: CourseWeek;
}

/** One curriculum block: week title, description and its list of lessons. */
export default function WeekSection({ week }: WeekSectionProps) {
  return (
    <div className="mb-5 rounded-sm border border-border-muted p-5">
      <h3 className="mb-row text-heading-sm font-medium text-heading">{week.title}</h3>
      <p className="text-base leading-[1.5] text-body-muted">{week.description}</p>

      <div className="mt-2 flex flex-col">
        {week.lessons.map((lesson) => (
          <LessonItem key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
