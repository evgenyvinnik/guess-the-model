import type { ReactElement } from 'react';
import moneyLadder from '../moneyLadder.ts';
import FinalScreen from './FinalScreen.tsx';

type ClassicFinalScreenProps = {
  correct: number;
  onRestart: () => void;
};

function ClassicFinalScreen({ correct, onRestart }: ClassicFinalScreenProps): ReactElement {
  let prize = 0;
  if (correct === moneyLadder.length) {
    prize = moneyLadder[moneyLadder.length - 1];
  } else if (correct > 0) {
    prize = moneyLadder[correct - 1];
  }
  const message = correct === moneyLadder.length
    ? 'Congratulations! You won a million!'
    : `Game over! You won $${prize}`;

  return (
    <FinalScreen>
      <p className="text-xl">{message}</p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded bg-blue-600 px-4 py-2"
      >
        Play Again
      </button>
    </FinalScreen>
  );
}

export default ClassicFinalScreen;
