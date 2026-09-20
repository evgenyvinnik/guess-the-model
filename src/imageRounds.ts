import { activeGeneratedImages, type GeneratedImage } from './data/generatedImages.ts';
import { answerModels, playableQuestions, type QuestionEntry } from './questions.ts';
import { getImageHistory, imageHistoryKey, type ImageHistory } from './imageHistory.ts';

export type QuestionFormat = 'single' | 'comparison';

export interface ImageRound {
  format: QuestionFormat;
  target: QuestionEntry;
  options: string[];
  answer: string;
  /** In comparison rounds, each image occupies the slot at the same options index. */
  images: QuestionEntry[];
}

/** A shared id alone is insufficient: the submitted prompt must also match exactly. */
export function getEligibleComparisonGroups(
  entries: readonly GeneratedImage[] = activeGeneratedImages,
): GeneratedImage[][] {
  const groups = new Map<string, GeneratedImage[]>();
  entries.forEach((entry) => {
    const key = JSON.stringify([entry.promptId, entry.prompt]);
    const group = groups.get(key) ?? [];
    group.push(entry);
    groups.set(key, group);
  });
  return [...groups.values()].filter(
    (group) => new Set(group.map(({ modelName }) => modelName)).size >= 4,
  );
}

const comparisonGroups = getEligibleComparisonGroups();

export const comparisonAvailable = comparisonGroups.length > 0;

function shuffle<T>(values: readonly T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function exposureCount(entry: QuestionEntry, history: ImageHistory): number {
  return history.seen[imageHistoryKey(entry)] ?? 0;
}

function recency(entry: QuestionEntry, history: ImageHistory): number {
  return (history.recent ?? Object.keys(history.seen)).indexOf(imageHistoryKey(entry));
}

/** Reuse the oldest artwork, so new additions never have to catch up on lifetime views. */
function oldestEntries<T extends QuestionEntry>(entries: T[], history: ImageHistory): T[] {
  const unseen = entries.filter((entry) => exposureCount(entry, history) === 0);
  if (unseen.length > 0) return unseen;
  const outsideLastRound = entries.filter(
    (entry) => !history.lastRound.includes(imageHistoryKey(entry)),
  );
  const pool = outsideLastRound.length > 0 ? outsideLastRound : entries;
  const oldest = Math.min(...pool.map((entry) => recency(entry, history)));
  return pool.filter((entry) => recency(entry, history) === oldest);
}

function createSingleRound(history: ImageHistory): ImageRound {
  const entries = oldestEntries(Object.values(playableQuestions), history);
  const index = Math.floor(Math.random() * entries.length);
  const target = entries[index];
  const otherModels = answerModels.filter((model) => model !== target.modelName);
  const shuffled = [...otherModels]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = [...shuffled, target.modelName].sort(() => Math.random() - 0.5);
  return {
    format: 'single',
    target,
    options,
    answer: target.modelName,
    images: [target],
  };
}

function providerCandidates(group: GeneratedImage[], history: ImageHistory) {
  return [...new Set(group.map(({ modelName }) => modelName))].map((model) => {
    const outputs = oldestEntries(group.filter(({ modelName }) => modelName === model), history);
    return {
      outputs,
      count: exposureCount(outputs[0], history),
      recent: history.lastRound.includes(imageHistoryKey(outputs[0])),
      age: recency(outputs[0], history),
    };
  });
}

type ProviderCandidate = ReturnType<typeof providerCandidates>[number];

function compareProviders(a: ProviderCandidate, b: ProviderCandidate): number {
  return Number(a.count > 0) - Number(b.count > 0)
    || Number(a.recent) - Number(b.recent) || a.age - b.age;
}

function compareScores(a: number[], b: number[]): number {
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

export function createImageRound(
  format: QuestionFormat,
  history: ImageHistory = getImageHistory(),
): ImageRound {
  if (format === 'single' || !comparisonAvailable) return createSingleRound(history);

  const groups = comparisonGroups.map((group) => {
    const candidates = providerCandidates(group, history);
    const best = [...candidates].sort(compareProviders).slice(0, 4);
    return {
      candidates,
      score: [
        // Maximize unseen outputs, then avoid recently displayed sets.
        best.filter(({ count }) => count > 0).length,
        best.filter(({ recent }) => recent).length,
        ...best.map(({ age }) => age).sort((a, b) => b - a),
      ],
    };
  }).sort((a, b) => compareScores(a.score, b.score));
  const freshest = groups.filter(({ score }) => compareScores(score, groups[0].score) === 0);
  const group = freshest[Math.floor(Math.random() * freshest.length)];

  const selected = shuffle(group.candidates).sort(compareProviders).slice(0, 4)
    .map(({ outputs }) => outputs[Math.floor(Math.random() * outputs.length)]);
  const images = shuffle(selected);
  const options = ['Image A', 'Image B', 'Image C', 'Image D'];
  const targetIndex = Math.floor(Math.random() * images.length);

  return {
    format: 'comparison',
    target: images[targetIndex],
    options,
    answer: options[targetIndex],
    images,
  };
}
