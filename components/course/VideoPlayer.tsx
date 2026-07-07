"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useVideoPlayer } from "@/hooks/useVideoPlayer";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useStickyPlayer } from "@/hooks/useStickyPlayer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface VideoPlayerProps {
  /** Local video source (e.g. /videos/sample-lesson.mp4). */
  src: string;
  /** Poster frame shown before playback. */
  poster?: string;
  title?: string;
  /** Desktop "wide/theatre" state — owned by the page layout. */
  isWide?: boolean;
  /** Toggles wide mode; when omitted the Wide button is hidden. */
  onToggleWide?: () => void;
  /** Applied to the outer wrapper (e.g. the grid-area class). */
  className?: string;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/** Formats seconds as m:ss (or h:mm:ss for long videos). */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

/* Inline icons — self-contained so the player owns its markup/styling. */
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);
const IconVolume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1c2.9.9 5 3.5 5 6.7s-2.1 5.8-5 6.7v2.1c4-1 7-4.6 7-8.8s-3-7.8-7-8.8z" />
  </svg>
);
const IconMute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-5 w-5">
    <path d="M3 9v6h4l5 5V4L7 9H3zm18.3-.7-1.4-1.4L17 9.8 14.2 7l-1.4 1.4L15.6 11l-2.8 2.8 1.4 1.4L17 12.4l2.8 2.8 1.4-1.4L18.4 11l2.9-2.7z" />
  </svg>
);
const IconMaximize = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="h-5 w-5">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);
const IconMinimize = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden className="h-5 w-5">
    <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3" />
  </svg>
);
const IconWide = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden className="h-5 w-5">
    <rect x="3" y="7" width="18" height="10" rx="1.5" />
  </svg>
);

/**
 * Fully custom, dependency-free video player around a single <video> node.
 * The element is never remounted: Normal ↔ Sticky ↔ Fullscreen ↔ Wide all
 * change only CSS/positioning, so playback continues without refetching.
 */
