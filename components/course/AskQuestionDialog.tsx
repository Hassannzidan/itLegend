"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { readJSON, writeJSON } from "@/lib/persist";

interface AskQuestionDialogProps {
  onClose: () => void;
  courseId: string;
}

interface StoredQuestion {
  id: string;
  text: string;
}

/**
 * "Ask a Question" popup. Both the in-progress draft and the list of submitted
 * questions are persisted to localStorage per course, so an accidental close
 * never loses what the student typed — reopening restores the draft and history.
 */
export default function AskQuestionDialog({ onClose, courseId }: AskQuestionDialogProps) {
  const listKey = `course:${courseId}:questions`;
  const draftKey = `course:${courseId}:questionDraft`;

  const [questions, setQuestions] = useState<StoredQuestion[]>(() =>
    readJSON(listKey, []),
  );
  const [draft, setDraft] = useState<string>(() => readJSON(draftKey, ""));

  const onDraftChange = (value: string) => {
    setDraft(value);
    writeJSON(draftKey, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const next = [{ id: String(Date.now()), text }, ...questions];
    setQuestions(next);
    writeJSON(listKey, next);
    onDraftChange("");
  };

  return (
    <Modal ariaLabel="Ask a question" onClose={onClose}>
      <div className="p-6">
        <h2 className="text-heading-md font-semibold text-heading">Ask a Question</h2>
        <p className="mt-1 text-sm text-body-muted">
          Your draft and questions are saved on this device.
        </p>

        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            rows={4}
            placeholder="Type your question about this course..."
            className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm text-heading outline-none transition-colors focus:border-primary"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={!draft.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              Send
            </button>
          </div>
        </form>

        {questions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-heading-sm font-medium text-heading">Your questions</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {questions.map((q) => (
                <li
                  key={q.id}
                  className="rounded-lg border border-border-muted bg-surface-muted p-3"
                >
                  <p className="whitespace-pre-wrap text-sm text-heading">{q.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}
