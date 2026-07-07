import { defineConfig, devices } from "@playwright/test";

/**
 * E2E config. Playwright boots the app itself (webServer) and drives it in a
 * real browser, so these specs cover what jsdom can't: real SSR HTML, actual
 * <video> playback, native <dialog>, and localStorage across reloads.
 *
 * Run once: `npx playwright install` (downloads browsers), then `pnpm test:e2e`.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    // Production build exercises the real SSR/streaming path the specs assert on.
    command: "pnpm build && pnpm start",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
