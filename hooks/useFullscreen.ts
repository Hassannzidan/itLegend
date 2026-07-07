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
interface LockableOrientation extends ScreenOrientation {
  lock?: (orientation: "landscape" | "portrait" | "any") => Promise<void>;
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
    const orientation = screen.orientation as LockableOrientation | undefined;
    try {
      await orientation?.lock?.("landscape");
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
      (screen.orientation as LockableOrientation | undefined)?.unlock?.();
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
