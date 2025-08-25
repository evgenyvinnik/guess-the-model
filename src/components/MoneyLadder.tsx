import type { ReactElement } from 'react';
import moneyLadder from '../moneyLadder.ts';

type MoneyLadderProps = {
  current: number; // zero-based index of current question
};

function MoneyLadder({ current }: MoneyLadderProps): ReactElement {
  const ladderDesc = [...moneyLadder].reverse();

  return (
    <ol className="bg-[#0b1444] rounded-lg p-2 text-white text-sm">
      {ladderDesc.map((amount, idx) => {
        const level = ladderDesc.length - idx; // 15..1
        const isActive = level === current + 1; // current is zero-based
        const isMilestone = level === 5 || level === 10 || level === 15;
        return (
          <li
            key={level}
            className={`relative flex items-center justify-end gap-2 px-2 py-1 ${
              isActive
                ? 'bg-gradient-to-r from-amber-500 to-amber-300 text-black font-bold'
                : ''
            } ${!isActive && isMilestone ? 'text-amber-400 font-semibold' : ''}`}
          >
            <span className="w-4 text-right">{level}</span>
            <span className="text-xs">•</span>
            <span className="w-24 text-right">
              $
              {amount.toLocaleString()}
            </span>
            {isActive && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-y-[8px] border-l-[12px] border-y-transparent border-l-amber-300" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default MoneyLadder;
