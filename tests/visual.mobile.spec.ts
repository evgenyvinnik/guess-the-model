import { expect, test } from '@playwright/test';
import { gotoStable, LOCK_IN_MS, waitForArtwork } from './helpers.ts';

test.describe('Screenshots: mobile', () => {
  test('title screen', async ({ page }) => {
    await gotoStable(page, '/');
    await expect(page.getByRole('link', { name: 'Classic' })).toBeVisible();
    await expect(page).toHaveScreenshot('home.png');
  });

  test('classic board', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await expect(page).toHaveScreenshot('classic-board.png');
  });

  test('expanded prize ladder', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByText('Prize ladder').click();
    // Both ladders are in the DOM; only the collapsible one is on screen here.
    await expect(page.getByRole('group').getByText('$1,000,000')).toBeVisible();
    await expect(page).toHaveScreenshot('classic-ladder.png');
  });

  test('answer revealed', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('answer').first().click();
    await page.clock.runFor(LOCK_IN_MS);
    await expect(page).toHaveScreenshot('classic-revealed.png');
  });

  test('quiz board', async ({ page }) => {
    await gotoStable(page, '/quiz');
    await waitForArtwork(page);
    await expect(page).toHaveScreenshot('quiz-board.png');
  });
});
