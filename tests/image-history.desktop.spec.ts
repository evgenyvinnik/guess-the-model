import { expect, test, type Page } from '@playwright/test';
import { activeGeneratedImages } from '../src/data/generatedImages.ts';
import {
  IMAGE_HISTORY_STORAGE_KEY, imageHistoryKey, type ImageHistory,
} from '../src/imageHistory.ts';
import { createImageRound, getEligibleComparisonGroups } from '../src/imageRounds.ts';
import type { QuestionEntry } from '../src/questions.ts';
import { gotoStable, SEEDED_STATS } from './helpers.ts';

type StoredHistory = ImageHistory & { version: 1 };

function emptyHistory(): ImageHistory {
  return { seen: {}, lastRound: [], recent: [] };
}

/** Simulate what the contestant has seen without relying on persistence internals. */
function afterViewing(history: ImageHistory, images: QuestionEntry[]): ImageHistory {
  const seen = { ...history.seen };
  const keys = [...new Set(images.map(imageHistoryKey))];
  keys.forEach((key) => { seen[key] = (seen[key] ?? 0) + 1; });
  return {
    seen,
    lastRound: keys,
    recent: [
      ...(history.recent ?? Object.keys(history.seen)).filter((key) => !keys.includes(key)),
      ...keys,
    ],
  };
}

async function displayedImages(page: Page, count: number): Promise<QuestionEntry[]> {
  const images = page.locator('.mil-screen img, [data-testid="comparison-image"]');
  await expect(images).toHaveCount(count);
  const sources = await images.evaluateAll((elements) => (
    elements.map((element) => (element as HTMLImageElement).src)
  ));
  return sources.map((src) => {
    const entry = activeGeneratedImages.find(
      ({ image }) => decodeURIComponent(src).endsWith(image),
    );
    if (!entry) throw new Error(`Displayed image is absent from the manifest: ${src}`);
    return entry;
  });
}

async function storedHistory(page: Page): Promise<StoredHistory | null> {
  return page.evaluate((key) => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch {
      return null;
    }
  }, IMAGE_HISTORY_STORAGE_KEY);
}

async function expectStoredHistory(page: Page, history: ImageHistory): Promise<void> {
  await expect.poll(() => storedHistory(page)).toEqual({ version: 1, ...history });
}

test('single rounds show every completed image before reuse, even with constant randomness', () => {
  const originalRandom = Math.random;
  let history = emptyHistory();
  const allKeys = activeGeneratedImages.map(imageHistoryKey);
  const observed = new Set<string>();
  try {
    Math.random = () => 0;
    for (let index = 0; index < allKeys.length; index += 1) {
      const before = JSON.stringify(history);
      const round = createImageRound('single', history);
      const key = imageHistoryKey(round.target);
      expect(JSON.stringify(history)).toBe(before);
      expect(observed.has(key)).toBe(false);
      expect(round.images).toEqual([round.target]);
      expect(round.answer).toBe(round.target.modelName);
      observed.add(key);
      history = afterViewing(history, round.images);
    }
    expect([...observed].sort()).toEqual([...allKeys].sort());
    expect(Object.values(history.seen)).toEqual(allKeys.map(() => 1));

    // At the cycle boundary every image has the same count. The last one should
    // not immediately repeat merely because the random source stays at zero.
    const next = createImageRound('single', history);
    expect(history.lastRound).not.toContain(imageHistoryKey(next.target));
  } finally {
    Math.random = originalRandom;
  }
});

test('a new image is seen first without repeating to catch up with older view counts', () => {
  const originalRandom = Math.random;
  const newest = activeGeneratedImages[activeGeneratedImages.length - 1];
  const newestKey = imageHistoryKey(newest);
  const history: ImageHistory = {
    seen: Object.fromEntries(
      activeGeneratedImages.slice(0, -1).map((entry) => [imageHistoryKey(entry), 3]),
    ),
    lastRound: [imageHistoryKey(activeGeneratedImages[0])],
  };
  try {
    Math.random = () => 0;
    expect(createImageRound('single', history).target.image).toBe(newest.image);
    let caughtUpOnce = afterViewing(history, [newest]);
    expect(caughtUpOnce.seen[newestKey]).toBe(1);
    // A newly added image must not repeat immediately just to catch up with older counts.
    for (let index = 0; index < activeGeneratedImages.length - 1; index += 1) {
      const next = createImageRound('single', caughtUpOnce);
      expect(next.target.image).not.toBe(newest.image);
      caughtUpOnce = afterViewing(caughtUpOnce, next.images);
    }
  } finally {
    Math.random = originalRandom;
  }
});

