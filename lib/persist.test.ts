import { describe, it, expect, vi, afterEach } from "vitest";
import { readJSON, writeJSON } from "@/lib/persist";

/**
 * The persist helpers back the "your draft is saved" behavior in the Ask/
 * Curriculum dialogs. The important guarantees aren't the happy path but the
 * defensive ones: unknown keys and corrupt JSON must fall back instead of
 * throwing, and writes must swallow quota/private-mode errors. Those are the
 * cases that break in the field, so those are what we assert.
 */
describe("persist", () => {
  afterEach(() => window.localStorage.clear());

  it("round-trips a value through write/read", () => {
    writeJSON("k", { a: 1, b: ["x"] });
    expect(readJSON("k", null)).toEqual({ a: 1, b: ["x"] });
  });

  it("returns the fallback for a missing key", () => {
    expect(readJSON("missing", "fallback")).toBe("fallback");
  });

  it("returns the fallback (not a throw) when stored JSON is corrupt", () => {
    window.localStorage.setItem("bad", "{not json");
    expect(readJSON("bad", [])).toEqual([]);
  });

  it("swallows write errors (e.g. quota / private mode)", () => {
    const spy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });
    expect(() => writeJSON("k", "v")).not.toThrow();
    spy.mockRestore();
  });
});
