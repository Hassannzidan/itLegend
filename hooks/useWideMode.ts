"use client";

import { useCallback, useState } from "react";

/**
 * Desktop-only "theatre / wide" layout toggle. This is a page-layout concern —
 * the player button flips the flag, and the page consumes `isWide` to switch
 * from a "player + sidebar" grid to a "wide player on top, content below" grid.
 * Kept as a hook so the layout logic is isolated and reusable.
 */
export function useWideMode(initial = false) {
  const [isWide, setIsWide] = useState(initial);

  const toggle = useCallback(() => setIsWide((w) => !w), []);
  const exit = useCallback(() => setIsWide(false), []);

  return { isWide, toggle, exit, setIsWide };
}
