import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      JWT_SECRET: "test-jwt-secret-vitest",
      DATABASE_URL: "file:./prisma/dev.db",
      LOG_LEVEL: "silent",
    },
  },
});
