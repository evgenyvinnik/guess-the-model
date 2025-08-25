import { useEffect, useState, type ReactElement } from 'react';
import { getStats, clearStats } from '../stats.ts';
import type { Stats } from '../stats.ts';

function StatsPage(): ReactElement {
  const [stats, setStats] = useState<Stats>(getStats());

  useEffect(() => {
    const update = (): void => setStats(getStats());
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="mb-4 text-2xl">Statistics</h1>
      <div className="mb-4">
        <p>Total guesses: {stats.total}</p>
        <p>Correct: {stats.correct}</p>
        <p>Incorrect: {stats.incorrect}</p>
      </div>
      <h2 className="mb-2 text-xl">By Model</h2>
      <ul className="mb-4">
        {Object.entries(stats.models).map(([model, s]) => (
          <li key={model} className="mb-2">
            <span className="font-bold">{model}:</span> {s.correct} correct / {s.incorrect} incorrect (total {s.total})
          </li>
        ))}
      </ul>
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
