import type { ReactElement } from 'react';
import FinalScreen from './FinalScreen.tsx';

type QuizFinalScreenProps = {
  correct: number;
  total: number;
  onRestart: () => void;
};

function QuizFinalScreen({ correct, total, onRestart }: QuizFinalScreenProps): ReactElement {
  const rank = (() => {
    if (correct === 20) return 'eagle eye';
    if (correct >= 15) return 'AI connoisseur';
    if (correct >= 10) return 'Ah, I have heard about that aye thing!';
    if (correct < 5) return 'I swear this looks real!';
    return 'Keep practicing!';
  })();

  return (
    <FinalScreen>
      <p className="text-xl">
        You scored {correct} out of {total}
      </p>
      <p className="text-lg">Rank: {rank}</p>
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

export default QuizFinalScreen;
