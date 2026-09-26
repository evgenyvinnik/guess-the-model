import { expect, test } from '@playwright/test';
import { activeGeneratedImages } from '../src/data/generatedImages.ts';
import { generationDate, versionLabel } from '../src/imageProvenance.ts';
import {
  gotoStable, LOCK_IN_MS, REVEAL_MS, storageWithOnlyUnseen,
} from './helpers.ts';

test('version labels preserve uncertainty and generation dates do not shift with the viewer timezone', () => {
  const provenance = { generator: 'Test generator', source: 'Test observation', generatedAt: '2026-09-19' };
  expect(versionLabel(provenance)).toBe('Version not disclosed');
  expect(versionLabel({
    ...provenance,
    modelVersion: { label: 'Example Image 3', certainty: 'expected', basis: 'Dated release note, exact backend unverified.' },
  })).toBe('Example Image 3 (expected)');
  expect(versionLabel({
    ...provenance,
    modelVersion: { label: 'Example Image 3', certainty: 'confirmed', basis: 'Selected in the generator.' },
  })).toBe('Example Image 3');
  expect(versionLabel(undefined)).toBe('Version not disclosed');
  expect(generationDate(provenance)).toBe('Sep 19, 2026');
  expect(generationDate(undefined)).toBe('Date not recorded');
});

test('single-image version is hidden through lock-in and remains reviewable after a wrong answer', async ({ page }) => {
  await gotoStable(page, '/classic');
  await expect(page.getByTestId('generation-label')).toHaveCount(0);
  await expect(page.locator('.mil-generation-review')).toHaveCount(0);
  await page.getByTestId('answer').last().click();
  await expect(page.getByTestId('generation-label')).toHaveCount(0);
  await page.clock.runFor(LOCK_IN_MS);
  const label = page.getByTestId('generation-label');
  await expect(label).toContainText('ChatGPT');
  await expect(label).toContainText('GPT Image 2.0');
  await expect(label).toContainText('Sep 12, 2026');
  await page.clock.runFor(REVEAL_MS);
  await page.locator('.mil-generation-review > summary').click();
  await expect(page.getByTestId('generation-details')).toContainText('GPT Image 2.0');
  await expect(page.getByTestId('generation-details')).toContainText('Content Credentials');
  await expect(page.locator('.mil-generation-review-card')).toHaveCount(1);
});

test('new unversioned outputs do not inherit the older ChatGPT version', async ({ page }) => {
  const entry = activeGeneratedImages.find(
    ({ id }) => id === 'chatgpt-challenge-2026-09-19-seventeen-candles',
  )!;
  await gotoStable(page, '/classic', {
    storage: storageWithOnlyUnseen(entry), artwork: 'real',
  });
  await expect(page.getByTestId('generation-label')).toHaveCount(0);
  await page.getByTestId('answer').filter({ hasText: 'ChatGPT' }).click();
  await page.clock.runFor(LOCK_IN_MS);
  await expect(page.getByTestId('generation-label')).toContainText('gpt-image · Version not disclosed');
  await expect(page.getByTestId('generation-label')).toContainText('Sep 19, 2026');
  await expect(page.getByTestId('generation-label')).not.toContainText('2.0');
  await expect(page.locator('.mil-artwork-image')).toHaveJSProperty('naturalWidth', 1254);
});

test('comparison reveals each original version and reviews only the answered round', async ({ page }) => {
  await gotoStable(page, '/classic?format=comparison');
  const board = page.getByTestId('comparison-artwork');
  await expect(board.getByTestId('generation-label')).toHaveCount(0);
  await page.getByRole('button', { name: 'Enlarge image A', exact: true }).click();
  await expect(page.getByTestId('image-preview').getByTestId('generation-label')).toHaveCount(0);
  await page.getByRole('button', { name: 'Close image preview' }).click();
  await page.getByTestId('answer').first().click();
  await expect(board.getByTestId('generation-label')).toHaveCount(0);
  await page.clock.runFor(LOCK_IN_MS);
  await expect(board.locator('.mil-comparison-caption').getByTestId('generation-label')).toHaveCount(4);
  await expect(board).toContainText('Firefly Image 5');
  await expect(board).toContainText('Nano Banana 2');
  await page.clock.runFor(REVEAL_MS);
  await expect(board.getByTestId('generation-label')).toHaveCount(0);
  await page.locator('.mil-generation-review > summary').click();
  await expect(page.getByTestId('generation-details')).toHaveCount(4);
  await expect(page.locator('.mil-generation-review')).toContainText('Firefly Image 5');
  await expect(page.locator('.mil-generation-review')).toContainText('Instant');
  await expect(page.locator('.mil-generation-review')).toContainText('Version not disclosed');
  await page.getByRole('button', { name: 'Walk away' }).click();
  await page.getByRole('button', { name: 'Play again' }).click();
  await expect(page.locator('.mil-generation-review')).toHaveCount(0);
});

test('saved statistics expose per-image version details with keyboard dismissal and focus return', async ({ page }) => {
  const entry = activeGeneratedImages.find(({ modelName }) => modelName === 'Gemini')!;
  await gotoStable(page, '/classic', { storage: storageWithOnlyUnseen(entry) });
  await page.getByTestId('answer').filter({ hasText: 'Gemini' }).click();
  await page.clock.runFor(LOCK_IN_MS);
  await page.locator('footer').getByRole('link', { name: 'Stats' }).click();
  await page.reload();
  const trigger = page.getByRole('button', { name: 'View Gemini image details' });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Image generation details' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Nano Banana 2');
  await expect(dialog).toContainText('Confirmed label');
  await expect(dialog).toContainText('Sep 12, 2026');
  await expect(dialog).toContainText(entry.prompt);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});
