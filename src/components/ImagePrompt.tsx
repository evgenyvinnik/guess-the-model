import { useRef, useState, type ReactElement } from 'react';

function ImagePrompt({ prompt }: { prompt: string }): ReactElement {
  const [status, setStatus] = useState('');
  const textRef = useRef<HTMLParagraphElement>(null);
  const recorded = prompt.trim() !== '' && prompt !== 'stub';

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('Prompt copied');
    } catch {
      if (textRef.current) {
        const range = document.createRange();
        range.selectNodeContents(textRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus('Copy is unavailable. Select and copy the prompt below.');
    }
  };

  return (
    <section className="mil-image-prompt" aria-label="Generation prompt">
      <div className="mil-image-prompt-actions">
        <h3>Prompt</h3>
        {recorded && <button type="button" onClick={copyPrompt}>Copy prompt</button>}
      </div>
      <p ref={textRef} className="mil-stats-preview-prompt" data-testid="image-prompt-text">
        {recorded ? prompt : 'The prompt was not recorded for this older image.'}
      </p>
      <p role="status" className="mil-prompt-copy-status">{status}</p>
    </section>
  );
}

export default ImagePrompt;
