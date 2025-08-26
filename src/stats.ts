export interface ModelStats {
  correct: number;
  incorrect: number;
  total: number;
  correctImages: string[];
}

export interface Stats {
  correct: number;
  incorrect: number;
  total: number;
  models: Record<string, ModelStats>;
}

const STORAGE_KEY = 'stats';

function getInitialStats(): Stats {
  return {
    correct: 0,
    incorrect: 0,
    total: 0,
    models: {},
  };
}

export function getStats(): Stats {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getInitialStats();
  try {
    return JSON.parse(raw) as Stats;
  } catch {
    return getInitialStats();
  }
}

export function recordGuess(model: string, isCorrect: boolean, imageId: string): void {
  const stats = getStats();
  if (!stats.models[model]) {
    stats.models[model] = {
      correct: 0,
      incorrect: 0,
      total: 0,
      correctImages: [],
    };
  }
  const modelStats = stats.models[model];
  if (!modelStats.correctImages) {
    modelStats.correctImages = [];
  }
  if (isCorrect) {
    stats.correct += 1;
    modelStats.correct += 1;
    if (!modelStats.correctImages.includes(imageId)) {
      modelStats.correctImages.push(imageId);
    }
  } else {
    stats.incorrect += 1;
    modelStats.incorrect += 1;
  }
  stats.total += 1;
  modelStats.total += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function clearStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
