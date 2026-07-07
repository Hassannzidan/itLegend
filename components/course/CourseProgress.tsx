"use client";

import { useEffect, useRef, useState } from "react";

interface CourseProgressProps {
  /** Completion value, 0–100. */
  value: number;
  /** Label shown at the marker (e.g. "You"). */
  label: string;
}

/** Duration of the fill/count-up reveal, in milliseconds. */
const ANIMATION_MS = 1200;

/** Ease-out cubic — quick start, gentle settle. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Horizontal progress bar with a circular marker pinned at the completion point.
 * The marker stacks the label over the percentage, matching the reference.
 *
 * The fill, marker and percentage animate from 0% up to `value` the first time
 * the bar scrolls into view (via IntersectionObserver + a requestAnimationFrame
 * count-up). Users who prefer reduced motion see the final value immediately.
 */
export default function CourseProgress({ value, label }: CourseProgressProps) {
  const target = Math.min(100, Math.max(0, Math.round(value)));
  const containerRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    let rafId = 0;
    let startTime: number | null = null;

    const step = (now: number) => {
      if (startTime === null) startTime = now;
      const progress = Math.min(1, (now - startTime) / ANIMATION_MS);
      setDisplay(target * easeOut(progress));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect(); // animate once
        rafId = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [target]);

  const rounded = Math.round(display);

  return (
    <div
      ref={containerRef}
      className="relative my-[60px] flex items-center"
      role="progressbar"
      aria-valuenow={rounded}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Course progress"
    >
      {/* Track + fill */}
      <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-progress-track">
        <div className="h-full rounded-full bg-progress-fill" style={{ width: `${display}%` }} />
      </div>

      {/* Marker sits above the bar: label inside the circle, pointer aimed down. */}
      <div
        className="absolute bottom-1/2 -translate-x-1/2 pb-3"
        style={{ left: `${display}%` }}
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-progress-marker-ring text-xs text-progress-marker after:absolute after:-bottom-[14px] after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-progress-marker-ring after:content-['']">
          {label}
        </span>
      </div>

      {/* Percentage sits below the bar, aligned to the marker. */}
      <span
        className="absolute top-1/2 -translate-x-1/2 pt-3 text-sm text-progress-marker"
        style={{ left: `${display}%` }}
      >
        {rounded}%
      </span>
    </div>
  );
}