test('equal-count single candidates avoid the previous round before applying random tie breaks', () => {
  const originalRandom = Math.random;
  const history: ImageHistory = {
    seen: Object.fromEntries(activeGeneratedImages.map((entry) => [imageHistoryKey(entry), 1])),
    lastRound: [imageHistoryKey(activeGeneratedImages[0])],
  };
  try {
    Math.random = () => 0;
    expect(imageHistoryKey(createImageRound('single', history).target)).not.toBe(history.lastRound[0]);
  } finally {
    Math.random = originalRandom;
  }
});

test('comparison rounds cover eligible artwork while retaining exact prompts and four providers', () => {
  const originalRandom = Math.random;
  const eligibleKeys = [...new Set(getEligibleComparisonGroups().flat().map(imageHistoryKey))];
  // At least one unseen image can be consumed each round, even in uneven groups.
  const roundCount = eligibleKeys.length;
  let history = emptyHistory();
  try {
    Math.random = () => 0;
    for (let index = 0; index < roundCount; index += 1) {
      const before = JSON.stringify(history);
      const round = createImageRound('comparison', history);
      expect(JSON.stringify(history)).toBe(before);
      expect(round.format).toBe('comparison');
      expect(round.images).toHaveLength(4);
      expect(new Set(round.images.map(({ modelName }) => modelName)).size).toBe(4);
      const prompts = round.images.map(
        ({ promptId, prompt }) => JSON.stringify([promptId, prompt]),
      );
      expect(new Set(prompts).size).toBe(1);
      expect(round.images[round.options.indexOf(round.answer)]).toBe(round.target);
      history = afterViewing(history, round.images);
    }
    expect(Object.keys(history.seen).sort()).toEqual(eligibleKeys.sort());
    expect(Object.values(history.seen).reduce((sum, count) => sum + count, 0)).toBe(roundCount * 4);
  } finally {
    Math.random = originalRandom;
  }
});

test('comparison selection prioritizes more unseen images before recycling older images', () => {
  const originalRandom = Math.random;
  const [moreUnseen, fewerUnseen] = getEligibleComparisonGroups();
  expect(moreUnseen).toBeDefined();
  expect(fewerUnseen).toBeDefined();
  const history: ImageHistory = {
    seen: Object.fromEntries(activeGeneratedImages.map((entry) => [imageHistoryKey(entry), 20])),
    lastRound: [],
  };
  moreUnseen.forEach((entry, index) => {
    history.seen[imageHistoryKey(entry)] = index < 2 ? 0 : 9;
  });
  fewerUnseen.forEach((entry, index) => {
    history.seen[imageHistoryKey(entry)] = index === 0 ? 0 : 1;
  });
  try {
    Math.random = () => 0;
    const round = createImageRound('comparison', history);
    expect(round.target.promptId).toBe(moreUnseen[0].promptId);
    const unseen = round.images.filter((entry) => history.seen[imageHistoryKey(entry)] === 0);
    expect(unseen).toHaveLength(2);
  } finally {
    Math.random = originalRandom;
  }
});

test('comparison reuse prefers another prompt over repeating a low-count recent set', () => {
  const originalRandom = Math.random;
  const [previousGroup] = getEligibleComparisonGroups();
  const previous = previousGroup.slice(0, 4);
  const keys = previous.map(imageHistoryKey);
  const history: ImageHistory = {
    seen: Object.fromEntries(activeGeneratedImages.map((entry) => [imageHistoryKey(entry), 100])),
    lastRound: keys,
    recent: [
      ...activeGeneratedImages.map(imageHistoryKey).filter((key) => !keys.includes(key)), ...keys,
    ],
  };
  keys.forEach((key) => { history.seen[key] = 1; });
  try {
    Math.random = () => 0;
    const round = createImageRound('comparison', history);
    expect(round.target.promptId).not.toBe(previousGroup[0].promptId);
    expect(round.images.every((entry) => !keys.includes(imageHistoryKey(entry)))).toBe(true);
  } finally {
    Math.random = originalRandom;
  }
});

test('shown images are counted once before answering and persist across reload, mode, and format', async ({ page }) => {
  await gotoStable(page, '/');
  await page.evaluate((key) => {
    localStorage.removeItem(key);
    localStorage.removeItem('stats');
  }, IMAGE_HISTORY_STORAGE_KEY);

  await page.goto('classic');
  const first = await displayedImages(page, 1);
  let expected = afterViewing(emptyHistory(), first);
  await expectStoredHistory(page, expected);

  await page.reload();
  const second = await displayedImages(page, 1);
  expect(imageHistoryKey(second[0])).not.toBe(imageHistoryKey(first[0]));
  expected = afterViewing(expected, second);
  await expectStoredHistory(page, expected);

  await page.goto('quiz');
  const third = await displayedImages(page, 1);
  expect(expected.seen[imageHistoryKey(third[0])] ?? 0).toBe(0);
  expected = afterViewing(expected, third);
  await expectStoredHistory(page, expected);

  await page.goto('quiz?format=comparison');
  expected = afterViewing(expected, await displayedImages(page, 4));
  await expectStoredHistory(page, expected);
  expect(Object.values(expected.seen).reduce((sum, count) => sum + count, 0)).toBe(7);

  await page.goto('classic?format=comparison');
  expected = afterViewing(expected, await displayedImages(page, 4));
  await expectStoredHistory(page, expected);
  expect(Object.values(expected.seen).reduce((sum, count) => sum + count, 0)).toBe(11);
  // Viewing and switching games must not fabricate any guesses or statistics.
  expect(await page.evaluate(() => localStorage.getItem('stats'))).toBeNull();
});

