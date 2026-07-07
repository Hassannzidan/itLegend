"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import LessonItem from "@/components/course/LessonItem";
import { cn } from "@/lib/utils";
import type { CourseWeek } from "@/types/course";

interface WeekSectionProps {
  week: CourseWeek;
}

/**
 * One curriculum block: week title, description and its list of lessons.
 * On mobile the body collapses behind a +/- toggle and animates open/closed via
 * a grid-rows height transition; on desktop (md+) it is always expanded and the
 * toggle is hidden.
 */
export default function WeekSection({ week }: WeekSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-5 rounded-sm border border-border-muted p-5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left md:pointer-events-none md:cursor-default"
      >
        <h3 className="text-heading-sm font-medium text-heading">{week.title}</h3>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-muted text-heading transition-colors md:hidden"
        >
          {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </span>
      </button>

      {/* Collapsible body: grid-rows 0fr → 1fr gives a smooth height transition. */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          "md:grid-rows-[1fr]", // always expanded on desktop
        )}
      >
        <div className="overflow-hidden">
          <p className="mt-row text-base leading-[1.5] text-body-muted">{week.description}</p>

          <div className="mt-2 flex flex-col">
            {week.lessons.map((lesson) => (
              <LessonItem key={lesson.id} lesson={lesson} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
