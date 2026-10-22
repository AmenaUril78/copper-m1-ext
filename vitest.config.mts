import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    // The start-module tests run git and gh in child processes, which takes
    // about 5 seconds on the Windows CI runner, the default test timeout.
    testTimeout: 30_000,
    // specs/ holds module acceptance tests, run with `npm run check`.
    exclude: ["node_modules/**", ".next/**", "specs/**"],
  },
});
