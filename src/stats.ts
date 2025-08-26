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

export function getStats(): Stats {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getInitialStats();
  try {
    const parsed = JSON.parse(raw) as Partial<Stats>;
    const initial = getInitialStats();
    return {
      ...initial,
      ...parsed,
      classic: { ...initial.classic, ...parsed?.classic },
      quiz: { ...initial.quiz, ...parsed?.quiz },
      models: parsed?.models ?? {},
    };
  } catch {
    return getInitialStats();
  }
}

export function recordGuess(model: string, isCorrect: boolean, imageId: string, mode: 'classic' | 'quiz'): void {
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function clearStats(): void {
  localStorage.removeItem(STORAGE_KEY);
}