export default function VideoPlayer({
  src,
  poster,
  title,
  isWide = false,
  onToggleWide,
  className,
}: VideoPlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const player = useVideoPlayer(videoRef);
  const fs = useFullscreen(containerRef);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isSticky = useStickyPlayer(sentinelRef, isMobile && !fs.isFullscreen);

  const [playerHeight, setPlayerHeight] = useState(0);
  const [speedOpen, setSpeedOpen] = useState(false);
  const speedRef = useRef<HTMLDivElement>(null);

  // Keep a placeholder height so the page doesn't jump when the player pins.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      if (!isSticky && !fs.isFullscreen) setPlayerHeight(el.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isSticky, fs.isFullscreen]);

  // Close the speed menu on an outside click.
  useEffect(() => {
    if (!speedOpen) return;
    const onDown = (e: MouseEvent) => {
      if (speedRef.current && !speedRef.current.contains(e.target as Node)) setSpeedOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [speedOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const onRange = (e.target as HTMLElement).tagName === "INPUT";
      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          player.togglePlay();
          break;
        case "ArrowRight":
          if (!onRange) { e.preventDefault(); player.seekBy(5); }
          break;
        case "ArrowLeft":
          if (!onRange) { e.preventDefault(); player.seekBy(-5); }
          break;
        case "ArrowUp":
          if (!onRange) { e.preventDefault(); player.changeVolume(0.1); }
          break;
        case "ArrowDown":
          if (!onRange) { e.preventDefault(); player.changeVolume(-0.1); }
          break;
        case "m":
          player.toggleMute();
          break;
        case "f":
          fs.toggle();
          break;
      }
    },
    [player, fs],
  );

  const progress = player.duration ? (player.currentTime / player.duration) * 100 : 0;
  const bufferedPct = player.buffered * 100;
  const volumePct = (player.isMuted ? 0 : player.volume) * 100;

  const seekFill = `linear-gradient(to right,
    var(--player-accent) 0% ${progress}%,
    rgb(255 255 255 / 0.5) ${progress}% ${bufferedPct}%,
    rgb(255 255 255 / 0.3) ${bufferedPct}% 100%)`;
  const volumeFill = `linear-gradient(to right,
    #fff 0% ${volumePct}%, rgb(255 255 255 / 0.3) ${volumePct}% 100%)`;

  const showWide = Boolean(onToggleWide) && !isMobile && !fs.isFullscreen;

  const controlBtn =
    "flex items-center justify-center rounded p-1.5 text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-white";

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      style={{ height: isSticky ? playerHeight || undefined : undefined }}
    >
      {/* Sentinel: marks the player's normal top edge for sticky detection. */}
      <div ref={sentinelRef} className="pointer-events-none absolute inset-x-0 top-0 h-px" />

      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={title ? `Video player: ${title}` : "Video player"}
        className={cn(
          "video-player group relative select-none overflow-hidden bg-black outline-none",
          !isSticky && !fs.isFullscreen && "rounded-sm",
          isSticky && "fixed inset-x-0 top-0 z-50 rounded-none shadow-lg",
          fs.isFake && "fixed inset-0 z-[9999] flex items-center justify-center",
          fs.isFullscreen && "flex items-center justify-center",
        )}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          preload="metadata"
          onClick={player.togglePlay}
          className={cn(
            "bg-black",
            fs.isFullscreen ? "max-h-full w-full object-contain" : "aspect-video w-full object-cover",
          )}
        />

        {/* Center play button (before playback / when paused). */}
        {!player.isPlaying && (
          <button
            type="button"
            onClick={player.togglePlay}
            aria-label="Play video"
            className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--player-overlay)] transition-colors hover:bg-black/35"
          >
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white shadow-[0_8px_28px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:scale-105">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1 h-7 w-7 text-play-icon">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {/* Controls bar. */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-8",
            "opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100",
            !player.isPlaying && "opacity-100", // always visible while paused
          )}
        >
          {/* Seek bar. */}
          <input
            type="range"
            min={0}
            max={player.duration || 0}
            step="any"
            value={player.currentTime}
            onChange={(e) => player.seek(Number(e.target.value))}
            aria-label="Seek"
            className="player-range w-full"
            style={{ background: seekFill }}
          />

          <div className="mt-1.5 flex items-center gap-2 text-white">
            <button type="button" onClick={player.togglePlay} className={controlBtn} aria-label={player.isPlaying ? "Pause" : "Play"}>
              {player.isPlaying ? <IconPause /> : <IconPlay />}
            </button>

            <span className="ml-1 text-xs tabular-nums text-white/90">
              {formatTime(player.currentTime)} / {formatTime(player.duration)}
            </span>

            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              {/* Volume. */}
              <div className="flex items-center gap-1">
                <button type="button" onClick={player.toggleMute} className={controlBtn} aria-label={player.isMuted ? "Unmute" : "Mute"}>
                  {player.isMuted || player.volume === 0 ? <IconMute /> : <IconVolume />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={player.isMuted ? 0 : player.volume}
                  onChange={(e) => player.setVolume(Number(e.target.value))}
                  aria-label="Volume"
                  className="player-range hidden w-16 sm:block"
                  style={{ background: volumeFill }}
                />
              </div>

              {/* Playback speed. */}
              <div ref={speedRef} className="relative">
                <button
                  type="button"
                  onClick={() => setSpeedOpen((o) => !o)}
                  aria-haspopup="menu"
                  aria-expanded={speedOpen}
                  className={cn(controlBtn, "min-w-[38px] text-xs font-semibold")}
                >
                  {player.playbackRate}x
                </button>
                {speedOpen && (
                  <div role="menu" className="absolute bottom-full right-0 mb-2 overflow-hidden rounded-md bg-black/90 py-1 text-sm shadow-lg">
                    {SPEEDS.map((s) => (
                      <button
                        key={s}
                        role="menuitemradio"
                        aria-checked={player.playbackRate === s}
                        onClick={() => { player.setPlaybackRate(s); setSpeedOpen(false); }}
                        className={cn(
                          "block w-full px-4 py-1.5 text-left text-white/90 hover:bg-white/15",
                          player.playbackRate === s && "text-play-icon",
                        )}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Wide mode (desktop only). */}
              {showWide && (
                <button
                  type="button"
                  onClick={onToggleWide}
                  className={controlBtn}
                  aria-pressed={isWide}
                  aria-label={isWide ? "Exit wide mode" : "Wide mode"}
                >
                  <IconWide active={isWide} />
                </button>
              )}

              {/* Fullscreen / exit. */}
              <button
                type="button"
                onClick={fs.toggle}
                className={controlBtn}
                aria-label={fs.isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {fs.isFullscreen ? <IconMinimize /> : <IconMaximize />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
