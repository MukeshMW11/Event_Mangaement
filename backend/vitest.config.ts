import { defineConfig } from "vitest/config";
import { includes } from "zod";

export default defineConfig({
  test: {
    restoreMocks: true,
    projects: [
      {
        test: {
          name: "unit",
          include: ["./tests/unit/**/*.test.ts"]
        }
      },
      {
        test: {
          name: "e2e",
          include: ["./tests/e2e/**/*.test.ts"]
        }
      }
    ],
    setupFiles: [],
  }
})