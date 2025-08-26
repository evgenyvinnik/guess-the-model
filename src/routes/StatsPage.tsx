import {
  useEffect,
  useState,
  useMemo,
  type ReactElement,
} from 'react';
import { getStats, clearStats } from '../stats.ts';
import type { Stats } from '../stats.ts';
import {
  questions,
  ModelName,
  type QuestionEntry,
} from '../questions.ts';

function StatsPage(): ReactElement {
  const [stats, setStats] = useState<Stats>(getStats());

  const imagesByModel = useMemo(() => {
    const grouped: Record<ModelName, string[]> = {
      [ModelName.ChatGPT]: [],
      [ModelName.EMU]: [],
      [ModelName.Gemini]: [],
      [ModelName.Grok]: [],
      [ModelName.Midjourney]: [],
    };
    Object.values(questions).forEach((q: QuestionEntry) => {
      grouped[q.modelName].push(q.image);
    });
    return grouped;
  }, []);

  useEffect(() => {
    const update = () => setStats(getStats());
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center p-4 text-center text-white">
      <h1 className="mb-8 text-4xl">Statistics</h1>
      <div className="mb-8 text-2xl">
        <p>
          Total guesses:
          {' '}
          <span className="font-bold">{stats.total}</span>
        </p>
        <p>
          Correct:
          {' '}
          <span className="font-bold text-green-400">{stats.correct}</span>
        </p>
        <p>
          Incorrect:
          {' '}
          <span className="font-bold text-red-400">{stats.incorrect}</span>
        </p>
      </div>
      <div className="mb-8 flex w-full flex-col gap-8 md:flex-row">
        <div className="flex-1">
          <h2 className="mb-2 text-2xl">Classic Mode</h2>
          <p>Total guesses: {stats.classic.total}</p>
          <p>Correct: {stats.classic.correct}</p>
          <p>Incorrect: {stats.classic.incorrect}</p>
        </div>
        <div className="flex-1">
          <h2 className="mb-2 text-2xl">Quiz Mode</h2>
          <p>Total guesses: {stats.quiz.total}</p>
          <p>Correct: {stats.quiz.correct}</p>
          <p>Incorrect: {stats.quiz.incorrect}</p>
        </div>
      </div>
      <h2 className="mb-2 text-xl">By Model</h2>
      {Object.entries(imagesByModel).map(([model, images]) => (
        <div key={model} className="mb-6">
          <p className="mb-2 font-bold">
            {model}: {stats.models[model]?.correct ?? 0} correct /
            {' '}
            {stats.models[model]?.incorrect ?? 0} incorrect
          </p>
          <div className="grid grid-cols-5 gap-2">
            {images.map((id) => {
              const guessed = stats.models[model]?.correctImages?.includes(id);
              return guessed ? (
                <img
                  key={id}
                  src={`/images/${model}/${id}.png`}
                  alt={id}
                  className="h-20 w-20 object-cover"
                />
              ) : (
                <div
                  key={id}
                  className="flex h-20 w-20 items-center justify-center bg-gray-700 text-xl"
                >
                  ?
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => { clearStats(); setStats(getStats()); }}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Clear Stats
      </button>
    </div>
  );
}

export default StatsPage;
