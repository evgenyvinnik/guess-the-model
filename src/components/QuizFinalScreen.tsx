import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import FinalScreen from './FinalScreen.tsx';

type QuizFinalScreenProps = {
  correct: number;
  total: number;
  onRestart: () => void;
};

function rankFor(correct: number, total: number): string {
  if (correct === total) return 'eagle eye';
  if (correct >= 15) return 'AI connoisseur';
  if (correct >= 10) return 'Ah, I have heard about that aye thing!';
  if (correct < 5) return 'I swear this looks real!';
  return 'Keep practicing!';
}

function QuizFinalScreen({ correct, total, onRestart }: QuizFinalScreenProps): ReactElement {
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <FinalScreen celebrate={correct >= total / 2}>
      <h2 className="text-2xl font-bold uppercase tracking-wide text-amber-300 sm:text-3xl">
        Quiz complete
      </h2>
      <p className="text-4xl font-bold sm:text-5xl">
        {correct}
        {' / '}
        {total}
      </p>
      <p className="text-sm uppercase tracking-widest text-sky-200">
        {percent}
        % correct
      </p>
      <p className="text-lg">
        Rank:
        {' '}
        <span className="font-bold text-amber-300">{rankFor(correct, total)}</span>
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onRestart} className="millionaire-button px-6 py-2">
          Play again
        </button>
        <Link to="/" className="millionaire-button px-6 py-2">
          Home
        </Link>
      </div>
    </FinalScreen>
  );
}

export default QuizFinalScreen;
