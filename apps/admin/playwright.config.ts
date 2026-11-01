import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3003',
    trace: 'on-first-retry',
    channel: process.env.CI ? undefined : 'msedge',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1600, height: 900 },
      },
    },
  ],
});
