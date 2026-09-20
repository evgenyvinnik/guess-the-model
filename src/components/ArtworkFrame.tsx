import { useEffect, useState, type ReactElement } from 'react';
import type { QuestionEntry } from '../questions.ts';
import { GenerationLabel } from './GenerationDetails.tsx';

type ArtworkFrameProps = {
  src: string;
  /** Exact submitted prompt, available without revealing the generator. */
  prompt: string;
  revealedEntry?: QuestionEntry;
};

/**
 * Chrome-framed artwork with a compact prompt disclosure. A missing file
 * degrades to the prompt rather than a broken image icon.
 */
function ArtworkFrame({ src, prompt, revealedEntry = undefined }: ArtworkFrameProps): ReactElement {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const description = prompt && prompt !== 'stub' ? prompt : null;

  return (
    <div className="mil-artwork">
      <div className="mil-screen">
        <div className="mil-screen-inner">
          {failed ? (
            // A scrollable prompt needs keyboard focus so its full text is reachable.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            <div className="mil-artwork-fallback" role="region" aria-label="Image prompt" tabIndex={0}>
              <svg className="mil-artwork-mark" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                <rect x="4" y="4" width="32" height="32" rx="2" />
                <circle cx="26" cy="14" r="3" />
                <path d="m4 29 10-11 10 12 5-5 7 7" />
              </svg>
              {description ? (
                <p className="max-w-sm text-sm italic text-sky-200">
                  &ldquo;
                  {description}
                  &rdquo;
                </p>
              ) : (
                <p className="text-sm text-sky-200">Artwork unavailable</p>
              )}
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Which model made it?
              </p>
            </div>
          ) : (
            <img
              src={src}
              alt="AI-generated artwork to identify"
              onError={() => setFailed(true)}
              className="mil-artwork-image"
            />
          )}
          {revealedEntry && (
            <div className="mil-artwork-reveal"><GenerationLabel entry={revealedEntry} /></div>
          )}
        </div>
      </div>
      {description && !failed && (
        <details key={src} className="mil-artwork-prompt">
          <summary>View prompt</summary>
          <p>{description}</p>
        </details>
      )}
    </div>
  );
}

export default ArtworkFrame;
