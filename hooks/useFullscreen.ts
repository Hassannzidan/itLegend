"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

/** Vendor-prefixed shapes so we can support Safari/WebKit without `any`. */
interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}
interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
}

/**
 * `ScreenOrientation.lock()` isn't present in this TypeScript release's DOM lib
 * (and is unimplemented in several browsers), so we model it as a separate
 * capability and feature-detect it. The union mirrors the official
 * `OrientationLockType` values rather than an ad-hoc subset.
 */
type OrientationLockType =
  | "any"
  | "natural"
  | "portrait"
  | "landscape"
  | "portrait-primary"
  | "portrait-secondary"
  | "landscape-primary"
  | "landscape-secondary";

interface OrientationLock {
  lock(orientation: OrientationLockType): Promise<void>;
}

/**
 * Type-safe feature detection: narrows to the lock-capable shape via a type
 * predicate (no casts). `"lock" in orientation` adds the member for the compiler,
 * and the `typeof` check confirms it at runtime.
 */
function supportsOrientationLock(
  orientation: ScreenOrientation | undefined,
): orientation is ScreenOrientation & OrientationLock {
  return (
    orientation != null &&
    "lock" in orientation &&
    typeof orientation.lock === "function"
  );
}

/**
 * Fullscreen for an arbitrary container element (so custom controls stay
 * visible). Uses the standard Fullscreen API with a WebKit fallback, and — when
 * a real fullscreen isn't available (notably iOS Safari on non-video elements)
 * — falls back to a CSS "fake fullscreen" via the `isFullscreen` flag the caller
 * applies as fixed/inset styling. On entry it also tries to lock the screen to
 * landscape (ignored where unsupported).
 */
export function useFullscreen(elementRef: RefObject<HTMLElement | null>) {
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);

  const isFullscreen = isNativeFullscreen || isFakeFullscreen;

  useEffect(() => {
    const doc = document as FullscreenDocument;
    const onChange = () => {
      const fsEl = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
      setIsNativeFullscreen(Boolean(fsEl) && fsEl === elementRef.current);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, [elementRef]);

  const lockLandscape = useCallback(async () => {
    const orientation = screen.orientation;
    // Feature-detect via the type guard; after it, `orientation.lock` is typed.
    if (!supportsOrientationLock(orientation)) return;
    try {
      await orientation.lock("landscape");
    } catch {
      /* not supported / not allowed (e.g. not on mobile) — ignore */
    }
  }, []);

  const enter = useCallback(async () => {
    const el = elementRef.current as FullscreenElement | null;
    if (!el) return;
    const request = el.requestFullscreen ?? el.webkitRequestFullscreen;
    if (request) {
      try {
        await request.call(el);
      } catch {
        setIsFakeFullscreen(true);
      }
    } else {
      setIsFakeFullscreen(true);
    }
    void lockLandscape();
  }, [elementRef, lockLandscape]);

  const exit = useCallback(async () => {
    const doc = document as FullscreenDocument;
    const fsEl = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
    if (fsEl) {
      const exitFn = doc.exitFullscreen ?? doc.webkitExitFullscreen;
      try {
        await exitFn?.call(doc);
      } catch {
        /* ignore */
      }
    }
    setIsFakeFullscreen(false);
    try {
      if (typeof screen.orientation?.unlock === "function") {
        screen.orientation.unlock();
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    if (isFullscreen) void exit();
    else void enter();
  }, [isFullscreen, enter, exit]);

  return { isFullscreen, isFake: isFakeFullscreen, toggle, enter, exit };
}
