"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { readJSON, writeJSON } from "@/lib/persist";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface CurriculumDialogProps {
  onClose: () => void;
  course: Course;
}

/**
 * Curriculum popup: the full week/lesson outline with a per-lesson "completed"
 * checkbox. Completion is persisted to localStorage per course, so closing the
 * dialog (even accidentally) and reopening restores the previous state.
 */
export default function CurriculumDialog({ onClose, course }: CurriculumDialogProps) {
  const storageKey = `course:${course.id}:completedLessons`;
  const [done, setDone] = useState<Record<string, boolean>>(() =>
    readJSON(storageKey, {}),
  );

  const toggle = (lessonId: string) =>
    setDone((prev) => {
      const next = { ...prev, [lessonId]: !prev[lessonId] };
      writeJSON(storageKey, next);
      return next;
    });

  const lessons = course.curriculum.flatMap((week) => week.lessons);
  const completedCount = lessons.filter((lesson) => done[lesson.id]).length;

  return (
    <Modal ariaLabel="Curriculum" onClose={onClose}>
      <div className="p-6">
        <h2 className="text-heading-md font-semibold text-heading">Curriculum</h2>
        <p className="mt-1 text-sm text-body-muted">
          {completedCount} / {lessons.length} lessons completed
        </p>

        <div className="mt-5 flex flex-col gap-5">
          {course.curriculum.map((week) => (
            <div key={week.id}>
              <h3 className="text-heading-sm font-medium text-heading">{week.title}</h3>
              <ul className="mt-1 flex flex-col">
                {week.lessons.map((lesson) => {
                  const checked = Boolean(done[lesson.id]);
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => toggle(lesson.id)}
                        aria-pressed={checked}
                        className="flex w-full items-center gap-3 border-t border-border py-3 text-left"
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                            checked
                              ? "border-primary bg-primary text-white"
                              : "border-border-muted",
                          )}
                        >
                          {checked && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-[1.4]",
                            checked ? "text-body-muted line-through" : "text-heading",
                          )}
                        >
                          {lesson.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
