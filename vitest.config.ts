import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    dir: "./src/__tests__/",
  },
  plugins: [tsconfigPaths()],
});
