import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, type Page } from '@playwright/test';
import { activeGeneratedImages, type GeneratedImage } from '../src/data/generatedImages.ts';
import { IMAGE_HISTORY_STORAGE_KEY, imageHistoryKey } from '../src/imageHistory.ts';

/** Must match LOCK_IN_MS and REVEAL_MS in src/routes/Game.tsx. */
export const LOCK_IN_MS = 1200;
export const REVEAL_MS = 1600;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ARTWORK = path.join(HERE, 'fixtures', 'artwork.png');

/** Make one real image the only unseen candidate without relying on bank order. */
export function storageWithOnlyUnseen(entry: GeneratedImage): Record<string, string> {
  const seen = Object.fromEntries(activeGeneratedImages
    .filter(({ id }) => id !== entry.id)
    .map((other) => [imageHistoryKey(other), 1]));
  return {
    [IMAGE_HISTORY_STORAGE_KEY]: JSON.stringify({
      version: 1, seen, lastRound: [], recent: Object.keys(seen),
    }),
  };
}

type GotoOptions = {
  /** true: fixed fixture; false: simulate missing files; 'real': serve saved outputs. */
  artwork?: boolean | 'real';
  /** Seeded localStorage, used by the stats page. */
  storage?: Record<string, string>;
  /** Constant random value; zero selects the first image and answer by default. */
  random?: number;
};

/**
 * Opens a route with every source of run-to-run variation pinned down:
 * frozen timers, a constant Math.random, a fixed artwork, and no confetti.
 */
export async function gotoStable(
  page: Page,
  route: string,
  { artwork = true, storage, random = 0 }: GotoOptions = {},
): Promise<void> {
  // Timers become manual, so the lock-in and reveal beats are stepped
  // through with clock.runFor instead of waited out in real time. This also
  // freezes requestAnimationFrame, which settles the confetti canvas.
  await page.clock.install();

  await page.addInitScript((value: number) => {
    Math.random = () => value;
  }, random);

  if (storage) {
    await page.addInitScript((entries: Record<string, string>) => {
      Object.entries(entries).forEach(([key, value]) => {
        window.localStorage.setItem(key, value);
      });
    }, storage);
  }

  if (artwork !== 'real') {
    await page.route(
      /\/images\/.*\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/i,
      (route_) => (artwork ? route_.fulfill({ path: ARTWORK }) : route_.abort()),
    );
  }

  // baseURL carries the /guess-the-model/ path segment, and Playwright
  // resolves routes as URLs, so a leading slash would escape to the origin
  // and land on Vite's base-path helper page.
  await page.goto(route.replace(/^\//, ''));

  // That helper page renders without #root, so this guard stops a failed
  // navigation from quietly becoming a baseline.
  await expect(page.locator('#root')).toBeAttached();

  // Playwright freezes animations at screenshot time, but the logo's blurred
  // pseudo-elements still rasterise differently frame to frame, so stop them
  // outright. Hiding the canvas settles the confetti the same way.
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }
      canvas { visibility: hidden !important; }
    `,
  });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

/** Waits until the artwork has painted, whichever branch the frame took. */
export async function waitForArtwork(page: Page): Promise<void> {
  const image = page.locator('.mil-screen img');
  if (await image.count()) {
    await expect(image).toHaveJSProperty('complete', true);
  }
}

/** Answers correctly and runs the clock out to the next question. */
export async function answerCorrectly(page: Page): Promise<void> {
  await page.getByTestId('answer').first().click();
  await page.clock.runFor(LOCK_IN_MS + REVEAL_MS);
}

/** Answers wrongly and runs the clock out to the final screen. */
export async function answerWrong(page: Page): Promise<void> {
  await page.getByTestId('answer').last().click();
  await page.clock.runFor(LOCK_IN_MS + REVEAL_MS);
}

/** Fixed history so the stats page renders the same numbers every run. */
export const SEEDED_STATS = JSON.stringify({
  correct: 34,
  incorrect: 12,
  total: 46,
  classic: { correct: 18, incorrect: 7, total: 25 },
  quiz: { correct: 16, incorrect: 5, total: 21 },
  models: {
    ChatGPT: {
      correct: 9,
      incorrect: 3,
      total: 12,
      correctImages: [
        'c309a6ea-272b-410c-ab60-c0820dabd6e8',
        '8840f415-c56f-4f95-b425-68ef31d779bd',
        '27abe4d7-b7de-4de0-b5e4-a01415fd6d1b',
      ],
    },
    EMU: {
      correct: 6,
      incorrect: 2,
      total: 8,
      correctImages: ['b9f615a9-13bc-4870-a900-14446a5421ec'],
    },
    Gemini: {
      correct: 7,
      incorrect: 3,
      total: 10,
      correctImages: ['dccf540d-9464-49b5-96db-1221247d8f42'],
    },
    Grok: {
      correct: 5,
      incorrect: 3,
      total: 8,
      correctImages: ['4aeeca87-c920-4c98-b59e-5dd08c512049'],
    },
    Midjourney: {
      correct: 7,
      incorrect: 1,
      total: 8,
      correctImages: ['6c4746f9-7b87-4f2c-93a2-387405560be3'],
    },
  },
});
