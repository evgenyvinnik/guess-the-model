import { useState, type ReactElement } from 'react';
import { questions, ModelName, type QuestionEntry } from '../questions.ts';
import moneyLadder from '../moneyLadder.ts';
import MoneyLadder from '../components/MoneyLadder.tsx';
import { recordGuess } from '../stats.ts';

import ClassicFinalScreen from '../components/ClassicFinalScreen.tsx';
import QuizFinalScreen from '../components/QuizFinalScreen.tsx';


type GameProps = {
  mode: 'classic' | 'quiz';
};

function getRandomQuestion(): QuestionEntry {
  const entries = Object.values(questions);
  const index = Math.floor(Math.random() * entries.length);
  return entries[index];
}

function Game({ mode }: GameProps): ReactElement {
  const totalQuestions = mode === 'classic' ? moneyLadder.length : 20;
  const getQuestionWithOptions = () => {
    const question = getRandomQuestion();
    const allModels = Object.values(ModelName);
    const otherModels = allModels.filter((m) => m !== question.modelName);
    const shuffled = [...otherModels]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...shuffled, question.modelName].sort(
      () => Math.random() - 0.5,
    );
    return { question, options };
  };
  const [{ question: currentQuestion, options }, setQA] = useState(getQuestionWithOptions);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const resetGame = () => {
    setQA(getQuestionWithOptions());
    setQuestionIndex(0);
    setCorrect(0);
    setFinished(false);
  };

  const handleAnswer = (answer: ModelName) => {
    const isCorrect = answer === currentQuestion.modelName;
    recordGuess(currentQuestion.modelName, isCorrect, currentQuestion.image, mode);

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
    setQA(getQuestionWithOptions());
  };

  if (finished) {
    if (mode === 'classic') {
      return (
        <ClassicFinalScreen correct={correct} onRestart={resetGame} />
      );
    }
    return (
      <QuizFinalScreen
        correct={correct}
        total={totalQuestions}
        onRestart={resetGame}
      />
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 text-white">
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
              <button
                key={opt}
                type="button"
                onClick={() => handleAnswer(opt)}
                className="millionaire-button px-6 py-2"
              >
                {opt}
              </button>
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
