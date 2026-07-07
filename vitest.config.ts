import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Vitest transpiles TSX with esbuild; the automatic runtime means test files
  // don't need to import React explicitly.
  esbuild: { jsx: "automatic" },
  resolve: {
    // Mirror the tsconfig "@/*" path alias so tests import like the app does.
    alias: { "@": root },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Unit/component tests only; e2e lives under /e2e and runs via Playwright.
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
});
