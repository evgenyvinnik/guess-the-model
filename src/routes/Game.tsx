import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { imageUrl, type QuestionEntry } from '../questions.ts';
import { createImageRound, type QuestionFormat } from '../imageRounds.ts';
import { recordSeenImages } from '../imageHistory.ts';
import moneyLadder, {
  formatPrize,
  guaranteedPrize,
  walkAwayPrize,
} from '../moneyLadder.ts';
import MoneyLadder from '../components/MoneyLadder.tsx';
import QuestionPanel from '../components/QuestionPanel.tsx';
import ArtworkFrame from '../components/ArtworkFrame.tsx';
import ComparisonArtwork from '../components/ComparisonArtwork.tsx';
import GenerationReview from '../components/GenerationReview.tsx';
import Lifelines from '../components/Lifelines.tsx';
import LifelineResultPanel, { type LifelineResult } from '../components/LifelineResult.tsx';
import {
  audienceVotes,
  fiftyFiftyRemovals,
  friendAdvice,
  noLifelinesUsed,
  Lifeline,
  type LifelineUsage,
} from '../lifelines.ts';
import { recordGuess } from '../stats.ts';
import playSound, {
  Bgm,
  bgmForLevel,
  playMusic,
  Sfx,
} from '../audio.ts';

import ClassicFinalScreen, { type ClassicOutcome } from '../components/ClassicFinalScreen.tsx';
import QuizFinalScreen from '../components/QuizFinalScreen.tsx';

/** Beat between locking an answer in and the host revealing it. */
const LOCK_IN_MS = 1200;
/** How long the reveal stays on screen before the next question. */
const REVEAL_MS = 1600;

const QUIZ_QUESTIONS = 20;

type GameProps = {
  mode: 'classic' | 'quiz';
};

type Phase = 'answering' | 'locked' | 'revealing';

