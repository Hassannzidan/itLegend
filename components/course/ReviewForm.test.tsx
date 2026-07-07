import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReviewForm from "@/components/course/ReviewForm";

/**
 * ReviewForm owns real logic worth testing: React Hook Form validation
 * (required + min length), trimming/handing values to the parent, resetting
 * after a successful submit, and the submitting/disabled state. We test behavior
 * through the DOM (what a user does) rather than RHF internals.
 */
describe("ReviewForm", () => {
  it("blocks submit and shows an error when empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReviewForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /submit review/i }));

    expect(
      await screen.findByText(/please write a comment/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("enforces the minimum length", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ReviewForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/write a comment/i), "ab");
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    expect(
      await screen.findByText(/at least 3 characters/i),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits valid input and resets the field afterwards", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ReviewForm onSubmit={onSubmit} />);

    const textarea = screen.getByLabelText(/write a comment/i);
    await user.type(textarea, "Really enjoyed this course");
    await user.click(screen.getByRole("button", { name: /submit review/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      comment: "Really enjoyed this course",
    });
    await waitFor(() => expect(textarea).toHaveValue(""));
  });

  it("disables the button and shows progress while submitting", () => {
    render(<ReviewForm onSubmit={vi.fn()} isSubmitting />);

    const button = screen.getByRole("button", { name: /submitting/i });
    expect(button).toBeDisabled();
  });
});
