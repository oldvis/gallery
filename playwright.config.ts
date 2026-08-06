import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './e2e',
  // README capture is opt-in via `pnpm docs:screenshot`.
  testIgnore: process.env.DOCS_SCREENSHOT ? [] : ['**/docs-screenshot.spec.ts'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 120_000,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    navigationTimeout: 60_000,
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm exec vite build && pnpm exec vite preview --host 127.0.0.1 --port 4173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      ...process.env,
      VITE_BASE_URL: '/',
    },
  },
})
