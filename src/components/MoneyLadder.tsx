import type { ReactElement } from 'react';
import moneyLadder, { formatPrize, safeHavens } from '../moneyLadder.ts';

type MoneyLadderProps = {
  /** Zero-based index of the question being played. */
  current: number;
  className?: string;
};

function MoneyLadder({ current, className = '' }: MoneyLadderProps): ReactElement {
  const levels = moneyLadder.map((amount, index) => ({ amount, level: index + 1 })).reverse();

  return (
    <ol
      aria-label="Prize ladder"
      className={`mil-ladder ${className}`}
    >
      {levels.map(({ amount, level }) => {
        const isCurrent = level === current + 1;
        const isWon = level <= current;
        const isSafe = safeHavens.includes(level);
        const classes = [
          'mil-rung',
          isSafe ? 'mil-rung-safe' : '',
          isWon ? 'mil-rung-won' : '',
          isCurrent ? 'mil-rung-current' : '',
        ].filter(Boolean).join(' ');

        return (
          <li key={level} className={classes} aria-current={isCurrent ? 'step' : undefined}>
            <span className="w-5 text-right tabular-nums opacity-80">{level}</span>
            <span className="mil-rung-marker" aria-hidden="true" />
            <span className="flex-1 text-right">{formatPrize(amount)}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default MoneyLadder;
