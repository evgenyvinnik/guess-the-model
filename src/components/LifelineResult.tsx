import { useEffect, type ReactElement } from 'react';
import type { AudienceVote, FriendAdvice } from '../lifelines.ts';

export type LifelineResult =
  | { kind: 'audience'; votes: AudienceVote[] }
  | { kind: 'friend'; advice: FriendAdvice };

type LifelineResultProps = {
  result: LifelineResult;
  onClose: () => void;
};

function AudienceChart({ votes }: { votes: AudienceVote[] }): ReactElement {
  const tallest = Math.max(...votes.map((vote) => vote.percent), 1);

  return (
    <div className="flex items-end justify-center gap-5">
      {votes.map(({ option, percent }) => (
        <div key={option} className="flex w-16 flex-col items-center justify-end gap-1">
          <span className="text-sm font-bold text-amber-300">
            {percent}
            %
          </span>
          {/* Pixel heights keep the bars honest inside an auto-height column. */}
          <div
            className="w-full rounded-t bg-gradient-to-t from-sky-700 to-sky-300"
            style={{ height: `${Math.max((percent / tallest) * 140, 6)}px` }}
          />
          <span className="w-full truncate text-center text-xs text-white">{option}</span>
        </div>
      ))}
    </div>
  );
}

function LifelineResultPanel({ result, onClose }: LifelineResultProps): ReactElement {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="mil-enter mil-panel w-full max-w-lg rounded-xl p-6 text-white">
        {result.kind === 'audience' ? (
          <>
            <h3 className="mb-4 text-center text-xl font-bold uppercase tracking-wide">
              Ask the Audience
            </h3>
            <AudienceChart votes={result.votes} />
          </>
        ) : (
          <>
            <h3 className="mb-4 text-center text-xl font-bold uppercase tracking-wide">
              Phone a Friend
            </h3>
            <p className="text-center text-lg">
              &ldquo;I&rsquo;m
              {' '}
              {result.advice.confidence === 'guessing' ? 'really just' : ''}
              {' '}
              {result.advice.confidence}
              {' '}
              it&rsquo;s
              {' '}
              <span className="font-bold text-amber-300">{result.advice.option}</span>
              .&rdquo;
            </p>
          </>
        )}
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={onClose} className="millionaire-button px-8 py-2 text-sm">
            Back to the question
          </button>
        </div>
      </div>
    </div>
  );
}

export default LifelineResultPanel;
