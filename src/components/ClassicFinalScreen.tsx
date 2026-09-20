import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import { formatPrize } from '../moneyLadder.ts';
import FinalScreen from './FinalScreen.tsx';

export type ClassicOutcome = 'won' | 'lost' | 'walked';

type ClassicFinalScreenProps = {
  outcome: ClassicOutcome;
  prize: number;
  onRestart: () => void;
};

const HEADLINES: Record<ClassicOutcome, string> = {
  won: 'You are a millionaire!',
  lost: 'That is the wrong answer',
  walked: 'You walked away',
};

function ClassicFinalScreen({ outcome, prize, onRestart }: ClassicFinalScreenProps): ReactElement {
  return (
    <FinalScreen celebrate={outcome !== 'lost'}>
      <h2 className="text-2xl font-bold uppercase tracking-wide text-amber-300 sm:text-3xl">
        {HEADLINES[outcome]}
      </h2>
      <p className="text-lg">You are going home with</p>
      <p className="text-4xl font-bold text-white sm:text-5xl">{formatPrize(prize)}</p>
      {outcome === 'lost' && prize > 0 && (
        <p className="text-sm text-sky-200">Your last safe haven kept the money.</p>
      )}
      {outcome === 'won' && (
        <p className="text-sm text-sky-200">Fifteen questions, no mistakes. Nicely spotted.</p>
      )}
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

export default ClassicFinalScreen;
