import type { QuestionEntry } from './questions.ts';

export const IMAGE_HISTORY_STORAGE_KEY = 'guess-the-model:image-history:v1';

export interface ImageHistory {
  seen: Record<string, number>;
  lastRound: string[];
  /** Image keys ordered from oldest to newest exposure; optional in legacy payloads. */
  recent?: string[];
}

function emptyHistory(): ImageHistory {
  return { seen: {}, lastRound: [], recent: [] };
}

let memoryHistory = emptyHistory();
let lastObservedRaw: string | null | undefined;
let hasUnsavedHistory = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeRecent(
  seen: Record<string, number>,
  lastRound: readonly string[],
  recent: unknown,
): string[] {
  const seenKeys = Object.keys(seen);
  const known = new Set(seenKeys);
  const latest = new Set(lastRound.filter((key) => known.has(key)));
  const recorded = Array.isArray(recent)
    ? [...new Set(recent.filter(
      (key): key is string => typeof key === 'string' && known.has(key),
    ))]
    : [];
  const queued = new Set(recorded);

  return [
    ...seenKeys.filter((key) => !queued.has(key) && !latest.has(key)),
    ...recorded.filter((key) => !latest.has(key)),
    ...latest,
  ];
}

function copyHistory(history: ImageHistory): ImageHistory {
  return {
    seen: { ...history.seen },
    lastRound: [...history.lastRound],
    recent: normalizeRecent(history.seen, history.lastRound, history.recent),
  };
}

function parseHistory(raw: string | null): ImageHistory {
  if (raw === null) return emptyHistory();
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || value.version !== 1) return emptyHistory();

    const seen = isRecord(value.seen)
      ? Object.fromEntries(Object.entries(value.seen).filter(
        (entry): entry is [string, number] => typeof entry[1] === 'number'
          && Number.isSafeInteger(entry[1]) && entry[1] > 0,
      ))
      : {};
    const lastRound = Array.isArray(value.lastRound)
      ? [...new Set(value.lastRound.filter(
        (key): key is string => typeof key === 'string' && key.length > 0,
      ))]
      : [];
    return { seen, lastRound, recent: normalizeRecent(seen, lastRound, value.recent) };
  } catch {
    return emptyHistory();
  }
}

export function imageHistoryKey(entry: Pick<QuestionEntry, 'modelName' | 'image'>): string {
  return JSON.stringify([entry.modelName, entry.image]);
}

/** Observe storage changes while retaining local history when writes are blocked. */
export function getImageHistory(): ImageHistory {
  try {
    const raw = localStorage.getItem(IMAGE_HISTORY_STORAGE_KEY);
    if (!hasUnsavedHistory || raw !== lastObservedRaw) {
      memoryHistory = parseHistory(raw);
      hasUnsavedHistory = false;
    }
    lastObservedRaw = raw;
  } catch {
    // Browsers that disable storage retain the latest readable or recorded history in memory.
  }
  return copyHistory(memoryHistory);
}

export function recordSeenImages(images: readonly QuestionEntry[]): void {
  const history = getImageHistory();
  const keys = [...new Set(images.map(imageHistoryKey))];
  keys.forEach((key) => {
    history.seen[key] = Math.min((history.seen[key] ?? 0) + 1, Number.MAX_SAFE_INTEGER);
  });
  const viewed = new Set(keys);
  history.recent = [...(history.recent ?? []).filter((key) => !viewed.has(key)), ...keys];
  history.lastRound = keys;
  memoryHistory = history;

  try {
    const raw = JSON.stringify({ version: 1, ...history });
    localStorage.setItem(IMAGE_HISTORY_STORAGE_KEY, raw);
    lastObservedRaw = raw;
    hasUnsavedHistory = false;
  } catch {
    hasUnsavedHistory = true;
    // Exposure tracking still works in memory when persistent storage is unavailable.
  }
}
