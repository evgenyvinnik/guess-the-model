import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="mx-auto flex min-h-screen min-w-[320px] max-w-screen-lg flex-col items-center justify-center bg-[#242424] p-8 text-center text-white">
      <div className="flex justify-center gap-4">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src={viteLogo}
            className="h-24 p-6 transition-[filter] duration-300 will-change-[filter] hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-24 p-6 transition-[filter] duration-300 will-change-[filter] hover:drop-shadow-[0_0_2em_#61dafbaa] motion-safe:animate-[spin_20s_linear_infinite]"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="mt-4 text-5xl font-bold">Vite + React</h1>
      <div className="p-8">
        <button
          type="button"
          className="rounded-lg border border-transparent bg-[#1a1a1a] px-4 py-2 text-base font-medium transition-colors duration-200 hover:border-indigo-500"
          onClick={() => setCount((prevCount) => prevCount + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-gray-500">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
