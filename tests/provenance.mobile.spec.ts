import { expect, test } from '@playwright/test';
import { gotoStable, LOCK_IN_MS, REVEAL_MS } from './helpers.ts';

test('mobile version captions and answered-image review fit the viewport', async ({ page }) => {
  await gotoStable(page, '/classic?format=comparison');
  await page.getByTestId('answer').first().click();
  await page.clock.runFor(LOCK_IN_MS);
  const captions = page.locator('.mil-comparison-caption');
  await expect(captions).toHaveCount(4);
  expect(await captions.evaluateAll((elements) => elements.every(
    (element) => element.scrollWidth <= element.clientWidth,
  ))).toBe(true);
  await page.clock.runFor(REVEAL_MS);
  await page.locator('.mil-generation-review > summary').click();
  await expect(page.getByTestId('generation-details')).toHaveCount(4);
  const review = page.locator('.mil-generation-review');
  const answerBounds = await page.getByTestId('answer').last().boundingBox();
  const reviewBounds = await review.boundingBox();
  expect(reviewBounds!.y).toBeGreaterThanOrEqual(answerBounds!.y + answerBounds!.height);
  expect(reviewBounds!.width).toBeGreaterThan(340);
  expect(await page.getByTestId('generation-details').evaluateAll((elements) => elements.every(
    (element) => element.scrollWidth <= element.clientWidth,
  ))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByTestId('generation-details').first().scrollIntoViewIfNeeded();
  await expect(page.getByTestId('generation-details').first()).toBeInViewport();
  await page.screenshot({ path: 'test-results/provenance-review-mobile.png', fullPage: true });
});
