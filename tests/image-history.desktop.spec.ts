import { expect, test, type Page } from '@playwright/test';
import { activeGeneratedImages, generatedImages } from '../src/data/generatedImages.ts';
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

test('the playable bank has one output for each provider and prompt', () => {
  const keys = activeGeneratedImages.map(({ modelName, promptId }) => (
    JSON.stringify([modelName, promptId])
  ));
  expect(new Set(keys).size).toBe(keys.length);
  expect(generatedImages.length).toBeGreaterThan(activeGeneratedImages.length);
});

/** Simulate what the contestant has seen without relying on persistence internals. */
function afterViewing(
  history: ImageHistory,
  images: QuestionEntry[],
  target?: QuestionEntry,
): ImageHistory {
  const seen = { ...history.seen };
  const keys = [...new Set(images.map(imageHistoryKey))];
  keys.forEach((key) => { seen[key] = (seen[key] ?? 0) + 1; });
  const targets = target ? {
    ...history.targets,
    [target.modelName]: (history.targets?.[target.modelName] ?? 0) + 1,
  } : history.targets;
  return {
    seen,
    lastRound: keys,
    recent: [
      ...(history.recent ?? Object.keys(history.seen)).filter((key) => !keys.includes(key)),
      ...keys,
    ],
    ...(targets ? { targets } : {}),
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
  await expect.poll(() => storedHistory(page)).toMatchObject({ version: 1, ...history });
}

test('single rounds balance target providers and exhaust each provider before reusing its images', () => {
  const originalRandom = Math.random;
  let history = emptyHistory();
  const providers = [...new Set(activeGeneratedImages.map(({ modelName }) => modelName))];
  const observed = new Map(providers.map((model) => [model, new Set<string>()]));
  const providerSizes = new Map(providers.map((model) => [model, activeGeneratedImages
    .filter((entry) => entry.modelName === model).length]));
  try {
    Math.random = () => 0;
    for (let index = 0; index < providers.length * 12; index += 1) {
      const before = JSON.stringify(history);
      const round = createImageRound('single', history);
      const key = imageHistoryKey(round.target);
      expect(JSON.stringify(history)).toBe(before);
      const provider = round.target.modelName;
      if (observed.get(provider)?.size !== providerSizes.get(provider)) {
        expect(observed.get(round.target.modelName)?.has(key)).toBe(false);
      }
      expect(round.images).toEqual([round.target]);
      expect(round.answer).toBe(round.target.modelName);
      observed.get(round.target.modelName)?.add(key);
      history = afterViewing(history, round.images, round.target);
    }
    expect(providers.map((model) => history.targets?.[model])).toEqual(providers.map(() => 12));
    expect(providers.map((model) => observed.get(model)?.size))
      .toEqual(providers.map((model) => Math.min(12, providerSizes.get(model) ?? 0)));
    const nextSix = providers.map(() => {
      const round = createImageRound('single', history);
      history = afterViewing(history, round.images, round.target);
      return round.target.modelName;
    });
    expect(new Set(nextSix).size).toBe(providers.length);
    expect(providers.map((model) => history.targets?.[model])).toEqual(providers.map(() => 13));
  } finally {
    Math.random = originalRandom;
  }
});

test('a new image is first within its provider without repeating to catch up with older views', () => {
  const originalRandom = Math.random;
  const newest = activeGeneratedImages[activeGeneratedImages.length - 1];
  const newestKey = imageHistoryKey(newest);
  const providers = [...new Set(activeGeneratedImages.map(({ modelName }) => modelName))];
  const providerImages = activeGeneratedImages.filter(
    ({ modelName }) => modelName === newest.modelName,
  );
  const history: ImageHistory = {
    seen: Object.fromEntries(
      activeGeneratedImages.slice(0, -1).map((entry) => [imageHistoryKey(entry), 3]),
    ),
    lastRound: [imageHistoryKey(activeGeneratedImages[0])],
    targets: Object.fromEntries(providers.filter((model) => model !== newest.modelName)
      .map((model) => [model, 100])),
  };
  try {
    Math.random = () => 0;
    expect(createImageRound('single', history).target.image).toBe(newest.image);
    let caughtUpOnce = afterViewing(history, [newest], newest);
    expect(caughtUpOnce.seen[newestKey]).toBe(1);
    for (let index = 0; index < providerImages.length - 1; index += 1) {
      const next = createImageRound('single', caughtUpOnce);
      expect(next.target.modelName).toBe(newest.modelName);
      expect(next.target.image).not.toBe(newest.image);
      caughtUpOnce = afterViewing(caughtUpOnce, next.images, next.target);
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
      history = afterViewing(history, round.images, round.target);
    }
    expect(Object.keys(history.seen).sort()).toEqual(eligibleKeys.sort());
    expect(Object.values(history.seen).reduce((sum, count) => sum + count, 0)).toBe(roundCount * 4);
  } finally {
    Math.random = originalRandom;
  }
});

test('comparison rounds balance target providers and displayed provider exposure', () => {
  const originalRandom = Math.random;
  let history = emptyHistory();
  const providers = [...new Set(activeGeneratedImages.map(({ modelName }) => modelName))];
  try {
    Math.random = () => 0;
    for (let index = 0; index < providers.length * 10; index += 1) {
      const round = createImageRound('comparison', history);
      expect(new Set(round.images.map(({ modelName }) => modelName)).size).toBe(4);
      history = afterViewing(history, round.images, round.target);
    }
    expect(providers.map((model) => history.targets?.[model])).toEqual(providers.map(() => 10));
    const views = providers.map((model) => activeGeneratedImages
      .filter(({ modelName }) => modelName === model)
      .reduce((total, entry) => total + (history.seen[imageHistoryKey(entry)] ?? 0), 0));
    expect(Math.max(...views) - Math.min(...views)).toBeLessThanOrEqual(4);
  } finally {
    Math.random = originalRandom;
  }
});

test('mixing single and comparison rounds keeps provider targets even', () => {
  const originalRandom = Math.random;
  let history = emptyHistory();
  const providers = [...new Set(activeGeneratedImages.map(({ modelName }) => modelName))];
  try {
    Math.random = () => 0;
    for (let index = 0; index < providers.length * 12; index += 1) {
      const round = createImageRound(index % 2 === 0 ? 'single' : 'comparison', history);
      history = afterViewing(history, round.images, round.target);
    }
    expect(providers.map((model) => history.targets?.[model])).toEqual(providers.map(() => 12));
    const views = providers.map((model) => activeGeneratedImages
      .filter(({ modelName }) => modelName === model)
      .reduce((total, entry) => total + (history.seen[imageHistoryKey(entry)] ?? 0), 0));
    expect(Math.max(...views) - Math.min(...views)).toBeLessThanOrEqual(4);
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
  const historyWithTargets = await storedHistory(page);
  expect(Object.values(historyWithTargets?.targets ?? {})
    .reduce((sum, count) => sum + count, 0)).toBe(5);
  expect(Object.values(historyWithTargets?.targets ?? {}).every((count) => count === 1)).toBe(true);
  // Viewing and switching games must not fabricate any guesses or statistics.
  expect(await page.evaluate(() => localStorage.getItem('stats'))).toBeNull();
});

test('exhausted-bank prompt diversity persists across reloads', async ({ page }) => {
  await gotoStable(page, '/');
  const allKeys = activeGeneratedImages.map(imageHistoryKey);
  const firstModel = activeGeneratedImages[0].modelName;
  const history: ImageHistory = {
    seen: Object.fromEntries(allKeys.map((key) => [key, 100])),
    lastRound: [allKeys[allKeys.length - 1]],
    recent: allKeys,
    targets: Object.fromEntries(
      [...new Set(activeGeneratedImages.map(({ modelName }) => modelName))]
        .filter((model) => model !== firstModel).map((model) => [model, 100]),
    ),
  };
  history.seen[allKeys[allKeys.length - 1]] = 1;
  await page.evaluate(({ key, saved }) => {
    localStorage.setItem(key, JSON.stringify({ version: 1, ...saved }));
  }, { key: IMAGE_HISTORY_STORAGE_KEY, saved: history });
  await page.goto('classic');
  const first = await displayedImages(page, 1);
  expect(imageHistoryKey(first[0])).not.toBe(allKeys[allKeys.length - 1]);
  let expected = afterViewing(history, first);
  await expectStoredHistory(page, expected);
  await page.reload();
  const second = await displayedImages(page, 1);
  expect(imageHistoryKey(second[0])).not.toBe(imageHistoryKey(first[0]));
  expect(second[0].promptId).not.toBe(first[0].promptId);
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
