import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts", "electron/**/*.test.ts"],
    exclude: ["dist/**", "dist-electron/**", "node_modules/**"],
    fileParallelism: false
  }
});
