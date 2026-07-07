"use client";

import { useState } from "react";
import { FileText, LockKeyhole } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LessonPdfDialog from "@/components/course/LessonPdfDialog";
import ExamDialog from "@/components/course/ExamDialog";
import type { Lesson } from "@/types/course";

interface LessonItemProps {
  lesson: Lesson;
}

/** Dummy PDF opened by the lesson preview. */
const SAMPLE_PDF = "/course-overview-sample.pdf";

/**
 * A single curriculum lesson row: a file icon + title on the left, and on the
 * right the quiz badges, an exam icon, or a lock icon. Lessons with a quiz open a
 * PDF preview; exam lessons open the timed exam dialog; locked lessons are static.
 */
export default function LessonItem({ lesson }: LessonItemProps) {
  const [open, setOpen] = useState(false);
  const interactive = Boolean(lesson.quiz || lesson.exam);

  const rowClassName =
    "flex w-full items-center justify-between gap-2 border-t border-border py-row text-left last:pb-0";

  const rightSide = lesson.quiz ? (
    <span className="flex shrink-0 items-center gap-2">
      <Badge variant="question">{lesson.quiz.questions} QUESTION</Badge>
      <Badge variant="time">{lesson.quiz.minutes} MINUTES</Badge>
    </span>
  ) : (
    <LockKeyhole className="h-4 w-4 shrink-0 text-muted-soft" aria-hidden="true" />
  );

  const content = (
    <>
      <span className="flex items-center gap-2 text-sm leading-[1.4] text-heading">
        <FileText className="h-4 w-4 shrink-0 text-muted-soft" aria-hidden="true" />
        {lesson.title}
      </span>
      {rightSide}
    </>
  );

  if (!interactive) {
    return <div className={rowClassName}>{content}</div>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${rowClassName} rounded-sm transition-colors hover:bg-border-muted/50`}
      >
        {content}
      </button>

      {lesson.exam ? (
        <ExamDialog open={open} onClose={() => setOpen(false)} title={lesson.title} />
      ) : (
        <LessonPdfDialog
          open={open}
          onClose={() => setOpen(false)}
          src={SAMPLE_PDF}
          title={lesson.title}
        />
      )}
    </>
  );
}
