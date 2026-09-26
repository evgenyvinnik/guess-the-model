import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { activeGeneratedImages, generatedImages } from '../src/data/generatedImages.ts';
import { challengePrompts, type ChallengePromptId } from '../src/data/challengePrompts.ts';
import { createImageRound } from '../src/imageRounds.ts';
import { answerModels, playableQuestions, questions } from '../src/questions.ts';
import { gotoStable, LOCK_IN_MS, waitForArtwork } from './helpers.ts';

test('registered artwork files and matched prompts are consistent', () => {
  const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
  const prompts = new Map<string, string>();

  expect(generatedImages.length).toBeGreaterThan(0);
  expect(new Set(generatedImages.map(({ id }) => id)).size).toBe(generatedImages.length);
  expect(new Set(generatedImages.map(({ image }) => image)).size).toBe(generatedImages.length);

  generatedImages.forEach((entry) => {
    const imagePath = path.resolve(publicDirectory, entry.image);
    expect(imagePath.startsWith(publicDirectory)).toBe(true);
    expect(fs.existsSync(imagePath), entry.image).toBe(true);
    expect(fs.statSync(imagePath).isFile(), entry.image).toBe(true);
    expect(fs.statSync(imagePath).size, entry.image).toBeGreaterThan(0);
    expect(entry.prompt.trim()).not.toBe('');
    expect(entry.prompt).not.toBe('stub');
    expect(entry.provenance.generator.trim()).not.toBe('');
    expect(entry.provenance.source.trim()).not.toBe('');
    expect(Number.isNaN(Date.parse(entry.provenance.generatedAt))).toBe(false);

    if (prompts.has(entry.promptId)) {
      expect(entry.prompt, entry.promptId).toBe(prompts.get(entry.promptId));
    } else {
      prompts.set(entry.promptId, entry.prompt);
    }
  });
});

test('new rounds use canonical challenge prompts while older originals remain in the catalog', () => {
  const challengeIds = Object.keys(challengePrompts);
  const represented = new Set<string>();
  const challengeEntries = generatedImages.filter((entry) => {
    if (entry.playable === false || !challengeIds.includes(entry.promptId)) return false;
    const key = JSON.stringify([entry.modelName, entry.promptId]);
    if (represented.has(key)) return false;
    represented.add(key);
    return true;
  });
  const activeIds = new Set(challengeEntries.map(({ id }) => id));
  const archivedEntries = generatedImages.filter(({ id }) => !activeIds.has(id));
  expect(challengeEntries.length).toBeGreaterThan(0);
  expect(archivedEntries.length).toBeGreaterThan(0);
  expect(activeGeneratedImages).toEqual(challengeEntries);
  expect(Object.keys(playableQuestions).sort())
    .toEqual(challengeEntries.map(({ id }) => id).sort());
  challengeEntries.forEach((entry) => {
    expect(entry.prompt).toBe(challengePrompts[entry.promptId as ChallengePromptId].prompt);
    expect(questions[entry.id]).toMatchObject({ image: entry.image, prompt: entry.prompt });
  });
  archivedEntries.forEach((entry) => {
    expect(questions[entry.id]).toMatchObject({ image: entry.image, prompt: entry.prompt });
    expect(playableQuestions[entry.id]).toBeUndefined();
  });

  const archivedKeys = new Set(archivedEntries.map(({ image }) => image));
  for (let index = 0; index < 32; index += 1) {
    const format = index % 2 === 0 ? 'single' : 'comparison';
    const round = createImageRound(format, { seen: {}, lastRound: [], recent: [] });
    round.images.forEach((entry) => {
      expect(archivedKeys.has(entry.image)).toBe(false);
      expect(challengeIds).toContain(entry.promptId);
    });
  }
});

test('single-round answer choices use providers that can be correct in the active bank', () => {
  const activeProviders = new Set(activeGeneratedImages.map(({ modelName }) => modelName));
  expect(activeProviders.size).toBeGreaterThanOrEqual(4);
  expect(new Set(answerModels)).toEqual(activeProviders);

  for (let index = 0; index < 64; index += 1) {
    const round = createImageRound('single', { seen: {}, lastRound: [], recent: [] });
    expect(round.options).toHaveLength(4);
    expect(new Set(round.options).size).toBe(4);
    expect(round.options).toContain(round.target.modelName);
    round.options.forEach((option) => expect(answerModels).toContain(option));
  }
});

test('saved artwork loads and its exact prompt stays anonymous on desktop and mobile', async ({ page }) => {
  const entry = activeGeneratedImages[0];
  await gotoStable(page, '/classic', { artwork: 'real' });
  await waitForArtwork(page);
  const artwork = page.locator('.mil-artwork');
  const image = artwork.getByRole('img');
  await expect(image).toHaveAttribute('src', new RegExp(`${entry.image}$`));
  const naturalWidth = await image.evaluate((element: HTMLImageElement) => element.naturalWidth);
  expect(naturalWidth).toBeGreaterThan(0);
  await expect(artwork.locator('.mil-artwork-fallback')).toHaveCount(0);

  const disclosure = artwork.locator('details');
  const summary = disclosure.locator('summary');
  await summary.focus();
  await summary.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  expect(await disclosure.locator('p').textContent()).toBe(entry.prompt);
  await expect(artwork).not.toContainText(entry.modelName);
  await expect(artwork).not.toContainText(entry.provenance.generator);
  await expect(artwork).not.toContainText(entry.provenance.source);
  await expect(page).toHaveScreenshot('classic-real-artwork-prompt.png');

  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await expect(disclosure.locator('p')).toBeVisible();
  await expect(page).toHaveScreenshot('classic-real-artwork-prompt-mobile.png', { fullPage: true });
  await page.getByTestId('answer').last().scrollIntoViewIfNeeded();
  await expect(page.getByTestId('answer').last()).toBeInViewport({ ratio: 1 });
});

const registeredModels = [...new Set(activeGeneratedImages.map(({ modelName }) => modelName))];

registeredModels.forEach((modelName) => {
  test(`${modelName} can be answered correctly and its statistics artwork loads`, async ({ page }) => {
    const index = activeGeneratedImages.findIndex((entry) => entry.modelName === modelName);
    const entry = activeGeneratedImages[index];
    await gotoStable(page, '/classic', {
      artwork: 'real',
      random: (index + 0.5) / activeGeneratedImages.length,
    });
    await waitForArtwork(page);
    const image = page.locator('.mil-artwork img');
    await expect(image).toHaveAttribute('src', new RegExp(`${entry.image}$`));
    const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);

    const answer = page.getByTestId('answer').filter({ hasText: modelName });
    await answer.click();
    await page.clock.runFor(LOCK_IN_MS);
    await expect(answer).toHaveClass(/mil-answer-correct/);

    await page.locator('footer').getByRole('link', { name: 'Stats' }).click();
    const thumbnail = page.getByRole('img', { name: `${modelName} artwork you identified` });
    await expect(thumbnail).toHaveAttribute('src', new RegExp(`${entry.image}$`));
    await expect(thumbnail).toHaveJSProperty('complete', true);
    const thumbnailWidth = await thumbnail.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(thumbnailWidth).toBeGreaterThan(0);
  });
});
