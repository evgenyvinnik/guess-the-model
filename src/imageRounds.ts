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

function leastTargetModel(
  models: readonly QuestionEntry['modelName'][],
  history: ImageHistory,
): QuestionEntry['modelName'] {
  const minimum = Math.min(...models.map((model) => history.targets?.[model] ?? 0));
  const tied = models.filter((model) => (history.targets?.[model] ?? 0) === minimum);
  return tied[Math.floor(Math.random() * tied.length)];
}

function providerViews(history: ImageHistory): Map<QuestionEntry['modelName'], number> {
  const totals = new Map<QuestionEntry['modelName'], number>();
  Object.values(playableQuestions).forEach((entry) => {
    totals.set(entry.modelName, (totals.get(entry.modelName) ?? 0) + exposureCount(entry, history));
  });
  return totals;
}

function createSingleRound(history: ImageHistory): ImageRound {
  const allEntries = Object.values(playableQuestions);
  // Preserve the first selection of a pre-balance history; subsequent rounds
  // record a target and then rotate providers evenly.
  const model = history.targets
    ? leastTargetModel([...new Set(allEntries.map(({ modelName }) => modelName))], history)
    : undefined;
  const entries = oldestEntries(
    model ? allEntries.filter((entry) => entry.modelName === model) : allEntries,
    history,
  );
  const index = Math.floor(Math.random() * entries.length);
  const target = entries[index];
  const otherModels = answerModels.filter((candidate) => candidate !== target.modelName);
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

function providerCandidates(
  group: GeneratedImage[],
  history: ImageHistory,
  views: Map<QuestionEntry['modelName'], number>,
) {
  return [...new Set(group.map(({ modelName }) => modelName))].map((model) => {
    const outputs = oldestEntries(group.filter(({ modelName }) => modelName === model), history);
    return {
      model,
      outputs,
      count: exposureCount(outputs[0], history),
      recent: history.lastRound.includes(imageHistoryKey(outputs[0])),
      age: recency(outputs[0], history),
      views: views.get(model) ?? 0,
    };
  });
}

type ProviderCandidate = ReturnType<typeof providerCandidates>[number];

function compareProviders(a: ProviderCandidate, b: ProviderCandidate): number {
  return Number(a.count > 0) - Number(b.count > 0)
    || Number(a.recent) - Number(b.recent) || a.age - b.age;
}

function groupsOfFour(candidates: ProviderCandidate[]): ProviderCandidate[][] {
  const selections: ProviderCandidate[][] = [];
  const add = (start: number, selected: ProviderCandidate[]) => {
    if (selected.length === 4) {
      selections.push(selected);
      return;
    }
    for (let index = start; index <= candidates.length - (4 - selected.length); index += 1) {
      add(index + 1, [...selected, candidates[index]]);
    }
  };
  add(0, []);
  return selections;
}

function selectionScore(candidates: ProviderCandidate[]): number[] {
  return [
    // Minimize provider exposure first, even when image-bank sizes differ.
    ...candidates.map(({ views }) => views).sort((a, b) => b - a),
    candidates.filter(({ count }) => count > 0).length,
    candidates.filter(({ recent }) => recent).length,
    ...candidates.map(({ age }) => age).sort((a, b) => b - a),
  ];
}

function compareScores(a: number[], b: number[]): number {
  for (let index = 0; index < a.length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function createInitialComparisonRound(history: ImageHistory): ImageRound {
  const views = providerViews(history);
  const groups = comparisonGroups.map((group) => {
    const candidates = providerCandidates(group, history, views);
    const best = [...candidates].sort(compareProviders).slice(0, 4);
    return {
      candidates,
      score: [
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

export function createImageRound(
  format: QuestionFormat,
  history: ImageHistory = getImageHistory(),
): ImageRound {
  if (format === 'single' || !comparisonAvailable) return createSingleRound(history);
  if (!history.targets) return createInitialComparisonRound(history);

  const targetModels = [...new Set(comparisonGroups.flat().map(({ modelName }) => modelName))];
  const targetModel = leastTargetModel(targetModels, history);
  const views = providerViews(history);
  const selections = comparisonGroups.flatMap((group) => groupsOfFour(
    providerCandidates(group, history, views),
  ).filter((candidates) => candidates.some(({ model }) => model === targetModel))
    .map((candidates) => ({ candidates, score: selectionScore(candidates) })))
    .sort((a, b) => compareScores(a.score, b.score));
  const best = selections.filter(({ score }) => compareScores(score, selections[0].score) === 0);
  const chosen = best[Math.floor(Math.random() * best.length)];
  const selected = chosen.candidates.map(
    ({ outputs }) => outputs[Math.floor(Math.random() * outputs.length)],
  );
  const images = shuffle(selected);
  const options = ['Image A', 'Image B', 'Image C', 'Image D'];
  const targetIndex = images.findIndex(({ modelName }) => modelName === targetModel);

  return {
    format: 'comparison',
    target: images[targetIndex],
    options,
    answer: options[targetIndex],
    images,
  };
}
