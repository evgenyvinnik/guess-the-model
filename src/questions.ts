export const ModelName = {
  Midjourney: 'Midjourney',
  OpenAI: 'OpenAI',
  Grok: 'Grok',
  Gemini: 'Gemini',
  EMU: 'EMU',
} as const;

export type ModelName = typeof ModelName[keyof typeof ModelName];

export interface QuestionEntry {
  image: string;
  modelName: ModelName;
  prompt: string;
}

export const questions: Record<string, QuestionEntry> = {
  '11111111-1111-1111-1111-111111111111': {
    image: '11111111-1111-1111-1111-111111111111',
    modelName: ModelName.Midjourney,
    prompt: 'A futuristic city skyline at sunset.',
  },
  '22222222-2222-2222-2222-222222222222': {
    image: '22222222-2222-2222-2222-222222222222',
    modelName: ModelName.OpenAI,
    prompt: 'A robot painting a self-portrait in a studio.',
  },
  '33333333-3333-3333-3333-333333333333': {
    image: '33333333-3333-3333-3333-333333333333',
    modelName: ModelName.Grok,
    prompt: 'Ancient ruins overgrown with luminous plants.',
  },
  '44444444-4444-4444-4444-444444444444': {
    image: '44444444-4444-4444-4444-444444444444',
    modelName: ModelName.Gemini,
    prompt: 'A dragon sleeping atop a pile of books in a library.',
  },
  '55555555-5555-5555-5555-555555555555': {
    image: '55555555-5555-5555-5555-555555555555',
    modelName: ModelName.EMU,
    prompt: 'An astronaut surfing a cosmic wave.',
  },
};
