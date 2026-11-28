import { defineConfig, devices } from "@playwright/test";

const port = 3100;
const baseURL = `https://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }],
  ],
  use: {
    baseURL,
    // 開発サーバーは自己署名証明書を使う
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev:local",
    url: baseURL,
    env: { E2E_PORT: String(port) },
    reuseExistingServer: !process.env.CI,
    ignoreHTTPSErrors: true,
    timeout: 120_000,
  },
});
