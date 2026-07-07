interface CourseProgressProps {
  /** Completion value, 0–100. */
  value: number;
  /** Label shown at the marker (e.g. "You"). */
  label: string;
}

/**
 * Horizontal progress bar with a circular marker pinned at the completion point.
 * The marker stacks the label over the percentage, matching the reference.
 */
export default function CourseProgress({ value, label }: CourseProgressProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div
      className="relative mb-10 mt-20 flex items-center"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Course progress"
    >
      {/* Track + fill */}
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-progress-track">
        <div className="h-full rounded-full bg-progress-fill" style={{ width: `${clamped}%` }} />
      </div>

      {/* Marker sits above the bar: label inside the circle, pointer aimed down. */}
      <div
        className="absolute bottom-1/2 -translate-x-1/2 pb-3"
        style={{ left: `${clamped}%` }}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-progress-marker-ring text-xs text-progress-marker after:absolute after:-bottom-[10px] after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-progress-marker-ring after:content-['']">
          {label}
        </span>
      </div>

      {/* Percentage sits below the bar, aligned to the marker. */}
      <span
        className="absolute top-1/2 -translate-x-1/2 pt-3 text-sm text-heading"
        style={{ left: `${clamped}%` }}
      >
        {clamped}%
      </span>
    </div>
  );
}