function GameSession({ mode, format }: GameProps & { format: QuestionFormat }): ReactElement {
  const totalQuestions = mode === 'classic' ? moneyLadder.length : QUIZ_QUESTIONS;

  const [round, setRound] = useState(() => createImageRound(format));
  const recordedRound = useRef<typeof round | null>(null);
  useEffect(() => {
    // Rendering may be retried in Strict Mode; only committed rounds count as seen.
    if (recordedRound.current !== round) {
      recordSeenImages(round.images);
      recordedRound.current = round;
    }
  }, [round]);
  const { target: currentQuestion, options, answer: correctAnswer } = round;
  const isComparison = round.format === 'comparison';
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selected, setSelected] = useState<string | null>(null);
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [lifelinesUsed, setLifelinesUsed] = useState<LifelineUsage>(noLifelinesUsed);
  const [lifelineResult, setLifelineResult] = useState<LifelineResult | null>(null);
  const [finished, setFinished] = useState(false);
  const [outcome, setOutcome] = useState<ClassicOutcome>('lost');
  const [prize, setPrize] = useState(0);
  const [revealedImages, setRevealedImages] = useState<QuestionEntry[]>([]);

  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    timers.current.push(window.setTimeout(fn, delay));
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  // Tension music follows the ladder; the menu theme returns on the way out.
  useEffect(() => {
    const level = mode === 'classic'
      ? questionIndex + 1
      : Math.ceil(((questionIndex + 1) / totalQuestions) * moneyLadder.length);
    playMusic(bgmForLevel(level));
  }, [mode, questionIndex, totalQuestions]);

  useEffect(() => () => { playMusic(Bgm.Theme); }, []);

  const nextQuestion = useCallback(() => {
    setRound(createImageRound(format));
    setQuestionIndex((prev) => prev + 1);
    setSelected(null);
    setEliminated([]);
    setPhase('answering');
  }, [format]);

  const resetGame = () => {
    clearTimers();
    setRound(createImageRound(format));
    setQuestionIndex(0);
    setCorrect(0);
    setSelected(null);
    setEliminated([]);
    setLifelinesUsed(noLifelinesUsed);
    setLifelineResult(null);
    setPhase('answering');
    setFinished(false);
    setPrize(0);
    setRevealedImages([]);
  };

  const finishClassic = (result: ClassicOutcome, amount: number) => {
    setOutcome(result);
    setPrize(amount);
    setFinished(true);
    if (result === 'won') {
      playSound(Sfx.Winner);
    }
  };

  const handleAnswer = (answer: string) => {
    if (phase !== 'answering' || eliminated.includes(answer)) return;

    const isCorrect = answer === correctAnswer;
    recordGuess(currentQuestion.modelName, isCorrect, currentQuestion.image, mode);
    setSelected(answer);
    setPhase('locked');
    playSound(Sfx.LockIn);

    schedule(() => {
      setPhase('revealing');
      playSound(isCorrect ? Sfx.Right : Sfx.Wrong);
    }, LOCK_IN_MS);

    schedule(() => {
      setRevealedImages((previous) => {
        const known = new Set(previous.map(({ image }) => image));
        return [...previous, ...round.images.filter(({ image }) => !known.has(image))];
      });
      const cleared = isCorrect ? questionIndex + 1 : questionIndex;
      if (isCorrect) {
        setCorrect((prev) => prev + 1);
      }

      if (mode === 'classic') {
        if (!isCorrect) {
          finishClassic('lost', guaranteedPrize(cleared));
          return;
        }
        if (cleared === moneyLadder.length) {
          finishClassic('won', moneyLadder[moneyLadder.length - 1]);
          return;
        }
      } else if (questionIndex + 1 === totalQuestions) {
        setFinished(true);
        return;
      }

      nextQuestion();
    }, LOCK_IN_MS + REVEAL_MS);
  };

  const handleWalkAway = () => {
    if (phase !== 'answering') return;
    playSound(Sfx.Click);
    finishClassic('walked', walkAwayPrize(questionIndex));
  };

  const handleLifeline = (lifeline: Lifeline) => {
    if (phase !== 'answering' || lifelinesUsed[lifeline]) return;
    playSound(Sfx.Click);
    setLifelinesUsed((prev) => ({ ...prev, [lifeline]: true }));

    const answer = correctAnswer;
    const inPlay = options.filter((option) => !eliminated.includes(option));
    const level = questionIndex + 1;

    if (lifeline === Lifeline.FiftyFifty) {
      setEliminated(fiftyFiftyRemovals(options, answer));
      return;
    }
    if (lifeline === Lifeline.AskTheAudience) {
      setLifelineResult({ kind: 'audience', votes: audienceVotes(inPlay, answer, level) });
      return;
    }
    setLifelineResult({ kind: 'friend', advice: friendAdvice(inPlay, answer, level) });
  };

  if (finished) {
    return (
      <div className="m-auto w-full">
        {mode === 'classic'
          ? <ClassicFinalScreen outcome={outcome} prize={prize} onRestart={resetGame} />
          : <QuizFinalScreen correct={correct} total={totalQuestions} onRestart={resetGame} />}
        <GenerationReview images={revealedImages} />
      </div>
    );
  }

  const revealedAnswer = phase === 'revealing' ? correctAnswer : null;
  const currentPrize = mode === 'classic' ? moneyLadder[questionIndex] : 0;

  return (
    <div className={`mil-game text-white${isComparison ? ' mil-game-comparison' : ''}`}>
      <div className="mil-game-board">
        <div className="mil-stage">
          <div className="mil-stage-main">
            <div className="mil-game-toolbar">
              {mode === 'classic' ? (
                <Lifelines
                  used={lifelinesUsed}
                  disabled={phase !== 'answering'}
                  onUse={handleLifeline}
                />
              ) : (
                <>
                  <p className="text-sm uppercase tracking-widest text-sky-200">
                    Question
                    {' '}
                    {questionIndex + 1}
                    {' '}
                    of
                    {' '}
                    {totalQuestions}
                  </p>
                  <p className="text-sm uppercase tracking-widest text-sky-200">
                    Score
                    {' '}
                    <span className="font-bold text-amber-300">{correct}</span>
                  </p>
                </>
              )}

              {mode === 'classic' && (
                <div className="flex items-center gap-3">
                  <p className="text-right text-sm uppercase tracking-widest text-sky-200">
                    <span className="block text-xs opacity-70">
                      Question
                      {' '}
                      {questionIndex + 1}
                      {' '}
                      for
                    </span>
                    <span className="text-lg font-bold text-amber-300">
                      {formatPrize(currentPrize)}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={handleWalkAway}
                    disabled={phase !== 'answering'}
                    className="millionaire-button px-5 py-2 text-xs disabled:opacity-50"
                  >
                    Walk away
                  </button>
                </div>
              )}
            </div>

            {mode === 'classic' && (
              <details className="w-full max-w-xs lg:hidden">
                <summary className="cursor-pointer text-center text-xs uppercase tracking-widest text-sky-200">
                  Prize ladder
                </summary>
                <MoneyLadder current={questionIndex} className="mx-auto mt-2 w-full" />
              </details>
            )}

            {isComparison ? (
              <ComparisonArtwork
                key={questionIndex}
                images={round.images}
                options={options}
                selected={selected}
                revealedAnswer={revealedAnswer}
                eliminated={eliminated}
              />
            ) : (
              <ArtworkFrame
                src={imageUrl(currentQuestion.modelName, currentQuestion.image)}
                prompt={currentQuestion.prompt}
                revealedEntry={revealedAnswer === null ? undefined : currentQuestion}
              />
            )}
          </div>

          {mode === 'classic' && (
            <MoneyLadder current={questionIndex} className="hidden lg:flex" />
          )}
        </div>

        <QuestionPanel
          question={isComparison
            ? `Which image was generated by ${currentQuestion.modelName}?`
            : 'Which model generated this image?'}
          options={options}
          selected={selected}
          revealedAnswer={revealedAnswer}
          eliminated={eliminated}
          locked={phase !== 'answering'}
          onAnswer={handleAnswer}
        />
        <GenerationReview images={revealedImages} />
      </div>

      {lifelineResult && (
        <LifelineResultPanel
          result={lifelineResult}
          onClose={() => setLifelineResult(null)}
        />
      )}
    </div>
  );
}

function Game({ mode }: GameProps): ReactElement {
  const [searchParams] = useSearchParams();
  const format = searchParams.get('format') === 'comparison' ? 'comparison' : 'single';
  return <GameSession key={`${mode}-${format}`} mode={mode} format={format} />;
}

export default Game;
