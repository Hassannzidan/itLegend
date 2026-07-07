"use client";

import Modal from "@/components/ui/Modal";
import { pickCoachMessage } from "@/constants/leaderboardMessages";

interface LeaderboardDialogProps {
  onClose: () => void;
  courseTitle: string;
  /** Completion percentage, used to choose the coaching message. */
  progress: number;
}

/** Number of (placeholder) ranking rows shown, matching the reference. */
const ROW_COUNT = 6;

/**
 * Leaderboard popup. Shows the course name, a coaching message picked to match
 * the student's performance (Ali Shaheen style), and the ranking rows.
 */
export default function LeaderboardDialog({
  onClose,
  courseTitle,
  progress,
}: LeaderboardDialogProps) {
  const message = pickCoachMessage(progress);

  return (
    <Modal ariaLabel="Leaderboard" onClose={onClose} className="w-[min(92vw,26rem)]">
      <div className="px-5 pb-6 pt-8 text-center sm:px-6">
        <p className="text-sm font-semibold text-[#3b3fa0]">{courseTitle}</p>
        <h2 className="mt-1 text-lg font-bold text-[#2b2f7a]">Leaderboard</h2>

        {/* Coaching message (RTL Arabic + motivational icon) */}
        <div
          dir="rtl"
          className="mt-5 flex items-start gap-3 rounded-2xl bg-[#f2f5fb] p-4 text-right"
        >
          <span className="shrink-0 text-2xl leading-none" aria-hidden="true">
            💪
          </span>
          <p className="text-sm font-semibold leading-relaxed text-[#3b3fa0]">{message}</p>
        </div>

        {/* Ranking rows */}
        <div className="mt-6 rounded-2xl bg-[#f2f5fb] p-3 sm:p-4">
          <ul className="flex flex-col gap-3">
            {Array.from({ length: ROW_COUNT }).map((_, i) => (
              <li
                key={i}
                className="h-14 rounded-xl border border-[#e6e8f2] bg-white"
                aria-hidden="true"
              />
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
