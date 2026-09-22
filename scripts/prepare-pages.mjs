import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');
const index = join(dist, 'index.html');

['classic', 'quiz', 'stats', 'about'].forEach((route) => {
  const directory = join(dist, route);
  mkdirSync(directory, { recursive: true });
  copyFileSync(index, join(directory, 'index.html'));
});

// GitHub Pages serves this shell for unknown deep links as well.
copyFileSync(index, join(dist, '404.html'));
