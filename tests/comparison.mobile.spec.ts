import { expect, test } from '@playwright/test';
import { activeGeneratedImages } from '../src/data/generatedImages.ts';
import { gotoStable } from './helpers.ts';

test('real comparison images fit mobile and their preview closes with Escape and restores focus', async ({ page }) => {
  await gotoStable(page, '/classic?format=comparison', { artwork: 'real' });
  const board = page.getByTestId('comparison-artwork');
  const images = page.getByTestId('comparison-image');
  await expect(board).toBeVisible();
  await expect(images).toHaveCount(4);
  await Promise.all([0, 1, 2, 3].map((index) => (
    expect(images.nth(index)).toHaveJSProperty('complete', true)
  )));
  const widths = await images.evaluateAll((elements) => (
    elements.map((element) => (element as HTMLImageElement).naturalWidth)
  ));
  widths.forEach((width) => expect(width).toBeGreaterThan(0));
  const bounds = await page.locator('main').evaluate((element) => ({
    width: element.clientWidth,
    contentWidth: element.scrollWidth,
  }));
  expect(bounds.contentWidth).toBeLessThanOrEqual(bounds.width);
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(documentWidth).toBe(page.viewportSize()?.width);
  await expect(page.getByTestId('answer').last()).toBeInViewport({ ratio: 1 });
  await expect(page).toHaveScreenshot('comparison-classic-board.png');

  const source = await images.first().getAttribute('src');
  const entry = activeGeneratedImages.find(({ image }) => (
    source ? decodeURIComponent(source).endsWith(image) : false
  ));
  expect(entry).toBeDefined();
  const trigger = board.getByRole('button', { name: 'Enlarge image A' });
  await trigger.focus();
  await trigger.press('Enter');
  const dialog = page.getByTestId('image-preview');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty('open', true);
  await expect(dialog.getByRole('button', { name: 'Close image preview' })).toBeFocused();
  const preview = dialog.getByRole('img', { name: 'Image A', exact: true });
  await expect(preview).toHaveAttribute('src', source ?? '');
  await expect(preview).toHaveJSProperty('complete', true);
  if (entry) await expect(dialog).not.toContainText(entry.modelName);
  await expect(page).toHaveScreenshot('comparison-image-preview.png');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await expect(page.getByTestId('answer').first()).toBeEnabled();
});
