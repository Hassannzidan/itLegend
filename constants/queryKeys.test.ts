import { describe, it, expect } from "vitest";
import { queryKeys } from "@/constants/queryKeys";

/**
 * These keys are the contract between server prefetch, hydration and the
 * optimistic review update — they must all reference the *same* array shape.
 * If `detail()` ever drifts, hydration silently misses and the client refetches,
 * or the mutation writes to the wrong cache entry. Locking the shape here makes
 * that failure loud.
 */
describe("queryKeys.courses", () => {
  it("exposes a stable root key", () => {
    expect(queryKeys.courses.all).toEqual(["courses"]);
  });

  it("namespaces detail keys under the root with the id last", () => {
    expect(queryKeys.courses.detail("starting-seo")).toEqual([
      "courses",
      "detail",
      "starting-seo",
    ]);
  });

  it("produces structurally equal keys for the same id (cache hits line up)", () => {
    expect(queryKeys.courses.detail("x")).toEqual(queryKeys.courses.detail("x"));
  });
});
