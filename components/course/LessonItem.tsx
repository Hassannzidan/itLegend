import { FileText, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Lesson } from "@/types/course";

interface LessonItemProps {
  lesson: Lesson;
}

/**
 * A single curriculum lesson row: a file icon + title on the left, and on the
 * right either the quiz badges ("N QUESTION" / "N MINUTES") or a lock icon for
 * locked lessons. Rows are separated by a top border.
 */
export default function LessonItem({ lesson }: LessonItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-border py-row last:pb-0">
      <p className="flex items-center gap-2 text-sm leading-[1.4] text-heading">
        <FileText className="h-4 w-4 shrink-0 text-muted-soft" aria-hidden="true" />
        {lesson.title}
      </p>

      {lesson.quiz ? (
        <div className="flex shrink-0 items-center gap-2">
          <Badge variant="question">{lesson.quiz.questions} QUESTION</Badge>
          <Badge variant="time">{lesson.quiz.minutes} MINUTES</Badge>
        </div>
      ) : (
        <LockKeyhole className="h-4 w-4 shrink-0 text-muted-soft" aria-hidden="true" />
      )}
    </div>
  );
}
