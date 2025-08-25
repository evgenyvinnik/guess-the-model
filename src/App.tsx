import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home.tsx';
import StatsPage from './StatsPage.tsx';
import playSound, { playMusic, setMusicEnabled, setSfxEnabled } from './audio.ts';

function App() {
  const [musicOn, setMusicOn] = useState(false);
  const [sfxOn, setSfxOn] = useState(false);

  useEffect(() => {
    setMusicEnabled(musicOn);
    if (musicOn) {
      playMusic('/audio/bgm/theme.wav');
    }
  }, [musicOn]);

  useEffect(() => {
    setSfxEnabled(sfxOn);
  }, [sfxOn]);

  const toggleMusic = () => {
    setMusicOn((prev) => !prev);
    playSound('/audio/sfx/click.wav');
  };

  const toggleSfx = () => {
    playSound('/audio/sfx/click.wav');
    setSfxOn((prev) => !prev);
  };

  return (
    <div className="min-h-screen millionaire-background text-white">
      <nav className="navbar bg-transparent">
        <div className="navbar-start">
          <div className="dropdown">
            <button
              type="button"
              className="btn btn-ghost bg-[#0b1444] text-white"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <ul
              className="menu menu-sm dropdown-content mt-3 w-52 rounded-box bg-[#0b1444] p-2 shadow text-white"
            >
              <li><Link to="/">Home</Link></li>
              <li><Link to="/stats">Stats</Link></li>
              <li className="lg:hidden">
                <button
                  type="button"
                  onClick={toggleMusic}
                  className="millionaire-button px-6 py-2 text-sm"
                >
                  Music: {musicOn ? 'On' : 'Off'}
                </button>
              </li>
              <li className="lg:hidden">
                <button
                  type="button"
                  onClick={toggleSfx}
                  className="millionaire-button px-6 py-2 text-sm"
                >
                  SFX: {sfxOn ? 'On' : 'Off'}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="fixed bottom-4 right-4 hidden flex-col gap-2 lg:flex">
        <button
          type="button"
          onClick={toggleMusic}
          className="millionaire-button px-6 py-2 text-sm"
        >
          Music: {musicOn ? 'On' : 'Off'}
        </button>
        <button
          type="button"
          onClick={toggleSfx}
          className="millionaire-button px-6 py-2 text-sm"
        >
          SFX: {sfxOn ? 'On' : 'Off'}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
