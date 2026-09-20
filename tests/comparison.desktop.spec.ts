import { expect, test, type Page } from '@playwright/test';
import { activeGeneratedImages, generatedImages, type GeneratedImage } from '../src/data/generatedImages.ts';
import { createImageRound, getEligibleComparisonGroups } from '../src/imageRounds.ts';
import type { Stats } from '../src/stats.ts';
import {
  answerCorrectly, gotoStable, LOCK_IN_MS, REVEAL_MS,
} from './helpers.ts';

const LABELS = ['Image A', 'Image B', 'Image C', 'Image D'];

function fixture(
  modelName: GeneratedImage['modelName'],
  overrides: Partial<GeneratedImage> = {},
): GeneratedImage {
  return {
    id: `fixture-${modelName}`,
    image: `fixtures/${modelName}.png`,
    modelName,
    promptId: 'fixture-prompt',
    prompt: 'A shared synthetic prompt.',
    provenance: {
      generator: 'Test fixture',
      source: 'Eligibility unit test',
      generatedAt: '2026-09-12',
    },
    ...overrides,
  };
}

async function displayedEntries(page: Page): Promise<GeneratedImage[]> {
  const images = page.getByTestId('comparison-image');
  await expect(images).toHaveCount(4);
  await Promise.all(LABELS.map((_, index) => (
    expect(images.nth(index)).toHaveJSProperty('complete', true)
  )));
  const sources = await images.evaluateAll((elements) => elements.map((element) => {
    const image = element as HTMLImageElement;
    return { src: image.src, width: image.naturalWidth };
  }));
  return sources.map(({ src, width }) => {
    expect(width).toBeGreaterThan(0);
    const entry = activeGeneratedImages.find(
      ({ image }) => decodeURIComponent(src).endsWith(image),
    );
    if (!entry) throw new Error(`Unregistered comparison image: ${src}`);
    return entry;
  });
}

test('comparison eligibility requires four distinct providers and exact prompt text and id', () => {
  const three = [fixture('ChatGPT'), fixture('Gemini'), fixture('Grok')];
  const fourth = fixture('Meta AI');
  expect(getEligibleComparisonGroups(three)).toEqual([]);
  expect(getEligibleComparisonGroups([...three, fourth])).toHaveLength(1);
  expect(getEligibleComparisonGroups([
    ...three,
    fixture('ChatGPT', { id: 'duplicate-provider', image: 'fixtures/another-output.png' }),
  ])).toEqual([]);
  expect(getEligibleComparisonGroups([
    ...three, { ...fourth, prompt: `${fourth.prompt} ` },
  ])).toEqual([]);
  expect(getEligibleComparisonGroups([
    ...three, { ...fourth, promptId: 'a-different-id' },
  ])).toEqual([]);
});

