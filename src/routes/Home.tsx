import { Link } from 'react-router-dom';
import { useEffect, useState, type ReactElement } from 'react';
import { isbot } from 'isbot';
import logo from '../assets/logo.png';

function Home(): ReactElement {
  const [isCrawler, setIsCrawler] = useState(false);

  useEffect(() => {
    setIsCrawler(isbot(navigator.userAgent));
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center text-white">
      <div className="logo-animation mb-4 w-96">
        <img src={logo} alt="Logo" className="w-full" />
      </div>
      <div className="relative z-10 flex justify-center gap-4">
        <Link to="/classic" className="millionaire-button">
          Classic
        </Link>
        <Link to="/quiz" className="millionaire-button">
          Quiz
        </Link>
      </div>
      <div className="mt-12 w-full max-w-prose px-4">
        <details open={isCrawler}>
          <summary className="cursor-pointer text-lg font-bold">About</summary>
          <p className="mt-2 text-sm">
            Guess the Model is an interactive quiz where players try to identify
            which AI model produced a given answer. Test your intuition and learn
            how different models respond to the same questions.
          </p>
        </details>
      </div>
    </div>
  );
}

export default Home;
