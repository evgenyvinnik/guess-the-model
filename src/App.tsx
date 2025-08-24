import { Link, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './Home.tsx';
import StatsPage from './StatsPage.tsx';
import playSound, { playMusic, setMusicEnabled, setSfxEnabled } from './audio.ts';

function App() {
  const [musicOn, setMusicOn] = useState(true);
  const [sfxOn, setSfxOn] = useState(true);

  useEffect(() => {
    playMusic('/audio/bgm/theme.wav');
  }, []);

  useEffect(() => {
    setMusicEnabled(musicOn);
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
    <div className="min-h-screen bg-[#242424] text-white">
      <nav className="p-4">
        <Link to="/" className="mr-4">Home</Link>
        <Link to="/stats" className="mr-4">Stats</Link>
        <button
          type="button"
          onClick={toggleMusic}
          className="mr-2 rounded bg-gray-700 px-2 py-1"
        >
          Music: {musicOn ? 'On' : 'Off'}
        </button>
        <button
          type="button"
          onClick={toggleSfx}
          className="rounded bg-gray-700 px-2 py-1"
        >
          SFX: {sfxOn ? 'On' : 'Off'}
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