test('comparison rounds align four distinct original providers with their target slot', () => {
  const originalRandom = Math.random;
  const originalManifest = JSON.stringify(generatedImages);
  let seed = 123456;
  try {
    Math.random = () => 0;
    const first = createImageRound('comparison');
    expect(first.answer).toBe('Image A');
    expect(first.target).toBe(first.images[0]);
    Math.random = () => {
      seed = (1664525 * seed + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let index = 0; index < 64; index += 1) {
      const round = createImageRound('comparison');
      expect(round.format).toBe('comparison');
      expect(round.options).toEqual(LABELS);
      expect(round.images).toHaveLength(4);
      expect(new Set(round.images.map(({ modelName }) => modelName)).size).toBe(4);
      expect(new Set(round.images.map(({ prompt }) => prompt)).size).toBe(1);
      expect(new Set(round.images.map(({ promptId }) => promptId)).size).toBe(1);
      expect(round.images[round.options.indexOf(round.answer)]).toBe(round.target);
      round.images.forEach((image) => {
        const source = activeGeneratedImages.find((entry) => entry.image === image.image);
        expect(image).toMatchObject({
          modelName: source?.modelName,
          promptId: source?.promptId,
          prompt: source?.prompt,
        });
      });
    }
    expect(JSON.stringify(generatedImages)).toBe(originalManifest);
  } finally {
    Math.random = originalRandom;
  }
});

test('the default home selection still starts a single-image game', async ({ page }) => {
  await gotoStable(page, '/');
  await expect(page.getByRole('radio', { name: 'Guess the model' })).toBeChecked();
  await expect(page.getByRole('radio', { name: 'Find the image' })).not.toBeChecked();
  await page.getByRole('link', { name: 'Classic', exact: true }).click();
  await expect(page).toHaveURL(/\/classic$/);
  await expect(page.locator('.mil-screen img')).toHaveCount(1);
  await expect(page.getByTestId('comparison-artwork')).toHaveCount(0);
  await expect(page.getByRole('heading', {
    name: 'Which model generated this image?',
  })).toBeVisible();
});

['Classic', 'Quiz'].forEach((mode) => {
  test(`Find the image starts ${mode} with four labeled choices`, async ({ page }) => {
    await gotoStable(page, '/');
    await page.getByRole('radio', { name: 'Find the image' }).check();
    await expect(page.getByRole('radio', { name: 'Find the image' })).toBeChecked();
    await expect(page.getByRole('link', { name: 'Classic', exact: true }))
      .toHaveAttribute('href', /classic\?format=comparison$/);
    await expect(page.getByRole('link', { name: 'Quiz', exact: true }))
      .toHaveAttribute('href', /quiz\?format=comparison$/);
    await page.getByRole('link', { name: mode, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${mode.toLowerCase()}\\?format=comparison$`));
    await expect(page.getByTestId('comparison-artwork')).toBeVisible();
    await expect(page.getByTestId('comparison-image')).toHaveCount(4);
    await expect(page.locator('[data-testid="answer"] .mil-answer-text')).toHaveText(LABELS);
  });
});

test('real comparison artwork shares one prompt and reveals attribution only after lock-in', async ({ page }) => {
  await gotoStable(page, '/classic?format=comparison', { artwork: 'real' });
  const entries = await displayedEntries(page);
  const target = entries[0];
  const board = page.getByTestId('comparison-artwork');
  expect(new Set(entries.map(({ modelName }) => modelName)).size).toBe(4);
  expect(new Set(entries.map(({ promptId }) => promptId)).size).toBe(1);
  expect(new Set(entries.map(({ prompt }) => prompt)).size).toBe(1);
  await expect(page.getByRole('heading', {
    name: `Which image was generated by ${target.modelName}?`,
  })).toBeVisible();
  await Promise.all(entries.map(({ modelName }, index) => Promise.all([
    expect(board).not.toContainText(modelName),
    expect(page.getByTestId('comparison-image').nth(index)).toHaveAttribute('alt', LABELS[index]),
  ])));
  const prompt = board.locator('details');
  await prompt.locator('summary').click();
  expect(await prompt.locator('p').textContent()).toBe(target.prompt);
  await prompt.locator('summary').click();
  await expect(page.getByTestId('answer').last()).toBeInViewport({ ratio: 1 });
  await expect(page).toHaveScreenshot('comparison-classic-board.png');

  // Freeze wall-clock advancement while checking the millisecond before the reveal.
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  await page.getByTestId('answer').first().click();
  await page.clock.runFor(LOCK_IN_MS - 1);
  await Promise.all(entries.map(({ modelName }) => expect(board).not.toContainText(modelName)));
  await page.clock.runFor(1);
  await expect(page.getByTestId('answer').first()).toHaveClass(/mil-answer-correct/);
  await Promise.all(entries.map(({ modelName }) => expect(board).toContainText(modelName)));
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('stats') ?? 'null')) as Stats;
  expect(Object.keys(stats.models)).toEqual([target.modelName]);
  expect(stats.models[target.modelName]).toEqual({
    correct: 1, incorrect: 0, total: 1, correctImages: [target.image],
  });
  expect(stats.classic).toEqual({ correct: 1, incorrect: 0, total: 1 });
});

test('comparison lifelines remove wrong slots and advise using image labels', async ({ page }) => {
  await gotoStable(page, '/classic?format=comparison');
  const entries = await displayedEntries(page);
  await page.getByTestId('lifeline-fiftyFifty').click();
  await expect(page.locator('[data-testid="answer"]:disabled')).toHaveCount(2);
  await expect(page.getByTestId('answer').first()).toBeEnabled();
  const inPlay = await page.locator(
    '[data-testid="answer"]:not(:disabled) .mil-answer-text',
  ).allTextContents();
  expect(inPlay).toHaveLength(2);
  expect(inPlay).toContain('Image A');

  await page.getByTestId('lifeline-phoneAFriend').click();
  const friend = page.locator('.mil-panel').filter({
    has: page.getByRole('heading', { name: 'Phone a Friend' }),
  });
  await expect(friend).toContainText('Image A');
  await Promise.all(entries.map(({ modelName }) => expect(friend).not.toContainText(modelName)));
  await friend.getByRole('button', { name: 'Back to the question' }).click();
  await page.getByTestId('lifeline-askTheAudience').click();
  const audience = page.locator('.mil-panel').filter({
    has: page.getByRole('heading', { name: 'Ask the Audience' }),
  });
  await expect(audience.getByText(/^Image [A-D]$/)).toHaveText(inPlay);
  await Promise.all(entries.map(({ modelName }) => expect(audience).not.toContainText(modelName)));
});

test('next question and Play again keep the Classic comparison format', async ({ page }) => {
  await gotoStable(page, '/classic?format=comparison');
  await answerCorrectly(page);
  await expect(page.getByText('Question 2 for')).toBeVisible();
  await expect(page.getByTestId('comparison-image')).toHaveCount(4);
  await page.getByRole('button', { name: 'Walk away' }).click();
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page).toHaveURL(/\/classic\?format=comparison$/);
  await expect(page.getByText('Question 1 for')).toBeVisible();
  await expect(page.getByTestId('comparison-image')).toHaveCount(4);
  await expect(page.locator('[data-testid="answer"] .mil-answer-text')).toHaveText(LABELS);
});

test('a wrong Quiz slot counts against only the target model and keeps comparisons', async ({ page }) => {
  await gotoStable(page, '/quiz?format=comparison');
  const [target] = await displayedEntries(page);
  await page.getByTestId('answer').last().click();
  await page.clock.runFor(LOCK_IN_MS + REVEAL_MS);
  await expect(page.getByText('Question 2 of 20')).toBeVisible();
  await expect(page.getByTestId('comparison-image')).toHaveCount(4);
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('stats') ?? 'null')) as Stats;
  expect(Object.keys(stats.models)).toEqual([target.modelName]);
  expect(stats.models[target.modelName]).toEqual({
    correct: 0, incorrect: 1, total: 1, correctImages: [],
  });
  expect(stats.quiz).toEqual({ correct: 0, incorrect: 1, total: 1 });
});
