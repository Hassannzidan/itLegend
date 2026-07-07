import { test, expect } from "@playwright/test";

/**
 * Critical user flows for the Course Details page. Each spec targets something
 * that can only be verified in a real browser end-to-end — SSR output, media
 * playback, native dialogs, optimistic UI, and cross-reload persistence — and
 * that would break the core experience if it regressed.
 */

const COURSE_URL = "/courses/starting-seo";

test.describe("Course Details", () => {
  test("server-renders the course and its SEO metadata", async ({ page }) => {
    // Why: the whole App Router refactor exists to ship real HTML + per-course
    // SEO. Assert the title and heading come from the server, not client JS.
    const response = await page.goto(COURSE_URL);
    const html = await response!.text();
    expect(html).toContain("Starting SEO as your Home"); // content is in SSR HTML

    await expect(page).toHaveTitle(/Starting SEO as your Home/);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", /\/courses\/starting-seo$/);
    await expect(
      page.getByRole("heading", { name: "Starting SEO as your Home", level: 1 }),
    ).toBeVisible();
  });

  test("plays and pauses the lesson video", async ({ page }) => {
    // Why: the custom player is the highest-risk interactive piece (real <video>,
    // sticky/fullscreen). Smoke-test that the core play/pause path actually works.
    await page.goto(COURSE_URL);
    const video = page.locator("video");

    await page.getByRole("button", { name: "Play video" }).click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);

    await page.getByRole("button", { name: "Pause" }).click();
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test("submits a review and shows it instantly (optimistic)", async ({ page }) => {
    // Why: proves the mutation + React Query cache write render to the user, not
    // just to the cache — the end-to-end version of the useSubmitReview unit test.
    await page.goto(COURSE_URL);
    const comment = `Fantastic lesson ${Date.now()}`;

    await page.getByLabel(/write a comment/i).fill(comment);
    await page.getByRole("button", { name: /submit review/i }).click();

    await expect(page.getByText(comment)).toBeVisible();
  });

  test("validates the review form", async ({ page }) => {
    // Why: guards against shipping a form that lets empty/garbage reviews through.
    await page.goto(COURSE_URL);
    await page.getByRole("button", { name: /submit review/i }).click();
    await expect(page.getByText(/please write a comment/i)).toBeVisible();
  });

  test("persists curriculum completion across reloads", async ({ page }) => {
    // Why: the "completed lessons" state lives in localStorage; a persistence
    // regression silently loses the student's progress. Verify it survives F5.
    await page.goto(COURSE_URL);
    await page.getByRole("button", { name: "Curriculum" }).click();

    const firstLesson = page.getByRole("button", { name: /Introduction/i });
    await firstLesson.click();
    await expect(firstLesson).toHaveAttribute("aria-pressed", "true");

    await page.reload();
    await page.getByRole("button", { name: "Curriculum" }).click();
    await expect(
      page.getByRole("button", { name: /Introduction/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("completes a timed exam and shows a score", async ({ page }) => {
    // Why: the exam is a self-contained state machine (navigation, scoring,
    // countdown). Drive one full attempt to confirm the flow reaches a result.
    await page.goto(COURSE_URL);
    // The exam lesson ("Embedding PHP in HTML") opens the timed exam dialog.
    await page.getByRole("button", { name: /Embedding PHP in HTML/i }).click();

    const dialog = page.getByRole("dialog", { name: /exam/i });
    await expect(dialog).toBeVisible();

    // Answer the first question, jump to the last via its pip, then submit.
    await dialog.getByRole("button", { name: "let" }).click();
    await dialog.getByRole("button", { name: "Question 10" }).click();
    await dialog.getByRole("button", { name: "Submit" }).click();

    await expect(dialog.getByText(/exam complete/i)).toBeVisible();
    await expect(dialog.getByText(/\d+\s*\/\s*\d+/)).toBeVisible();
  });

  test("pins the player on scroll (mobile mini-player)", async ({ page }, testInfo) => {
    // Why: the sticky mini-player is mobile-only and driven by IntersectionObserver
    // — real scroll is the only faithful way to exercise it.
    test.skip(testInfo.project.name !== "mobile-safari", "mobile-only behavior");
    await page.goto(COURSE_URL);
    const player = page.locator(".video-player");

    await page.mouse.wheel(0, 1200);
    await expect(player).toHaveClass(/fixed/);
  });
});
