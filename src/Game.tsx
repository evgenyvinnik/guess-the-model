import { useState } from 'react';
import SvgButton from './SvgButton.tsx';
import { questions, ModelName } from './questions.ts';
import moneyLadder from './moneyLadder.ts';
import MoneyLadder from './MoneyLadder.tsx';

type GameProps = {
  mode: 'classic' | 'quiz';
};

function getRandomQuestion() {
  const entries = Object.values(questions);
  const index = Math.floor(Math.random() * entries.length);
  return entries[index];
}

function Game({ mode }: GameProps) {
  const totalQuestions = mode === 'classic' ? moneyLadder.length : 20;
  const [currentQuestion, setCurrentQuestion] = useState(getRandomQuestion());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const resetGame = () => {
    setCurrentQuestion(getRandomQuestion());
    setQuestionIndex(0);
    setCorrect(0);
    setFinished(false);
  };

  const handleAnswer = (answer: ModelName) => {
    const isCorrect = answer === currentQuestion.modelName;
    if (isCorrect) {
      setCorrect((prev) => prev + 1);
    }

    const nextIndex = questionIndex + 1;

    if (mode === 'classic') {
      if (!isCorrect) {
        setFinished(true);
        return;
      }
      if (nextIndex === moneyLadder.length) {
        setFinished(true);
        return;
      }
    } else if (mode === 'quiz') {
      if (nextIndex === totalQuestions) {
        setFinished(true);
        return;
      }
    }

    setQuestionIndex(nextIndex);
    setCurrentQuestion(getRandomQuestion());
  };

  if (finished) {
    if (mode === 'classic') {
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
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
          <p className="text-xl">{message}</p>
          <button type="button" onClick={resetGame} className="rounded bg-blue-600 px-4 py-2">Play Again</button>
        </div>
      );
    }
    const rank = (() => {
      if (correct === 20) return 'eagle eye';
      if (correct >= 15) return 'AI connoisseur';
      if (correct >= 10) return 'Ah, I have heard about that aye thing!';
      if (correct < 5) return 'I swear this looks real!';
      return 'Keep practicing!';
    })();
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
        <p className="text-xl">You scored {correct} out of {totalQuestions}</p>
        <p className="text-lg">Rank: {rank}</p>
        <button type="button" onClick={resetGame} className="rounded bg-blue-600 px-4 py-2">Play Again</button>
      </div>
    );
  }

  const options = Object.values(ModelName);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 text-white">
      <div className="flex w-full max-w-5xl items-start gap-6">
        <div className="flex flex-1 flex-col items-center gap-4">
          <p className="text-lg">
            Question
            {' '}
            {questionIndex + 1}
            {' '}
            of
            {' '}
            {totalQuestions}
          </p>
          {mode === 'classic' && (
            <p className="text-md">
              Prize:
              {' $'}
              {moneyLadder[questionIndex]}
            </p>
          )}
          <p className="max-w-xl text-center text-xl">{currentQuestion.prompt}</p>
          <div className="grid grid-cols-2 gap-4">
            {options.map((opt) => (
              <SvgButton
                key={opt}
                label={opt}
                width={340}
                onClick={() => handleAnswer(opt)}
              />
            ))}
          </div>
        </div>
        {mode === 'classic' && (
          <MoneyLadder current={questionIndex} />
        )}
      </div>
    </div>
  );
}

export default Game;
