import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 90_000,
  expect: { timeout: 20_000 },
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.FOCUSGEEK_E2E_URL ?? "http://localhost:3000",
    browserName: "chromium",
    channel: process.platform === "win32" ? "chrome" : undefined,
    headless: true,
  },
});
