# Guess the Model

Guess the Model is a playful web game built in August 2025.  Each round shows an AI-generated artwork and challenges you to guess which generative art model produced it.

## Supported Models
As of August 2025 the game ships with five popular generators:

- DALL·E 3
- Midjourney v6
- Stable Diffusion 3
- Ideogram 2
- Adobe Firefly 2

Can you spot the subtle differences in style and pick the right model?

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173.
3. Build for production and preview the result:
   ```bash
   npm run build
   npm run preview
   ```

## Testing
This project uses [Cypress](https://www.cypress.io/) for end-to-end tests and ESLint for code quality checks.

Run the full test suite (starts a dev server automatically):
```bash
npm run test:e2e
```
If a development server is already running, execute the tests directly:
```bash
npm run cy:run
```
Run the linter:
```bash
npm run lint
```

## Audio Assets
Place your sound effects and background music in the `public/audio` directory:

- `public/audio/sfx` – short sound effect files
- `public/audio/bgm` – longer background music tracks

These files are served statically and can be played in the app using helpers from `audio.ts`:

```ts
import playSound, { playMusic } from './audio';

playSound('/audio/sfx/click.wav');
playMusic('/audio/bgm/theme.wav');
```

## License

MIT
