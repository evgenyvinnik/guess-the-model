import { useState } from 'react';
import Game from './Game.tsx';
import logo from './assets/logo.png';

function Home() {
  const [mode, setMode] = useState<'classic' | 'quiz' | null>(null);

  if (mode) {
    return <Game mode={mode} onReset={() => setMode(null)} />;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-white">
      <img src={logo} alt="Logo" className="mb-4 w-96 max-w-full" />
      <div className="flex gap-4">
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
    </div>
  );
}

export default Home;
