"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, FileText } from "lucide-react";

interface LessonPdfDialogProps {
  open: boolean;
  onClose: () => void;
  /** URL of the PDF to preview. */
  src: string;
  /** Heading + iframe title (usually the lesson title). */
  title: string;
}

/**
 * Modal PDF preview built on the native <dialog> element (backdrop, focus trap
 * and Escape for free). It shares the exam dialog's visual language: an indigo
 * gradient panel, a back-arrow / title-pill header, and the document shown in a
 * white card. The native PDF toolbar is hidden via the URL fragment so the page
 * blends into the styled shell. `open` is synced to showModal()/close().
 */
export default function LessonPdfDialog({ open, onClose, src, title }: LessonPdfDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      aria-label={title}
      className="m-auto h-[min(92vh,780px)] w-[min(94vw,52rem)] rounded-3xl border-0 bg-gradient-to-b from-[#5a69e4] to-[#4150c6] p-0 text-white backdrop:bg-black/60"
    >
      <div className="flex h-full flex-col p-4 sm:p-6">
        {/* Header: back arrow + title pill (mirrors the exam header) */}
        <div className="flex shrink-0 items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex min-w-0 items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{title}</span>
          </div>

          <span className="h-9 w-9 shrink-0" aria-hidden="true" />
        </div>

        {/* Document card */}
        <div className="mt-6 min-h-0 flex-1 overflow-hidden rounded-2xl bg-white shadow-md">
          <iframe
            src={`${src}#toolbar=0&navpanes=0&view=FitH`}
            title={title}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </dialog>
  );
}
