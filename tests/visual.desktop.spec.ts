import { expect, test } from '@playwright/test';
import { activeGeneratedImages } from '../src/data/generatedImages.ts';
import {
  answerCorrectly,
  answerWrong,
  gotoStable,
  LOCK_IN_MS,
  SEEDED_STATS,
  waitForArtwork,
} from './helpers.ts';

test.describe('Screenshots: desktop', () => {
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

  test('answer locked in', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('answer').first().click();
    await expect(page).toHaveScreenshot('classic-locked-in.png');
  });

  test('answer revealed', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('answer').first().click();
    await page.clock.runFor(LOCK_IN_MS);
    await expect(page).toHaveScreenshot('classic-revealed.png');
  });

  test('fifty-fifty removes two answers', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('lifeline-fiftyFifty').click();
    await expect(page.locator('[data-testid="answer"]:disabled')).toHaveCount(2);
    await expect(page).toHaveScreenshot('classic-fifty-fifty.png');
  });

  test('audience poll', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('lifeline-askTheAudience').click();
    await expect(page.getByRole('heading', { name: 'Ask the Audience' })).toBeVisible();
    await expect(page).toHaveScreenshot('lifeline-audience.png');
  });

  test('phone a friend', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('lifeline-phoneAFriend').click();
    await expect(page.getByRole('heading', { name: 'Phone a Friend' })).toBeVisible();
    await expect(page).toHaveScreenshot('lifeline-phone.png');
  });

  test('later rung with a lifeline spent', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await page.getByTestId('lifeline-fiftyFifty').click();
    for (let i = 0; i < 8; i += 1) {
      // Sequential by design: each answer drives the next question.
      // eslint-disable-next-line no-await-in-loop
      await answerCorrectly(page);
    }
    await expect(page.getByText('Question 9 for')).toBeVisible();
    await waitForArtwork(page);
    await expect(page).toHaveScreenshot('classic-rung-nine.png');
  });

  test('millionaire screen', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    for (let i = 0; i < 15; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await answerCorrectly(page);
    }
    await expect(page.getByText('You are a millionaire!')).toBeVisible();
    await expect(page).toHaveScreenshot('final-millionaire.png');
  });

  test('loss banks the safe haven', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    for (let i = 0; i < 5; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await answerCorrectly(page);
    }
    await answerWrong(page);
    await expect(page.getByText('That is the wrong answer')).toBeVisible();
    await expect(page).toHaveScreenshot('final-safe-haven.png');
  });

  test('walk away screen', async ({ page }) => {
    await gotoStable(page, '/classic');
    await waitForArtwork(page);
    await answerCorrectly(page);
    await answerCorrectly(page);
    await page.getByRole('button', { name: 'Walk away' }).click();
    await expect(page.getByText('You walked away')).toBeVisible();
    await expect(page).toHaveScreenshot('final-walked-away.png');
  });

  test('quiz board', async ({ page }) => {
    await gotoStable(page, '/quiz');
    await waitForArtwork(page);
    await expect(page).toHaveScreenshot('quiz-board.png');
  });

  test('artwork falls back to the prompt', async ({ page }) => {
    await gotoStable(page, '/classic', { artwork: false });
    await expect(page.getByText('Which model made it?')).toBeVisible();
    const fallback = page.getByRole('region', { name: 'Image prompt', exact: true });
    await expect(fallback).toContainText(activeGeneratedImages[0].prompt);
    const start = await fallback.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return {
        scrollTop: element.scrollTop,
        firstTop: element.firstElementChild?.getBoundingClientRect().top ?? -Infinity,
        contentTop: bounds.top + element.clientTop
          + Number.parseFloat(getComputedStyle(element).paddingTop),
        isScrollable: element.scrollHeight > element.clientHeight,
      };
    });
    expect(start.scrollTop).toBe(0);
    expect(start.isScrollable).toBe(true);
    expect(start.firstTop).toBeGreaterThanOrEqual(start.contentTop - 1);
    await expect(page).toHaveScreenshot('classic-artwork-missing.png');

    await fallback.focus();
    await fallback.press('End');
    await expect.poll(() => fallback.evaluate((element) => (
      element.scrollHeight - element.clientHeight - element.scrollTop
    ))).toBeLessThanOrEqual(1);
    const end = await fallback.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const conclusion = element.lastElementChild?.getBoundingClientRect();
      return {
        frameTop: bounds.top,
        frameBottom: bounds.bottom,
        conclusionTop: conclusion?.top ?? -Infinity,
        conclusionBottom: conclusion?.bottom ?? Infinity,
      };
    });
    expect(end.conclusionTop).toBeGreaterThanOrEqual(end.frameTop);
    expect(end.conclusionBottom).toBeLessThanOrEqual(end.frameBottom);
    await expect(fallback.getByText('Which model made it?', { exact: true }))
      .toBeInViewport({ ratio: 1 });
  });

  test('about page', async ({ page }) => {
    await gotoStable(page, '/about');
    await expect(page.getByRole('heading', { name: 'The line-up' })).toBeVisible();
    await expect(page).toHaveScreenshot('about.png');
  });

  test('stats page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1100 });
    await gotoStable(page, '/stats', { storage: { stats: SEEDED_STATS } });
    await expect(page.getByText('Accuracy')).toBeVisible();
    await expect(page).toHaveScreenshot('stats.png');
  });
});
