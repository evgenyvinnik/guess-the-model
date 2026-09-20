import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Vite serves the app under its GitHub Pages base path.
    baseUrl: 'http://localhost:5173/guess-the-model',
    supportFile: false,
    video: false,
  },
});
