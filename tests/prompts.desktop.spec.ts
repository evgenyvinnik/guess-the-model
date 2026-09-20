import { expect, test } from '@playwright/test';
import { activeGeneratedImages } from '../src/data/generatedImages.ts';
import { gotoStable } from './helpers.ts';

const entry = activeGeneratedImages.find(({ modelName }) => modelName === 'ChatGPT')!;
const storage = {
  stats: JSON.stringify({
    correct: 1,
    incorrect: 0,
    models: {
      [entry.modelName]: { correct: 1, incorrect: 0, correctImages: [entry.image] },
    },
  }),
};

test('hover prompt remains interactive, copies the exact prompt, and dismisses with focus restored', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await gotoStable(page, '/stats', { storage });
  const trigger = page.getByRole('button', { name: 'View ChatGPT image details' });
  await trigger.hover();
  await page.clock.runFor(400);
  const popup = page.getByRole('dialog', { name: 'Image prompt', exact: true });
  await expect(popup.getByTestId('image-prompt-text')).toHaveText(entry.prompt);
  await popup.getByRole('button', { name: 'Copy prompt' }).hover();
  await page.clock.runFor(300);
  await expect(popup).toBeVisible();
  await popup.getByRole('button', { name: 'Copy prompt' }).click();
  await expect(popup.getByRole('status')).toHaveText('Prompt copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(entry.prompt);
  await popup.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(popup).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await page.mouse.move(0, 0);
  await trigger.hover();
  await page.clock.runFor(400);
  await expect(popup).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(popup).toHaveCount(0);
  await trigger.press('Enter');
  const modal = page.getByRole('dialog', { name: 'Image generation details' });
  await expect(modal).toBeVisible();
  await expect(modal.getByTestId('image-prompt-text')).toHaveText(entry.prompt);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});

test('touch opens a readable prompt with copy and close controls', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  await gotoStable(page, `http://localhost:${process.env.PW_PORT ?? 5173}/guess-the-model/stats`, { storage });
  await page.getByRole('button', { name: 'View ChatGPT image details' }).tap();
  const modal = page.getByRole('dialog', { name: 'Image generation details' });
  await expect(modal.getByTestId('image-prompt-text')).toHaveText(entry.prompt);
  await expect(modal.getByRole('button', { name: 'Close', exact: true })).toBeInViewport();
  await expect(modal.getByRole('button', { name: 'Copy prompt' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await modal.getByRole('button', { name: 'Copy prompt' }).tap();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(entry.prompt);
  await page.screenshot({ path: '/tmp/guess-model-prompt-mobile.png' });
  await modal.getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(modal).not.toBeVisible();
  await context.close();
});

test('clipboard failure leaves the full prompt selected for manual copying', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Clipboard unavailable')) },
    });
  });
  await gotoStable(page, '/stats', { storage });
  await page.getByRole('button', { name: 'View ChatGPT image details' }).click();
  const modal = page.getByRole('dialog', { name: 'Image generation details' });
  await modal.getByRole('button', { name: 'Copy prompt' }).click();
  await expect(modal.getByRole('status')).toContainText('Copy is unavailable');
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(entry.prompt);
});
