import type { ReactElement, ReactNode } from 'react';
import BroadcastFrame from './BroadcastFrame.tsx';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

type QuestionPanelProps = {
  question: ReactNode;
  options: string[];
  /** Answer the contestant locked in, if any. */
  selected: string | null;
  /** Set only once the answer is being revealed, so it stays hidden until then. */
  revealedAnswer: string | null;
  /** Options taken off the board by the 50:50 lifeline. */
  eliminated: string[];
  locked: boolean;
  onAnswer: (option: string) => void;
};

function QuestionPanel({
  question,
  options,
  selected,
  revealedAnswer,
  eliminated,
  locked,
  onAnswer,
}: QuestionPanelProps): ReactElement {
  return (
    <div className="mil-question-panel">
      <div className="mil-rail mil-question-rail">
        <div className="mil-plate mil-plate-question">
          <BroadcastFrame variant="question" />
          <div className="mil-plate-inner">
            <h2>
              {question}
            </h2>
          </div>
        </div>
      </div>

      <div className="mil-answers">
        {options.map((option, index) => {
          const isEliminated = eliminated.includes(option);
          const isSelected = selected === option;
          const isCorrect = revealedAnswer === option;
          const classes = [
            'mil-plate',
            'mil-answer',
            isSelected && !isCorrect ? 'mil-answer-selected' : '',
            isCorrect ? 'mil-answer-correct' : '',
            isEliminated ? 'mil-answer-eliminated' : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={option} className="mil-rail">
              <button
                type="button"
                data-testid="answer"
                aria-label={`${LETTERS[index]}: ${option}`}
                disabled={locked || isEliminated}
                onClick={() => onAnswer(option)}
                className={classes}
              >
                <BroadcastFrame variant="answer" />
                <span className="mil-plate-inner">
                  <span className="mil-diamond" aria-hidden="true" />
                  <span className="mil-answer-letter">
                    {LETTERS[index]}
                    :
                  </span>
                  <span className="mil-answer-text">
                    {isEliminated ? '' : option}
                  </span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionPanel;
