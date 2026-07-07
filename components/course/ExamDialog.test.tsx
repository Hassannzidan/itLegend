import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ExamDialog from "@/components/course/ExamDialog";
import { EXAM_DURATION_SECONDS, type ExamQuestion } from "@/constants/examQuestions";

const QUESTIONS: ExamQuestion[] = [
  { id: "a", text: "1 + 1 = ?", options: ["1", "2"], answerIndex: 1 },
  { id: "b", text: "2 + 2 = ?", options: ["3", "4"], answerIndex: 1 },
];

/**
 * The exam dialog holds the only non-trivial in-component state machine:
 * question navigation, answer tracking, score computation, and a countdown that
 * auto-submits. That logic is the reason this component is worth testing (unlike
 * the presentational dialogs). Pips carry an aria-label ("Question N"), so
 * getByRole by the option's own text unambiguously targets the answer buttons.
 */
describe("ExamDialog", () => {
  afterEach(() => vi.useRealTimers());

  it("scores answered questions and shows the result on submit", () => {
    render(
      <ExamDialog open onClose={vi.fn()} title="Quiz" questions={QUESTIONS} />,
    );

    expect(screen.getByText("1 + 1 = ?")).toBeInTheDocument();

    // Answer Q1 correctly, advance, answer Q2 correctly, submit.
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("2 + 2 = ?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText(/exam complete/i)).toBeInTheDocument();
    expect(screen.getByText(/2\s*\/\s*2/)).toBeInTheDocument();
  });

  it("counts only correct answers", () => {
    render(
      <ExamDialog open onClose={vi.fn()} title="Quiz" questions={QUESTIONS} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "1" })); // Q1 wrong
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "4" })); // Q2 correct
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText(/1\s*\/\s*2/)).toBeInTheDocument();
  });

  it("auto-submits when the countdown reaches zero", () => {
    vi.useFakeTimers();
    render(
      <ExamDialog open onClose={vi.fn()} title="Quiz" questions={QUESTIONS} />,
    );

    expect(screen.queryByText(/exam complete/i)).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(EXAM_DURATION_SECONDS * 1000);
    });

    // Nothing answered -> auto-submitted with a score of 0.
    expect(screen.getByText(/exam complete/i)).toBeInTheDocument();
    expect(screen.getByText(/0\s*\/\s*2/)).toBeInTheDocument();
  });

  it("does not render exam content while closed", () => {
    render(
      <ExamDialog open={false} onClose={vi.fn()} title="Quiz" questions={QUESTIONS} />,
    );
    expect(screen.queryByText("1 + 1 = ?")).not.toBeInTheDocument();
  });
});
