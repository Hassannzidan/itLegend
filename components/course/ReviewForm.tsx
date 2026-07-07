"use client";

import { useForm } from "react-hook-form";
import { ArrowRight, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import type { ReviewFormValues } from "@/types/course";

interface ReviewFormProps {
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
}

const MIN_LENGTH = 3;

/**
 * Review form built with React Hook Form. The parent owns the submit
 * side-effect (mutation); this component only validates and resets.
 */
export default function ReviewForm({ onSubmit, isSubmitting = false }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({ defaultValues: { comment: "" } });

  const submit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset();
  });

  return (
    <form onSubmit={submit} noValidate className="mt-10">
      <Textarea
        {...register("comment", {
          required: "Please write a comment before submitting.",
          minLength: {
            value: MIN_LENGTH,
            message: `Your comment must be at least ${MIN_LENGTH} characters.`,
          },
        })}
        placeholder="Write a comment"
        aria-label="Write a comment"
        aria-invalid={Boolean(errors.comment)}
        className="shadow-soft h-[170px] resize-y rounded-sm border-none p-card text-lg font-medium text-ink placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {errors.comment && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {errors.comment.message}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-card flex h-[60px] w-[215px] items-center justify-center gap-2.5 rounded-sm bg-primary text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            Submitting <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Submit Review <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
