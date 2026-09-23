import { expect, test } from '@playwright/test';
import { activeGeneratedImages, generatedImages } from '../src/data/generatedImages.ts';
import { legacyQuestions } from '../src/questions.ts';
import { IMAGE_HISTORY_STORAGE_KEY } from '../src/imageHistory.ts';
import type { Stats } from '../src/stats.ts';
import { gotoStable, LOCK_IN_MS } from './helpers.ts';

const providerCount = (provider: string) => activeGeneratedImages
  .filter(({ modelName }) => modelName === provider).length;

test('the collection contains only playable images until older artwork has been identified', async ({ page }) => {
  await gotoStable(page, '/stats');
  await expect(page.getByLabel('Image not yet identified', { exact: true }))
    .toHaveCount(activeGeneratedImages.length);
  await expect(page.getByRole('region', { name: 'Copilot statistics', exact: true }))
    .toContainText(`0 of ${providerCount('Copilot')} current images identified`);
  await expect(page.getByRole('region', { name: 'Meta AI statistics', exact: true }))
    .toContainText(`0 of ${providerCount('Meta AI')} current images identified`);
  await expect(page.getByRole('region', { name: 'EMU statistics', exact: true })).toHaveCount(0);
  await Promise.all(['Grok', 'Yandex Alice', 'Qwen'].map((provider) => (
    expect(page.getByRole('region', { name: `${provider} statistics`, exact: true }))
      .toContainText(`0 of ${providerCount(provider)} current images identified`)
  )));
  await expect(page.getByTestId('stat-accuracy')).toContainText('0%');
  await expect(page.getByRole('main').getByRole('img')).toHaveCount(0);
});

test('a correctly identified Qwen image appears in statistics with its prompt and version', async ({ page }) => {
  const qwen = activeGeneratedImages.find(({ modelName }) => modelName === 'Qwen')!;
  const stats: Stats = {
    correct: 1,
    incorrect: 0,
    total: 1,
    classic: { correct: 1, incorrect: 0, total: 1 },
    quiz: { correct: 0, incorrect: 0, total: 0 },
    models: {
      Qwen: {
        correct: 1, incorrect: 0, total: 1, correctImages: [qwen.image],
      },
    },
  };
  await gotoStable(page, '/stats', { artwork: 'real', storage: { stats: JSON.stringify(stats) } });
  const section = page.getByRole('region', { name: 'Qwen statistics', exact: true });
  await expect(section).toContainText(`1 of ${providerCount('Qwen')} current images identified`);
  await section.getByRole('button', { name: 'View Qwen image details' }).click();
  const dialog = page.getByRole('dialog', { name: 'Image generation details' });
  await expect(dialog).toContainText('Qwen-Image 3.0');
  await expect(dialog).toContainText(qwen.prompt);
  await expect(dialog.getByRole('img')).toHaveJSProperty('naturalWidth', 2048);
});

