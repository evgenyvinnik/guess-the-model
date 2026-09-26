import { activeGeneratedImages, generatedImages, type GeneratedImage } from './data/generatedImages.ts';
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

function promptKey(entry: Pick<QuestionEntry, 'promptId' | 'prompt'>): string {
  return JSON.stringify([entry.promptId, entry.prompt]);
}

const promptByImage = new Map(generatedImages.map(
  (entry) => [imageHistoryKey(entry), promptKey(entry)],
));

/** Older prompts win before another output of a recently shown scene. */
function promptRecency(entry: QuestionEntry, history: ImageHistory): number {
  const key = promptKey(entry);
  return (history.recent ?? Object.keys(history.seen)).reduce((latest, imageKey, index) => (
    promptByImage.get(imageKey) === key ? index : latest
  ), -1);
}

/** Show unseen artwork first, then rotate the oldest scenes and images. */
function oldestEntries<T extends QuestionEntry>(entries: T[], history: ImageHistory): T[] {
  const unseen = entries.filter((entry) => exposureCount(entry, history) === 0);
  const candidates = unseen.length > 0 ? unseen : entries;
  const outsideLastRound = candidates.filter(
    (entry) => !history.lastRound.includes(imageHistoryKey(entry)),
  );
  const pool = outsideLastRound.length > 0 ? outsideLastRound : candidates;
  const oldestPrompt = Math.min(...pool.map((entry) => promptRecency(entry, history)));
  const diverse = pool.filter((entry) => promptRecency(entry, history) === oldestPrompt);
  const oldest = Math.min(...diverse.map((entry) => recency(entry, history)));
  return diverse.filter((entry) => recency(entry, history) === oldest);
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
  const unseen = allEntries.filter((entry) => exposureCount(entry, history) === 0);
  // Balance providers while they have new art. Once every image has appeared,
  // rotate individual images by recency instead of repeatedly catching a small
  // provider up to the target count of a much larger bank.
  const freshModel = unseen.length > 0
    ? leastTargetModel([...new Set(unseen.map(({ modelName }) => modelName))], history)
    : undefined;
  const entries = freshModel
    ? oldestEntries(unseen.filter((entry) => entry.modelName === freshModel), history)
    : oldestEntries(allEntries, history);
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
) {
  return [...new Set(group.map(({ modelName }) => modelName))].map((model) => {
    const outputs = oldestEntries(group.filter(({ modelName }) => modelName === model), history);
    return {
      model,
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

function selectionScore(
  candidates: ProviderCandidate[],
  views: Map<QuestionEntry['modelName'], number>,
  history: ImageHistory,
  unseenRemaining: boolean,
  targetModel: QuestionEntry['modelName'],
  protectedModels: ReadonlySet<QuestionEntry['modelName']>,
): number[] {
  const selected = new Set<QuestionEntry['modelName']>(candidates.map(({ model }) => model));
  const nextViews = [...views.entries()].map(
    ([model, count]) => count + Number(selected.has(model)),
  );
  const spread = Math.max(...nextViews) - Math.min(...nextViews);
  return [
    // Maximize new artwork before displaying any already-seen image.
    unseenRemaining ? candidates.filter(({ count }) => count > 0).length : 0,
    // Keep a provider's last fresh image available for its first target turn.
    candidates.filter(({ model }) => model !== targetModel && protectedModels.has(model)).length,
    // Space repeated scenes apart when groups offer equally fresh artwork.
    promptRecency(candidates[0].outputs[0], history),
    // Balance displayed providers when freshness and scene variety allow it.
    Math.max(0, spread - 3),
    spread,
    nextViews.reduce((sum, count) => sum + count ** 2, 0),
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
  const groups = comparisonGroups.map((group) => {
    const candidates = providerCandidates(group, history);
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
  // If a one-image provider appears in the opening board, make it the target
  // before that sole original is consumed as a distractor.
  const singletonIndex = images.findIndex(({ modelName }) => activeGeneratedImages
    .filter((entry) => entry.modelName === modelName).length === 1);
  const targetIndex = singletonIndex >= 0
    ? singletonIndex : Math.floor(Math.random() * images.length);
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
  if (Object.keys(history.seen).length === 0) return createInitialComparisonRound(history);

  const eligibleEntries = comparisonGroups.flat();
  const unseen = eligibleEntries.filter((entry) => exposureCount(entry, history) === 0);
  const targetCandidates = unseen.length > 0 ? unseen : oldestEntries(eligibleEntries, history);
  const targetModels = [...new Set(targetCandidates.map(({ modelName }) => modelName))];
  const remainingByModel = new Map<QuestionEntry['modelName'], number>();
  unseen.forEach(({ modelName }) => {
    remainingByModel.set(modelName, (remainingByModel.get(modelName) ?? 0) + 1);
  });
  const protectedModels = new Set([...remainingByModel.entries()]
    .filter(([model, count]) => count === 1 && (history.targets?.[model] ?? 0) === 0)
    .map(([model]) => model));
  const hasUnseen = unseen.length > 0;
  const views = providerViews(history);
  const targetModel = leastTargetModel(targetModels, history);
  const selections = comparisonGroups.flatMap((group) => groupsOfFour(
    providerCandidates(group, history),
  ).filter((candidates) => candidates.some(
    ({ model, outputs }) => model === targetModel
      && outputs.some((entry) => targetCandidates.includes(entry)),
  ))
    .map((candidates) => ({
      candidates,
      score: selectionScore(candidates, views, history, hasUnseen, targetModel, protectedModels),
    })))
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
