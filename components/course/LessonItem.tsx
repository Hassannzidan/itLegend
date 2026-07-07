import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types/course";

interface LessonItemProps {
  lesson: Lesson;
}

/**
 * A single curriculum lesson row: title on the left, optional quiz badges
 * ("N QUESTION" / "N MINUTES") on the right, separated by a top border.
 */
export default function LessonItem({ lesson }: LessonItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border py-row last:pb-0">
      <p className="w-[44%] text-sm leading-[1.4] text-heading">{lesson.title}</p>

      {lesson.quiz && (
        <div className="flex items-center gap-2">
          <Badge variant="question">{lesson.quiz.questions} QUESTION</Badge>
          <Badge variant="time">{lesson.quiz.minutes} MINUTES</Badge>
        </div>
      )}
    </div>
  );
}
