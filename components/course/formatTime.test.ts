import { describe, it, expect } from "vitest";
import { formatTime } from "@/components/course/VideoPlayer";

/**
 * The player's time display is pure formatting with several branches: sub-hour
 * vs hour form, zero-padding rules, and guarding non-finite input (duration is
 * NaN until metadata loads). Testing the function directly is far cheaper and
 * more thorough than asserting on rendered player text.
 */
describe("formatTime", () => {
  it("formats sub-minute and sub-hour times as m:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(5)).toBe("0:05");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(600)).toBe("10:00");
  });

  it("switches to h:mm:ss past an hour, padding minutes", () => {
    expect(formatTime(3600)).toBe("1:00:00");
    expect(formatTime(3661)).toBe("1:01:01");
  });

  it("clamps non-finite / negative input to 0:00", () => {
    expect(formatTime(NaN)).toBe("0:00");
    expect(formatTime(-10)).toBe("0:00");
    expect(formatTime(Infinity)).toBe("0:00");
  });
});
