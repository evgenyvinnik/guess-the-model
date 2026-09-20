import type { ReactElement } from 'react';
import type { QuestionEntry } from '../questions.ts';
import { generationDate, versionLabel } from '../imageProvenance.ts';
import './GenerationDetails.css';

export function GenerationLabel({ entry }: { entry: QuestionEntry }): ReactElement {
  return (
    <span className="mil-generation-label" data-testid="generation-label">
      <strong>{entry.modelName}</strong>
      <span>{versionLabel(entry.provenance)}</span>
      <span>{generationDate(entry.provenance)}</span>
    </span>
  );
}

function GenerationDetails({ entry }: { entry: QuestionEntry }): ReactElement {
  const { provenance } = entry;
  const version = provenance?.modelVersion;
  return (
    <div className="mil-generation-details" data-testid="generation-details">
      <dl>
        <div><dt>Generator</dt><dd>{entry.modelName}</dd></div>
        <div><dt>Image model</dt><dd>{versionLabel(provenance)}</dd></div>
        <div><dt>Generated</dt><dd>{generationDate(provenance)}</dd></div>
        {provenance?.mode && <div><dt>Mode</dt><dd>{provenance.mode}</dd></div>}
      </dl>
      <p className="mil-generation-basis">
        {version ? `${version.certainty === 'confirmed' ? 'Confirmed label' : 'Estimate'}: ${version.basis}`
          : provenance?.versionNote ?? 'The exact model version was not recorded for this image.'}
      </p>
      {provenance?.promptProcessing && (
        <p className="mil-generation-basis">{provenance.promptProcessing}</p>
      )}
    </div>
  );
}

export default GenerationDetails;
