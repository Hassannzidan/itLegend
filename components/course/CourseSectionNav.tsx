"use client";

import { useState } from "react";
import { BookOpen, MessageSquare, HelpCircle, Trophy, type LucideIcon } from "lucide-react";
import CurriculumDialog from "@/components/course/CurriculumDialog";
import AskQuestionDialog from "@/components/course/AskQuestionDialog";
import LeaderboardDialog from "@/components/course/LeaderboardDialog";
import { COMMENTS_SECTION_ID } from "@/components/course/CourseComments";
import type { Course } from "@/types/course";

interface CourseSectionNavProps {
  course: Course;
}

type ActiveDialog = "curriculum" | "ask" | "leaderboard" | null;

/**
 * Row of course section shortcuts (replaces the old social links): Curriculum,
 * Comments, Ask Question and Leaderboard. Comments scrolls to the comments
 * section; the others open their respective popups.
 */
export default function CourseSectionNav({ course }: CourseSectionNavProps) {
  const [active, setActive] = useState<ActiveDialog>(null);
  const close = () => setActive(null);

  const scrollToComments = () =>
    document
      .getElementById(COMMENTS_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const items: { key: string; label: string; Icon: LucideIcon; onClick: () => void }[] = [
    { key: "curriculum", label: "Curriculum", Icon: BookOpen, onClick: () => setActive("curriculum") },
    { key: "comments", label: "Comments", Icon: MessageSquare, onClick: scrollToComments },
    { key: "ask", label: "Ask Question", Icon: HelpCircle, onClick: () => setActive("ask") },
    { key: "leaderboard", label: "Leaderboard", Icon: Trophy, onClick: () => setActive("leaderboard") },
  ];

  return (
    <>
      <nav
        aria-label="Course sections"
        className="mt-6 flex flex-wrap items-start gap-4 sm:gap-6"
      >
        {items.map(({ key, label, Icon, onClick }) => (
          <button
            key={key}
            type="button"
            onClick={onClick}
            className="group flex w-16 flex-col items-center gap-1.5 text-center"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-body transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xs leading-tight text-body-muted transition-colors group-hover:text-heading">
              {label}
            </span>
          </button>
        ))}
      </nav>

      {active === "curriculum" && <CurriculumDialog course={course} onClose={close} />}
      {active === "ask" && <AskQuestionDialog courseId={course.id} onClose={close} />}
      {active === "leaderboard" && (
        <LeaderboardDialog
          courseTitle={course.title}
          progress={course.progress}
          onClose={close}
        />
      )}
    </>
  );
}
