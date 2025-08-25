import { useState } from 'react';
import Game from './Game.tsx';

function Home() {
  const [mode, setMode] = useState<'classic' | 'quiz' | null>(null);

  if (mode) {
    return <Game mode={mode} onReset={() => setMode(null)} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-white">
      <h1 className="mb-4 text-2xl">Choose a mode</h1>
      <button
        type="button"
        onClick={() => setMode('classic')}
        className="millionaire-button"
      >
        Classic
      </button>
      <button
        type="button"
        onClick={() => setMode('quiz')}
        className="millionaire-button"
      >
        Quiz
      </button>
    </div>
  );
}

export default Home;
