"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /** 0–1 */
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  /** 0–1, how much of the video has buffered ahead of playback. */
  buffered: number;
}

export interface VideoPlayerControls {
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  /** Seek to an absolute time (seconds). */
  seek: (time: number) => void;
  /** Seek relative to the current time (seconds, may be negative). */
  seekBy: (delta: number) => void;
  setVolume: (value: number) => void;
  /** Nudge the volume up/down, unmuting if needed. */
  changeVolume: (delta: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Owns all playback state for a single <video> element and exposes imperative
 * controls. It reads/writes the element directly (the element is the source of
 * truth) and mirrors its events into React state, so the <video> is never
 * remounted — only observed.
 */
export function useVideoPlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
): VideoPlayerState & VideoPlayerControls {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setRateState] = useState(1);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (v.duration > 0 && v.buffered.length > 0) {
        setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
      }
    };
    const onDurationChange = () => setDuration(Number.isFinite(v.duration) ? v.duration : 0);
    const onVolumeChange = () => {
      setVolumeState(v.volume);
      setIsMuted(v.muted);
    };
    const onRateChange = () => setRateState(v.playbackRate);
    const onEnded = () => setIsPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("loadedmetadata", onDurationChange);
    v.addEventListener("durationchange", onDurationChange);
    v.addEventListener("volumechange", onVolumeChange);
    v.addEventListener("ratechange", onRateChange);
    v.addEventListener("ended", onEnded);

    // Sync initial values in case metadata was already available.
    onDurationChange();
    onVolumeChange();
    setIsPlaying(!v.paused);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("loadedmetadata", onDurationChange);
      v.removeEventListener("durationchange", onDurationChange);
      v.removeEventListener("volumechange", onVolumeChange);
      v.removeEventListener("ratechange", onRateChange);
      v.removeEventListener("ended", onEnded);
    };
  }, [videoRef]);

  const play = useCallback(() => {
    videoRef.current?.play().catch(() => {
      /* autoplay/gesture rejection — ignore, UI stays paused */
    });
  }, [videoRef]);

  const pause = useCallback(() => videoRef.current?.pause(), [videoRef]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  }, [videoRef, play]);

  const seek = useCallback(
    (time: number) => {
      const v = videoRef.current;
      if (!v) return;
      const max = Number.isFinite(v.duration) ? v.duration : time;
      v.currentTime = clamp(time, 0, max);
      setCurrentTime(v.currentTime);
    },
    [videoRef],
  );

  const seekBy = useCallback(
    (delta: number) => {
      const v = videoRef.current;
      if (!v) return;
      seek(v.currentTime + delta);
    },
    [videoRef, seek],
  );

  const setVolume = useCallback(
    (value: number) => {
      const v = videoRef.current;
      if (!v) return;
      const next = clamp(value, 0, 1);
      v.volume = next;
      v.muted = next === 0;
    },
    [videoRef],
  );

  const changeVolume = useCallback(
    (delta: number) => {
      const v = videoRef.current;
      if (!v) return;
      setVolume((v.muted ? 0 : v.volume) + delta);
    },
    [videoRef, setVolume],
  );

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  }, [videoRef]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const v = videoRef.current;
      if (!v) return;
      v.playbackRate = rate;
    },
    [videoRef],
  );

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    buffered,
    togglePlay,
    play,
    pause,
    seek,
    seekBy,
    setVolume,
    changeVolume,
    toggleMute,
    setPlaybackRate,
  };
}
