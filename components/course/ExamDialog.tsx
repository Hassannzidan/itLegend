"use client";

import { useEffect, useRef, useState } from "react";
import { AlarmClock, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EXAM_DURATION_SECONDS,
  JS_EXAM_QUESTIONS,
  type ExamQuestion,
} from "@/constants/examQuestions";

interface ExamDialogProps {
  open: boolean;
  onClose: () => void;
  /** Exam heading (usually the lesson title). */
  title: string;
  questions?: ExamQuestion[];
}

/** Format seconds as MM:SS. */
const formatTime = (total: number) => {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * Timed multiple-choice exam presented in a modal. The native <dialog> shell
 * handles the backdrop / focus trap / Escape; the inner ExamSession holds all the
 * exam state and is only mounted while open, so every launch starts fresh.
 *
 * Visual language follows the reference: indigo gradient panel, yellow timer
 * pill, numbered question pips, and the selected answer in a blue gradient.
 */
export default function ExamDialog({
  open,
  onClose,
  title,
  questions = JS_EXAM_QUESTIONS,
}: ExamDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync `open` prop with the native dialog.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={`${title} exam`}
      className="m-auto w-[min(92vw,26rem)] max-h-[92vh] overflow-y-auto rounded-3xl border-0 bg-gradient-to-b from-[#5a69e4] to-[#4150c6] p-0 text-white backdrop:bg-black/60"
    >
      {open && (
        <ExamSession title={title} questions={questions} onClose={onClose} />
      )}
    </dialog>
  );
}

interface ExamSessionProps {
  title: string;
  questions: ExamQuestion[];
  onClose: () => void;
}

/** The stateful exam body: countdown, question navigation, answers and results. */
function ExamSession({ questions, onClose }: ExamSessionProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  const lastIndex = questions.length - 1;
  const question = questions[current];
  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.answerIndex ? 1 : 0),
    0,
  );

  // Countdown; auto-submits at zero.
  useEffect(() => {
    if (submitted) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setSubmitted(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [submitted]);

  const select = (optionIndex: number) =>
    setAnswers((prev) => ({ ...prev, [current]: optionIndex }));

  return (
    <div className="p-4 sm:p-6">
      {/* Header: back arrow + countdown pill */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close exam"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2 rounded-full bg-[#ffd21e] px-5 py-2 text-sm font-semibold text-[#1f2340] shadow-md">
          <AlarmClock className="h-4 w-4" aria-hidden="true" />
          <span className="tabular-nums">{formatTime(secondsLeft)}</span>
        </div>

        <span className="h-9 w-9 shrink-0" aria-hidden="true" />
      </div>

      {submitted ? (
        /* Results */
        <div className="mt-8 rounded-2xl bg-white p-6 text-center text-[#20233f]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6e7cf0] to-[#5766e4] text-white">
            <Check className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold">Exam complete</h2>
          <p className="mt-1 text-sm text-[#5a5f7a]">
            You scored{" "}
            <span className="font-semibold text-[#4150c6]">
              {score} / {questions.length}
            </span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-[#6e7cf0] to-[#5766e4] px-5 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
          >
            Close
          </button>
        </div>
      ) : (
        <>
          {/* Question pips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            {questions.map((q, i) => {
              const isCurrent = i === current;
              const isAnswered = answers[i] !== undefined;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Question ${i + 1}`}
                  aria-current={isCurrent}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors sm:h-9 sm:w-9",
                    isCurrent
                      ? "border-white bg-white text-[#4150c6]"
                      : isAnswered
                        ? "border-white bg-white/20 text-white hover:bg-white/30"
                        : "border-white/60 text-white hover:bg-white/10",
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Question card */}
          <div className="mt-6 rounded-2xl bg-white p-5 text-[#20233f] sm:p-6">
            <p className="text-sm font-semibold text-[#20233f]">{current + 1}.</p>
            <p className="mt-2 text-base font-bold leading-snug">{question.text}</p>

            <div className="mt-5 flex flex-col gap-3">
              {question.options.map((option, oi) => {
                const selected = answers[current] === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => select(oi)}
                    aria-pressed={selected}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                      selected
                        ? "border-transparent bg-gradient-to-r from-[#6e7cf0] to-[#5766e4] text-white shadow-sm"
                        : "border-[#e6e8f2] bg-white text-[#3a3f57] hover:border-[#c7ccdd]",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                        selected ? "border-white" : "border-[#c7ccdd]",
                      )}
                    >
                      {selected && <span className="h-2 w-2 rounded-[1px] bg-white" />}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
              className="rounded-full bg-white/15 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {current < lastIndex ? (
              <button
                type="button"
                onClick={() => setCurrent((c) => Math.min(lastIndex, c + 1))}
                className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-[#4150c6] shadow-md transition-opacity hover:opacity-90"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="rounded-full bg-[#ffd21e] px-6 py-2 text-sm font-semibold text-[#1f2340] shadow-md transition-opacity hover:opacity-90"
              >
                Submit
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
