export const moneyLadder = [
  100,
  200,
  300,
  500,
  1000,
  2000,
  4000,
  8000,
  16000,
  32000,
  64000,
  125000,
  250000,
  500000,
  1000000,
];

/** One-based rungs that bank the prize, exactly as on the show. */
export const safeHavens = [5, 10, 15];

export function formatPrize(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

/** Money banked after answering `cleared` questions correctly and then losing. */
export function guaranteedPrize(cleared: number): number {
  const reached = safeHavens.filter((level) => cleared >= level);
  if (reached.length === 0) return 0;
  return moneyLadder[reached[reached.length - 1] - 1];
}

/** Money taken home by walking away after `cleared` correct answers. */
export function walkAwayPrize(cleared: number): number {
  if (cleared <= 0) return 0;
  return moneyLadder[Math.min(cleared, moneyLadder.length) - 1];
}

export default moneyLadder;