test('totals, unique originals, new provenance, and earlier collections remain consistent on desktop and mobile', async ({ page }) => {
  const copilot = activeGeneratedImages.find(({ id }) => id === 'copilot-challenge-2026-09-19-elf-archer-low-angle')!;
  const meta = activeGeneratedImages.filter(({ id }) => id.startsWith('metaai-') && id.includes('maze-valid-route'));
  expect(meta).toHaveLength(2);
  const grok = generatedImages.find(({ modelName }) => modelName === 'Grok')!;
  const emu = Object.values(legacyQuestions).find(({ modelName }) => modelName === 'EMU')!;
  const stats = {
    correct: 7,
    incorrect: 3,
    total: 10,
    classic: { correct: 5, incorrect: 2, total: 7 },
    quiz: { correct: 2, incorrect: 1, total: 3 },
    models: {
      Copilot: {
        correct: 3, incorrect: 1, total: 4, correctImages: [copilot.image, copilot.image],
      },
      'Meta AI': {
        correct: 2, incorrect: 1, total: 3, correctImages: meta.map(({ image }) => image),
      },
      Grok: {
        correct: 1, incorrect: 1, total: 2, correctImages: [grok.image],
      },
      EMU: {
        correct: 1, incorrect: 0, total: 1, correctImages: [emu.image],
      },
    },
  };
  await gotoStable(page, '/stats', { artwork: 'real', storage: { stats: JSON.stringify(stats) } });
  await expect(page.getByTestId('stat-guesses')).toContainText('10');
  await expect(page.getByTestId('stat-correct')).toContainText('7');
  await expect(page.getByTestId('stat-incorrect')).toContainText('3');
  await expect(page.getByTestId('stat-accuracy')).toContainText('70%');
  await expect(page.getByRole('region', { name: 'Classic Mode', exact: true })).toContainText('5 correct of 7');
  await expect(page.getByRole('region', { name: 'Quiz Mode', exact: true })).toContainText('2 correct of 3');
  const copilotSection = page.getByRole('region', { name: 'Copilot statistics', exact: true });
  await expect(copilotSection).toContainText('Copilot: 3 correct / 1 incorrect');
  await expect(copilotSection).toContainText(`1 of ${providerCount('Copilot')} current images identified`);
  await expect(copilotSection.getByRole('button')).toHaveCount(1);
  const metaSection = page.getByRole('region', { name: 'Meta AI statistics', exact: true });
  await expect(metaSection).toContainText(`2 of ${providerCount('Meta AI')} current images identified`);
  await expect(metaSection.getByRole('button')).toHaveCount(2);
  await expect(page.getByText('Earlier bank', { exact: true })).toHaveCount(2);

  await copilotSection.getByRole('button').click();
  const dialog = page.getByRole('dialog', { name: 'Image generation details' });
  await expect(dialog).toContainText('Azure OpenAI ImageGen · Version not disclosed');
  await expect(dialog).toContainText('Sep 19, 2026');
  await expect(dialog).toContainText(copilot.prompt);
  await expect(dialog.getByRole('img')).toHaveJSProperty('naturalWidth', 1254);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await metaSection.getByRole('button').last().click();
  await expect(dialog).toContainText('Programmatic maze rendering');
  await expect(dialog).toContainText('depth-first search');
  await expect(dialog.getByRole('img')).toHaveJSProperty('naturalWidth', 2400);
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(metaSection.getByRole('button').last()).toBeFocused();
  await page.getByRole('region', { name: 'Grok statistics', exact: true }).getByRole('button').click();
  await expect(dialog).toContainText('Quality 2.0');
  await page.keyboard.press('Escape');
  await page.getByRole('region', { name: 'EMU statistics', exact: true }).getByRole('button').click();
  await expect(dialog).toContainText('Version not disclosed');
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByTestId('stat-guesses')).toContainText('10');
  await expect(metaSection.getByRole('button')).toHaveCount(2);
});

test('every format and mode records one answer against the target and survives reload', async ({ page }) => {
  await gotoStable(page, '/');
  const expected: Stats = {
    correct: 0,
    incorrect: 0,
    total: 0,
    classic: { correct: 0, incorrect: 0, total: 0 },
    quiz: { correct: 0, incorrect: 0, total: 0 },
    models: {},
  };
  const scenarios = [
    { format: 'single', mode: 'classic' },
    { format: 'single', mode: 'quiz' },
    { format: 'comparison', mode: 'classic' },
    { format: 'comparison', mode: 'quiz' },
  ] as const;
  // Each answer must finish before the same player's next mode can start.
  /* eslint-disable no-await-in-loop */
  for (let index = 0; index < scenarios.length; index += 1) {
    const { format, mode } = scenarios[index];
    await page.goto(`${mode}${format === 'comparison' ? '?format=comparison' : ''}`);
    const images = page.locator(format === 'comparison' ? '[data-testid="comparison-image"]' : '.mil-artwork img');
    const sources = await images.evaluateAll((elements) => elements.map(
      (element) => element.getAttribute('src'),
    ));
    const shown = sources.map((src) => activeGeneratedImages.find(
      ({ image }) => src?.endsWith(image),
    )!);
    const targetModel = format === 'comparison'
      ? (await page.getByRole('heading', { name: /Which image was generated by/ }).innerText())
        .match(/^Which image was generated by (.+)\?$/)?.[1]
      : shown[0].modelName;
    const targetIndex = shown.findIndex(({ modelName }) => modelName === targetModel);
    const target = shown[targetIndex];
    const correct = mode === 'classic';
    const answer = format === 'comparison'
      ? page.getByTestId('answer').nth(correct ? targetIndex : (targetIndex + 1) % 4)
      : page.getByTestId('answer').filter(correct ? { hasText: target.modelName } : { hasNotText: target.modelName }).first();
    await answer.click();
    await expect(page.getByTestId('answer').first()).toBeDisabled();
    await page.clock.runFor(LOCK_IN_MS);
    const result = correct ? 'correct' : 'incorrect';
    expected[result] += 1;
    expected.total += 1;
    expected[mode][result] += 1;
    expected[mode].total += 1;
    const model = expected.models[target.modelName] ?? {
      correct: 0, incorrect: 0, total: 0, correctImages: [],
    };
    model[result] += 1;
    model.total += 1;
    if (correct && !model.correctImages.includes(target.image)) {
      model.correctImages.push(target.image);
    }
    expected.models[target.modelName] = model;
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('stats')!))).toEqual(expected);
  }
  /* eslint-enable no-await-in-loop */
  await page.locator('footer').getByRole('link', { name: 'Stats', exact: true }).click();
  await page.reload();
  await expect(page.getByTestId('stat-guesses')).toContainText('4');
  await expect(page.getByTestId('stat-accuracy')).toContainText('50%');
  await expect(page.getByRole('region', { name: 'Classic Mode', exact: true }))
    .toContainText('2 correct of 2');
  await expect(page.getByRole('region', { name: 'Quiz Mode', exact: true }))
    .toContainText('0 correct of 2');
  const history = await page.evaluate(
    (key) => localStorage.getItem(key),
    IMAGE_HISTORY_STORAGE_KEY,
  );
  await page.getByRole('button', { name: 'Clear stats', exact: true }).click();
  await expect(page.getByTestId('stat-guesses')).toContainText('0');
  await expect(page.getByRole('main').getByRole('img')).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), IMAGE_HISTORY_STORAGE_KEY))
    .toBe(history);
});

