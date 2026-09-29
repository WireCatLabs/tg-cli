import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    globals: false,
    setupFiles: ["src/testing/sandbox.ts"],
    globalSetup: ["src/testing/argv-log.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/testing/**",
        // The entry point: one line handing argv to run(), which the suite drives directly.
        "src/bin/**",
      ],
      reporter: ["text-summary", "json-summary", "html"],
      // A little under what the suite reaches (2026-09-29), so coverage can rise and not fall.
      thresholds: {
        lines: 93,
        statements: 92,
        functions: 90,
        branches: 80,
        perFile: { lines: 50 },
      },
    },
  },
})
