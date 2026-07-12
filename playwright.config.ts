import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 3,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: 'https://automationexercise.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: '**/*.spec.ts',
    },

    {
      name: 'chrome',
      testDir: './tests/e2e',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
      },
    },

    {
      name: 'firefox',
      testDir: './tests/e2e',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      testDir: './tests/e2e',
      testMatch: '**/*.spec.ts',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
});
