import type { ReactElement } from 'react';
import { imageUrl, type QuestionEntry } from '../questions.ts';
import GenerationDetails from './GenerationDetails.tsx';

/** Only pass images whose answers have already been revealed. */
function GenerationReview({ images }: { images: QuestionEntry[] }): ReactElement | null {
  if (images.length === 0) return null;
  return (
    <details className="mil-generation-review">
      <summary>Review answered images · model versions &amp; prompts ({images.length})</summary>
      <div className="mil-generation-review-list">
        {images.map((entry) => (
          <article key={entry.image} className="mil-generation-review-card">
            <a href={imageUrl(entry.modelName, entry.image)} target="_blank" rel="noreferrer" aria-label={`Open ${entry.modelName} original image`}>
              <img src={imageUrl(entry.modelName, entry.image)} alt={`${entry.modelName} revealed artwork`} loading="lazy" />
            </a>
            <GenerationDetails entry={entry} />
            <details>
              <summary>View prompt</summary>
              <p>{entry.prompt}</p>
            </details>
          </article>
        ))}
      </div>
    </details>
  );
}

export default GenerationReview;
