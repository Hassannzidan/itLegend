"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  onClose: () => void;
  /** Accessible label for the dialog. */
  ariaLabel: string;
  children: React.ReactNode;
  /** Width / sizing override for the panel. */
  className?: string;
}

/**
 * Reusable white modal built on the native <dialog> element. It is meant to be
 * mounted only while open (`{open && <Modal .../>}`), so it calls showModal() on
 * mount and close() on unmount — no open/close prop plumbing. Closes on the ✕
 * button, Escape (native) and backdrop click.
 */
export default function Modal({ onClose, ariaLabel, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    // Close on unmount so a StrictMode re-mount's showModal() doesn't throw
    // "already open". We deliberately do NOT wire the native `close` event to
    // `onClose` — that would make this cleanup fire onClose and unmount the
    // dialog the instant it opened.
    return () => dialog?.close();
  }, []);

  // Clicking the backdrop (the dialog element itself) closes.
  const handleClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  // Escape fires `cancel`; route that (not `close`) back to the parent.
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleClick}
      aria-label={ariaLabel}
      className={cn(
        "m-auto max-h-[90vh] w-[min(92vw,32rem)] rounded-3xl border-0 bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-black/50",
        className,
      )}
    >
      <div className="relative flex max-h-[90vh] flex-col">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-border-muted hover:text-heading"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  );
}
