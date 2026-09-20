export const Lifeline = {
  FiftyFifty: 'fiftyFifty',
  PhoneAFriend: 'phoneAFriend',
  AskTheAudience: 'askTheAudience',
} as const;

export type Lifeline = typeof Lifeline[keyof typeof Lifeline];

export type LifelineUsage = Record<Lifeline, boolean>;

export const noLifelinesUsed: LifelineUsage = {
  [Lifeline.FiftyFifty]: false,
  [Lifeline.PhoneAFriend]: false,
  [Lifeline.AskTheAudience]: false,
};

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Accuracy of the crowd and of the friend tapers off as the money grows,
 * which is what makes the later lifelines feel like a gamble.
 */
function reliability(level: number): number {
  if (level <= 5) return 0.92;
  if (level <= 10) return 0.72;
  return 0.55;
}

/** The two wrong answers the 50:50 takes off the board. */
export function fiftyFiftyRemovals(options: string[], answer: string): string[] {
  return shuffle(options.filter((option) => option !== answer)).slice(0, 2);
}

export interface AudienceVote {
  option: string;
  percent: number;
}

/**
 * Poll percentages over the options still in play. The correct answer draws
 * the largest block at easy levels and merely a plurality later on.
 */
export function audienceVotes(
  options: string[],
  answer: string,
  level: number,
): AudienceVote[] {
  const weights = options.map((option) => {
    const base = Math.random() * 20 + 5;
    return option === answer ? base + reliability(level) * 120 : base;
  });
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  const percents = weights.map((weight) => Math.round((weight / total) * 100));

  // Rounding rarely lands on 100, so settle the remainder on the top block.
  const drift = 100 - percents.reduce((sum, percent) => sum + percent, 0);
  const topIndex = percents.indexOf(Math.max(...percents));
  percents[topIndex] += drift;

  return options.map((option, index) => ({ option, percent: percents[index] }));
}

export interface FriendAdvice {
  option: string;
  confidence: 'certain' | 'fairly sure' | 'guessing';
}

/** What the friend on the phone says, right or wrong. */
export function friendAdvice(
  options: string[],
  answer: string,
  level: number,
): FriendAdvice {
  const accuracy = reliability(level);
  const isRight = Math.random() < accuracy;
  const option = isRight
    ? answer
    : shuffle(options.filter((candidate) => candidate !== answer))[0] ?? answer;

  let confidence: FriendAdvice['confidence'] = 'guessing';
  if (accuracy > 0.85) confidence = 'certain';
  else if (accuracy > 0.65) confidence = 'fairly sure';

  return { option, confidence };
}
