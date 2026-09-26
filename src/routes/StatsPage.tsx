import {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  type ReactElement,
} from 'react';
import { getStats, clearStats } from '../stats.ts';
import type { Stats } from '../stats.ts';
import {
  questions,
  playableQuestions,
  imageUrl,
  ModelName,
  type QuestionEntry,
} from '../questions.ts';
import GenerationDetails from '../components/GenerationDetails.tsx';
import ImagePrompt from '../components/ImagePrompt.tsx';
import '../components/ComparisonArtwork.css';

function Thumbnail({ model, id }: { model: ModelName; id: string }): ReactElement {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        title={id}
        className="grid h-20 w-20 place-items-center rounded border border-emerald-400/60 bg-emerald-900/40 text-lg"
      >
        ✓
      </div>
    );
  }

  return (
    <img
      src={imageUrl(model, id)}
      alt={`${model} artwork you identified`}
      onError={() => setFailed(true)}
      className="h-20 w-20 rounded border border-sky-400/40 object-cover"
    />
  );
}

function StatsPage(): ReactElement {
  const [stats, setStats] = useState<Stats>(getStats);
  const [opened, setOpened] = useState<QuestionEntry | null>(null);
  const [hovered, setHovered] = useState<{
    entry: QuestionEntry; left: number; top: number;
  } | null>(null);
  const hoverTimer = useRef<number | undefined>(undefined);
  const hoverRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const clearHoverTimer = () => window.clearTimeout(hoverTimer.current);
  const closeHover = useCallback(() => {
    window.clearTimeout(hoverTimer.current);
    if (hoverRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
    setHovered(null);
  }, []);
  const scheduleHoverClose = () => {
    clearHoverTimer();
    hoverTimer.current = window.setTimeout(() => {
      if (!hoverRef.current?.contains(document.activeElement)) setHovered(null);
    }, 200);
  };

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  useEffect(() => {
    if (!hovered) return undefined;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeHover();
    };
    const dismissOutside = (event: PointerEvent) => {
      if (!hoverRef.current?.contains(event.target as Node)) setHovered(null);
    };
    window.addEventListener('keydown', dismiss);
    window.addEventListener('pointerdown', dismissOutside);
    return () => {
      window.removeEventListener('keydown', dismiss);
      window.removeEventListener('pointerdown', dismissOutside);
    };
  }, [hovered, closeHover]);

  useEffect(() => {
    if (opened && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [opened]);

  const currentImages = useMemo(() => new Set(
    Object.values(playableQuestions).map(({ image }) => image),
  ), []);

  const imagesByModel = useMemo(() => {
    const grouped: Record<ModelName, QuestionEntry[]> = {
      [ModelName.ChatGPT]: [],
      [ModelName.Copilot]: [],
      [ModelName.EMU]: [],
      [ModelName.Firefly]: [],
      [ModelName.FLUX]: [],
      [ModelName.Gemini]: [],
      [ModelName.Grok]: [],
      [ModelName.MetaAI]: [],
      [ModelName.Midjourney]: [],
      [ModelName.Qwen]: [],
      [ModelName.YandexAlice]: [],
    };
    Object.values(questions).forEach((entry) => {
      if (currentImages.has(entry.image)
        || stats.models[entry.modelName]?.correctImages.includes(entry.image)) {
        grouped[entry.modelName].push(entry);
      }
    });
    return grouped;
  }, [stats, currentImages]);

  useEffect(() => {
    const update = () => setStats(getStats());
    window.addEventListener('storage', update);
    return () => window.removeEventListener('storage', update);
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const galleryTile = (model: ModelName, entry: QuestionEntry) => {
    const id = entry.image;
    const guessed = stats.models[model]?.correctImages?.includes(id);
    return guessed ? (
      <button
        key={id}
        type="button"
        aria-label={`View ${model} image details`}
        aria-haspopup="dialog"
        className="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse' || opened) return;
          clearHoverTimer();
          triggerRef.current = event.currentTarget;
          const bounds = event.currentTarget.getBoundingClientRect();
          hoverTimer.current = window.setTimeout(() => setHovered({
            entry,
            left: Math.max(12, Math.min(bounds.left, window.innerWidth - 460)),
            top: Math.max(12, Math.min(bounds.bottom + 8, window.innerHeight - 460)),
          }), 350);
        }}
        onPointerLeave={scheduleHoverClose}
        onClick={(event) => {
          closeHover();
          triggerRef.current = event.currentTarget;
          setOpened(entry);
        }}
      >
        <Thumbnail model={model} id={id} />
      </button>
    ) : (
      <div
        key={id}
        aria-label="Image not yet identified"
        className="grid h-20 w-20 place-items-center rounded border border-slate-600 bg-slate-800/70 text-xl text-slate-400"
      >
        ?
      </div>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center p-4 text-center text-white">
      <h1 className="mb-6 text-3xl font-bold uppercase tracking-wide text-amber-300">
        Statistics
      </h1>

      <section aria-label="Overall statistics" className="mb-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Guesses', value: stats.total, tone: 'text-white' },
          { label: 'Correct', value: stats.correct, tone: 'text-emerald-400' },
          { label: 'Incorrect', value: stats.incorrect, tone: 'text-red-400' },
          { label: 'Accuracy', value: `${accuracy}%`, tone: 'text-amber-300' },
        ].map(({ label, value, tone }) => (
          <div key={label} data-testid={`stat-${label.toLowerCase()}`} className="mil-panel rounded-lg p-3">
            <p className={`text-2xl font-bold ${tone}`}>{value}</p>
            <p className="text-xs uppercase tracking-widest text-sky-200">{label}</p>
          </div>
        ))}
      </section>

      <div className="mb-8 flex w-full flex-col gap-4 sm:flex-row">
        {[
          { title: 'Classic Mode', data: stats.classic },
          { title: 'Quiz Mode', data: stats.quiz },
        ].map(({ title, data }) => (
          <section key={title} aria-label={title} className="mil-panel flex-1 rounded-lg p-4">
            <h2 className="mb-2 text-lg font-bold uppercase tracking-wide">{title}</h2>
            <p className="text-sm">
              {data.correct}
              {' correct of '}
              {data.total}
            </p>
            <p className="text-sm text-red-300">
              {data.incorrect}
              {' incorrect'}
            </p>
          </section>
        ))}
      </div>

      <h2 className="mb-4 text-xl font-bold uppercase tracking-wide">By model</h2>
      <p className="mb-4 text-sm text-sky-200">Hover or tap an identified image to read and copy its prompt. Tap for model details.</p>
      <p className="mb-4 text-sm text-sky-200">Answer totals include past games. The gallery shows the current bank and images you identified earlier.</p>
      {(Object.entries(imagesByModel) as [ModelName, QuestionEntry[]][])
        .filter(([model, images]) => images.length > 0 || stats.models[model]?.total > 0)
        .map(([model, images]) => {
          const current = images.filter(({ image }) => currentImages.has(image));
          const earlier = images.filter(({ image }) => !currentImages.has(image));
          return (
            <section key={model} aria-label={`${model} statistics`} className="mb-6 w-full">
              <h3 className="mb-2 font-bold">
                {model}
                {': '}
                {stats.models[model]?.correct ?? 0}
                {' correct / '}
                {stats.models[model]?.incorrect ?? 0}
                {' incorrect'}
              </h3>
              <p className="mb-2 text-sm text-sky-200">
                {current.filter(
                  ({ image }) => stats.models[model]?.correctImages.includes(image),
                ).length}
                {' of '}
                {current.length}
                {' current images identified'}
              </p>
              <p className="mb-2 text-xs text-sky-200">
                {current.length}
                {' distinct prompts in rotation'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {current.map((entry) => galleryTile(model, entry))}
              </div>
              {earlier.length > 0 && (
                <details className="mt-3 text-sm text-sky-200">
                  <summary className="cursor-pointer">
                    {earlier.length}
                    {' earlier identified images (outside rotation)'}
                  </summary>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {earlier.map((entry) => galleryTile(model, entry))}
                  </div>
                </details>
              )}
            </section>
          );
        })}

      <button
        type="button"
        onClick={() => { clearStats(); setStats(getStats()); }}
        className="millionaire-button my-4 px-6 py-2"
      >
        Clear stats
      </button>

      {hovered && (
        <div
          ref={hoverRef}
          role="dialog"
          aria-label="Image prompt"
          className="mil-stats-hover-prompt"
          style={{ left: hovered.left, top: hovered.top }}
          onPointerEnter={clearHoverTimer}
          onPointerLeave={scheduleHoverClose}
        >
          <div className="mil-image-preview-header">
            <h2>{hovered.entry.modelName}</h2>
            <button type="button" onClick={closeHover}>Close</button>
          </div>
          <ImagePrompt key={hovered.entry.image} prompt={hovered.entry.prompt} />
        </div>
      )}

      <dialog
        ref={dialogRef}
        className="mil-image-preview mil-stats-preview"
        aria-label="Image generation details"
        onClose={() => { setOpened(null); triggerRef.current?.focus(); }}
      >
        <div className="mil-image-preview-header">
          <h2>Image details</h2>
          <button type="button" onClick={() => dialogRef.current?.close()}>Close</button>
        </div>
        {opened && (
          <div className="mil-stats-preview-content">
            <ImagePrompt key={opened.image} prompt={opened.prompt} />
            <img src={imageUrl(opened.modelName, opened.image)} alt={`${opened.modelName} identified artwork`} />
            <GenerationDetails entry={opened} />
          </div>
        )}
      </dialog>
    </div>
  );
}

export default StatsPage;