test('invalid saved counters and image lists recover while valid historical counts survive', async ({ page }) => {
  const malformed = {
    correct: 4,
    incorrect: 2,
    total: 999,
    classic: { correct: 3, incorrect: 1 },
    quiz: { correct: 1, incorrect: 1 },
    models: {
      ChatGPT: { correct: 4, incorrect: 2, correctImages: 'not-an-array' },
      Copilot: null,
      'Meta AI': {
        correct: '2', incorrect: -1, total: false, correctImages: [null, 12, ''],
      },
    },
  };
  await gotoStable(page, '/');
  await page.evaluate((stats) => localStorage.setItem('stats', JSON.stringify(stats)), malformed);
  await page.goto('stats');
  await expect(page.getByTestId('stat-guesses')).toContainText('6');
  await expect(page.getByTestId('stat-accuracy')).toContainText('67%');
  await expect(page.getByRole('region', { name: 'ChatGPT statistics', exact: true })).toContainText('4 correct / 2 incorrect');
  await page.goto('classic');
  await page.getByTestId('answer').filter({ hasText: 'ChatGPT' }).click();
  await page.locator('footer').getByRole('link', { name: 'Stats', exact: true }).click();
  await expect(page.getByTestId('stat-guesses')).toContainText('7');
  await expect(page.getByTestId('stat-correct')).toContainText('5');
  const stats = await page.evaluate(() => JSON.parse(localStorage.getItem('stats')!));
  expect(stats.models.ChatGPT.correctImages).toHaveLength(1);
  expect(stats.models['Meta AI']).toEqual({
    correct: 0, incorrect: 0, total: 0, correctImages: [],
  });
});

[true, false].forEach((reads) => {
  test(`blocked stats ${reads ? 'reads and writes' : 'writes'} preserve session totals and allow clearing`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript((blockReads) => {
      const get = Storage.prototype.getItem;
      const set = Storage.prototype.setItem;
      const remove = Storage.prototype.removeItem;
      Storage.prototype.getItem = function getItem(key) {
        if (key === 'stats' && blockReads) throw new DOMException('Blocked', 'SecurityError');
        return get.call(this, key);
      };
      Storage.prototype.setItem = function setItem(key, value) {
        if (key === 'stats') throw new DOMException('Full', 'QuotaExceededError');
        set.call(this, key, value);
      };
      Storage.prototype.removeItem = function removeItem(key) {
        if (key === 'stats') throw new DOMException('Blocked', 'SecurityError');
        remove.call(this, key);
      };
    }, reads);
    await gotoStable(page, '/classic');
    await page.getByTestId('answer').first().click();
    await page.clock.runFor(LOCK_IN_MS);
    await expect(page.getByTestId('answer').first()).toHaveClass(/mil-answer-correct/);
    await page.locator('footer').getByRole('link', { name: 'Stats', exact: true }).click();
    await expect(page.getByTestId('stat-guesses')).toContainText('1');
    await expect(page.getByTestId('stat-accuracy')).toContainText('100%');
    await page.locator('footer').getByRole('link', { name: 'Home', exact: true }).click();
    await page.getByRole('link', { name: 'Quiz', exact: true }).click();
    await page.getByTestId('answer').last().click();
    await page.locator('footer').getByRole('link', { name: 'Stats', exact: true }).click();
    await expect(page.getByTestId('stat-guesses')).toContainText('2');
    await expect(page.getByTestId('stat-accuracy')).toContainText('50%');
    await page.getByRole('button', { name: 'Clear stats', exact: true }).click();
    await expect(page.getByTestId('stat-guesses')).toContainText('0');
    expect(errors).toEqual([]);
  });
});