test('exhausted-bank recency persists across reloads instead of repeating low-count images', async ({ page }) => {
  await gotoStable(page, '/');
  const allKeys = activeGeneratedImages.map(imageHistoryKey);
  const history: ImageHistory = {
    seen: Object.fromEntries(allKeys.map((key) => [key, 100])),
    lastRound: [allKeys[allKeys.length - 1]],
    recent: allKeys,
  };
  history.seen[allKeys[allKeys.length - 1]] = 1;
  await page.evaluate(({ key, saved }) => {
    localStorage.setItem(key, JSON.stringify({ version: 1, ...saved }));
  }, { key: IMAGE_HISTORY_STORAGE_KEY, saved: history });
  await page.goto('classic');
  const first = await displayedImages(page, 1);
  expect(imageHistoryKey(first[0])).toBe(allKeys[0]);
  let expected = afterViewing(history, first);
  await expectStoredHistory(page, expected);
  await page.reload();
  const second = await displayedImages(page, 1);
  expect(imageHistoryKey(second[0])).toBe(allKeys[1]);
  expected = afterViewing(expected, second);
  await expectStoredHistory(page, expected);
});

[
  ['unparseable JSON', '{broken'],
  ['an invalid stored shape', JSON.stringify({ version: 1, seen: ['invalid'], lastRound: false })],
].forEach(([description, value]) => {
  test(`rendering recovers from ${description} in image history`, async ({ page }) => {
    await gotoStable(page, '/');
    await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), {
      key: IMAGE_HISTORY_STORAGE_KEY,
      raw: value,
    });
    await page.goto('classic');
    const displayed = await displayedImages(page, 1);
    await expectStoredHistory(page, afterViewing(emptyHistory(), displayed));
  });
});

[true, false].forEach((blockReads) => {
  const blocked = blockReads ? 'reads and writes' : 'writes only';
  test(`blocked history ${blocked} retain in-memory exposure across game navigation`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(({ key, reads }) => {
      const originalGet = Storage.prototype.getItem;
      const originalSet = Storage.prototype.setItem;
      Storage.prototype.getItem = function blockedGet(name: string): string | null {
        if (reads && name === key) throw new DOMException('History storage blocked', 'SecurityError');
        return originalGet.call(this, name);
      };
      Storage.prototype.setItem = function blockedSet(name: string, value: string): void {
        if (name === key) throw new DOMException('History storage blocked', 'QuotaExceededError');
        originalSet.call(this, name, value);
      };
    }, { key: IMAGE_HISTORY_STORAGE_KEY, reads: blockReads });
    await gotoStable(page, '/');
    await page.getByRole('link', { name: 'Classic', exact: true }).click();
    const first = await displayedImages(page, 1);
    await page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true }).click();
    await page.getByRole('link', { name: 'Quiz', exact: true }).click();
    const second = await displayedImages(page, 1);
    expect(imageHistoryKey(second[0])).not.toBe(imageHistoryKey(first[0]));
    await page.getByRole('navigation').getByRole('link', { name: 'Home', exact: true }).click();
    await page.getByRole('radio', { name: 'Find the image' }).check();
    await page.getByRole('link', { name: 'Classic', exact: true }).click();
    await displayedImages(page, 4);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('stats'))).toBeNull();
  });
});

test('clearing statistics leaves image exposure history intact', async ({ page }) => {
  await gotoStable(page, '/');
  const history: StoredHistory = {
    version: 1,
    seen: { [imageHistoryKey(activeGeneratedImages[0])]: 3 },
    lastRound: [imageHistoryKey(activeGeneratedImages[0])],
  };
  await page.evaluate(({ key, saved, stats }) => {
    localStorage.setItem(key, JSON.stringify(saved));
    localStorage.setItem('stats', stats);
  }, { key: IMAGE_HISTORY_STORAGE_KEY, saved: history, stats: SEEDED_STATS });
  await page.goto('stats');
  await page.getByRole('button', { name: 'Clear stats', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('stats'))).toBeNull();
  expect(await storedHistory(page)).toEqual(history);
});
