import { defineConfig } from "vitest/config";

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
    coverage: {
      provider: "v8",
      include: ["./src/**/*.ts"]
    }
  }
})