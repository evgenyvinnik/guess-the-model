import { defineConfig } from '@playwright/test';

/** Override locally when port 5173 is already taken: PW_PORT=5180 npm run test:visual */
const PORT = Number(process.env.PW_PORT ?? 5173);

/** Vite serves the app under its GitHub Pages base path. */
const BASE_URL = `http://localhost:${PORT}/guess-the-model/`;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // The millionaire run steps through fifteen questions in one test.
  timeout: 60_000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  // Baselines are per platform, because font rasterisation differs between
  // macOS and the Linux containers CI runs on.
  snapshotPathTemplate: 'tests/__screenshots__/{projectName}/{arg}-{platform}{ext}',

  use: {
    baseURL: BASE_URL,
    deviceScaleFactor: 1,
    trace: 'on-first-retry',
  },

  expect: {
    toHaveScreenshot: {
      // Antialiasing drifts by a few pixels between runs; a real layout or
      // colour change moves far more than this.
      maxDiffPixelRatio: 0.01,
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    },
  },

  projects: [
    {
      name: 'desktop',
      testMatch: /.*\.desktop\.spec\.ts/,
      use: { viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'mobile',
      testMatch: /.*\.mobile\.spec\.ts/,
      use: { viewport: { width: 390, height: 844 } },
    },
  ],

  // Screenshots run against the production build: static files serve far
  // faster under parallel load than the dev server's module graph, and the
  // bundled CSS is what actually ships.
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
