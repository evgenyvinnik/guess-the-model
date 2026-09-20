import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState, type ReactElement } from 'react';
import { isbot } from 'isbot';
import logo from '../assets/logo.png';
import { Bgm, playMusic } from '../audio.ts';
import { comparisonAvailable } from '../imageRounds.ts';

function Home(): ReactElement {
  const [isCrawler, setIsCrawler] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const format = comparisonAvailable && searchParams.get('format') === 'comparison'
    ? 'comparison' : 'single';
  const formatQuery = format === 'comparison' ? '?format=comparison' : '';

  useEffect(() => {
    setIsCrawler(isbot(navigator.userAgent));
  }, []);

  useEffect(() => {
    playMusic(Bgm.Theme);
  }, []);

  return (
    <div className="mil-home flex w-full flex-col items-center px-4 text-center text-white">
      <div className="logo-animation">
        <img src={logo} alt="Guess the Model" className="w-full" />
      </div>

      <p className="max-w-md text-sm uppercase tracking-[0.3em] text-sky-200">
        Fifteen questions. Three lifelines. One million dollars.
      </p>

      <fieldset className="mil-format-picker">
        <legend>Choose your question type</legend>
        <div className="mil-format-options">
          <label className="mil-format-option" htmlFor="format-single">
            <input
              id="format-single"
              type="radio"
              name="question-format"
              aria-label="Guess the model"
              checked={format === 'single'}
              onChange={() => setSearchParams({})}
            />
            <span className="mil-format-card">
              <span className="mil-format-symbol" aria-hidden="true"><span>?</span></span>
              <strong>Guess the model</strong>
              <span>One image. Which model made it?</span>
            </span>
          </label>
          <label className="mil-format-option" htmlFor="format-comparison">
            <input
              id="format-comparison"
              type="radio"
              name="question-format"
              aria-label="Find the image"
              checked={format === 'comparison'}
              disabled={!comparisonAvailable}
              onChange={() => setSearchParams({ format: 'comparison' })}
            />
            <span className="mil-format-card">
              <span className="mil-format-symbol mil-format-symbol-grid" aria-hidden="true">
                <span>A</span><span>B</span><span>C</span><span>D</span>
              </span>
              <strong>Find the image</strong>
              <span>Same prompt. Four images. Find the named model.</span>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="relative z-10 flex flex-wrap justify-center gap-4">
        <Link to={`/classic${formatQuery}`} className="millionaire-button">
          Classic
        </Link>
        <Link to={`/quiz${formatQuery}`} className="millionaire-button">
          Quiz
        </Link>
      </div>

      <div className="w-full max-w-prose px-4">
        <details open={isCrawler}>
          <summary className="cursor-pointer text-lg font-bold">About</summary>
          <p className="mt-2 text-sm text-sky-100">
            Identify the model behind one AI-generated image, or compare four images made
            from the same prompt and find the one by a named model. Climb the money ladder
            in Classic
            mode, or take twenty questions at your own pace in Quiz mode.
          </p>
        </details>
      </div>
    </div>
  );
}

export default Home;
