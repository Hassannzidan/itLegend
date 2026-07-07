"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Detects when the player has scrolled up to the top of the viewport so it can
 * be pinned (mobile "mini player" behaviour, à la YouTube).
 *
 * A zero-height sentinel is rendered at the very top of the player wrapper.
 * While the sentinel is still on screen the player sits in its normal place;
 * once the sentinel scrolls above the viewport top, `isSticky` flips to true.
 * Using an IntersectionObserver keeps this off the scroll thread (no jank).
 *
 * @param sentinelRef  the zero-height marker at the top of the player wrapper
 * @param enabled      only observe when true (e.g. mobile & not fullscreen)
 */
export function useStickyPlayer(
  sentinelRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): boolean {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sticky only once the sentinel has left the top of the viewport.
        setIsSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelRef, enabled]);

  // Derive rather than setState-in-effect: when disabled, always report false.
  return enabled && isSticky;
}
