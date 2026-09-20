export interface ModelStats {
  correct: number;
  incorrect: number;
  total: number;
  correctImages: string[];
}

export interface ModeStats {
  correct: number;
  incorrect: number;
  total: number;
}

export interface Stats {
  correct: number;
  incorrect: number;
  total: number;
  classic: ModeStats;
  quiz: ModeStats;
  models: Record<string, ModelStats>;
}

const STORAGE_KEY = 'stats';

let memoryStats: Stats | undefined;
let lastObservedRaw: string | null | undefined;
let hasUnsavedStats = false;

function getInitialStats(): Stats {
  return {
    correct: 0,
    incorrect: 0,
    total: 0,
    classic: { correct: 0, incorrect: 0, total: 0 },
    quiz: { correct: 0, incorrect: 0, total: 0 },
    models: {},
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

function normalizeCounts(value: unknown): ModeStats {
  const data = isRecord(value) ? value : {};
  const total = isCount(data.total) ? data.total : 0;
  const correct = isCount(data.correct) ? data.correct
    : Math.max(0, total - (isCount(data.incorrect) ? data.incorrect : total));
  const incorrect = isCount(data.incorrect) ? data.incorrect : Math.max(0, total - correct);
  return { correct, incorrect, total: correct + incorrect };
}

function parseStats(raw: string | null): Stats {
  if (!raw) return getInitialStats();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return getInitialStats();
    const models = isRecord(parsed.models) ? parsed.models : {};
    return {
      ...normalizeCounts(parsed),
      classic: normalizeCounts(parsed.classic),
      quiz: normalizeCounts(parsed.quiz),
      models: Object.fromEntries(Object.entries(models).filter(([, value]) => isRecord(value))
        .map(([model, value]) => {
          const data = value as Record<string, unknown>;
          const correctImages = Array.isArray(data.correctImages)
            ? [...new Set(data.correctImages.filter(
              (id): id is string => typeof id === 'string' && id.length > 0,
            ))] : [];
          return [model, { ...normalizeCounts(data), correctImages }];
        })),
    };
  } catch {
    return getInitialStats();
  }
}

export function getStats(): Stats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!hasUnsavedStats || raw !== lastObservedRaw) {
      memoryStats = parseStats(raw);
      hasUnsavedStats = false;
    }
    lastObservedRaw = raw;
  } catch {
    // Retain session totals when the browser disables persistent storage.
  }
  const stats = memoryStats ?? getInitialStats();
  return {
    ...stats,
    classic: { ...stats.classic },
    quiz: { ...stats.quiz },
    models: Object.fromEntries(Object.entries(stats.models).map(([model, value]) => [
      model, { ...value, correctImages: [...value.correctImages] },
    ])),
  };
}

export function recordGuess(model: string, isCorrect: boolean, imageId: string, mode: 'classic' | 'quiz'): void {
  const stats = getStats();
  if (!Object.hasOwn(stats.models, model)) {
    stats.models[model] = {
      correct: 0,
      incorrect: 0,
      total: 0,
      correctImages: [],
    };
  }
  const modelStats = stats.models[model];
  if (isCorrect) {
    stats.correct += 1;
    stats[mode].correct += 1;
    modelStats.correct += 1;
    if (!modelStats.correctImages.includes(imageId)) {
      modelStats.correctImages.push(imageId);
    }
  } else {
    stats.incorrect += 1;
    stats[mode].incorrect += 1;
    modelStats.incorrect += 1;
  }
  stats.total += 1;
  stats[mode].total += 1;
  modelStats.total += 1;
  memoryStats = stats;
  try {
    const raw = JSON.stringify(stats);
    localStorage.setItem(STORAGE_KEY, raw);
    lastObservedRaw = raw;
    hasUnsavedStats = false;
  } catch {
    hasUnsavedStats = true;
  }
}

export function clearStats(): void {
  memoryStats = getInitialStats();
  try {
    localStorage.removeItem(STORAGE_KEY);
    lastObservedRaw = null;
    hasUnsavedStats = false;
  } catch {
    hasUnsavedStats = true;
  }
}
