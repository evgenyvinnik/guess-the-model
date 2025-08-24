import { useState } from 'react';
import Game from './Game.tsx';

function Home() {
  const [mode, setMode] = useState<'classic' | 'quiz' | null>(null);

  if (mode) {
    return <Game mode={mode} onReset={() => setMode(null)} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-2xl mb-4">Choose a mode</h1>
      <button
        type="button"
        onClick={() => setMode('classic')}
        className="rounded bg-blue-600 px-4 py-2"
      >
        Classic
      </button>
      <button
        type="button"
        onClick={() => setMode('quiz')}
        className="rounded bg-green-600 px-4 py-2"
      >
        Quiz
      </button>
    </div>
  );
}

export default Home;
