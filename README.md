# Guess the Model

Guess the Model is a playful web game built in August 2025. Identify image generators, wrapped in the look and pacing of *Who Wants to Be a Millionaire*.

[Play the game on GitHub Pages](https://evgenyvinnik.github.io/guess-the-model/). Pushes to `main` deploy automatically through [the Pages workflow](.github/workflows/pages.yml); direct links to `/classic/`, `/quiz/`, `/stats/`, and `/about/` are included in the build.

## Supported Models

- ChatGPT
- Copilot
- EMU
- Firefly
- FLUX
- Gemini
- Grok
- Meta AI
- Midjourney
- Qwen
- Yandex Alice

The current challenge answer choices are **ChatGPT**, **Gemini**, **Firefly**, **Meta AI**, **FLUX**, **Copilot**, **Grok**, **Qwen**, and **Yandex Alice**. Other supported labels remain available for historical catalog entries and statistics.

Can you spot the subtle differences in style and pick the right model?

## Game Modes

Choose a question type on the start screen, then start either mode:

- **Guess the model:** see one image and choose which model generated it.
- **Find the image:** compare four images created from exactly the same prompt, then choose the image made by the named model. Open any image to inspect it at a larger size; use the A–D answers to lock in your choice. Provider names appear during the reveal.

Direct routes `/classic` and `/quiz` keep the single-image format. Add `?format=comparison` for four-image questions. Next questions and restarts keep the selected format.

**Classic** climbs the fifteen-rung money ladder from $100 to $1,000,000. One wrong answer ends the run, but rungs 5 and 10 bank your winnings, and you can walk away at any point with the money already won. Three lifelines are available once each per run:

- **50:50** removes two wrong answers
- **Phone a friend** returns one opinion, which gets less reliable as the money grows
- **Ask the audience** polls the remaining options

**Quiz** drops the stakes: twenty questions, no elimination, just a score and a rank at the end.

## Artwork

The fifteen challenge prompts exercise foreshortening, reflections, interlocking geometry, exact object counts, bicycle mechanics, guitar and piano fingering, room-view consistency, story continuity, precise menu typography, maze connectivity, shoelace topology, chess positions, and refraction. The playable bank has 99 saved originals across nine providers: one image per provider and prompt. Qwen and Yandex Alice have eight distinct playable prompts each; ChatGPT and Gemini have all fifteen. Extra generations of an existing prompt remain in the historical catalog but never enter new rounds. [Challenge prompts and collection notes](docs/challenge-image-prompts.md) describe the shared prompts, inspection checks, and completed providers. The exact prompt strings live in `src/data/challengePrompts.ts`.

Completed image generations are registered in `src/data/generatedImages.ts`. Each record keeps the saved image path relative to `public/` (with its actual extension), the answer label, a shared prompt id, the exact submitted prompt, and provenance: the generator used, source, and generation date. Freeze version information per image: `modelVersion` contains a label, `confirmed` or `expected` certainty, and the observation or dated evidence supporting it. Only use `confirmed` for an observed label. An `expected` version must have evidence and is displayed as an estimate. Omit the version when it is not disclosed; conversation modes and the chat assistant model are not image-model versions. PNG, JPEG, and WebP files can be used without conversion. Version labels and generation dates appear only after the answer is revealed. The answered-image review remains available during the session and on the result screen; identified thumbnails in Statistics open a keyboard-accessible details dialog. Restarting clears the session review; saved statistics still resolve each original image to its frozen provenance.

For a matched comparison, submit the same exact prompt to each generator and reuse its `promptId` on the resulting records. Keep the first delivered output unchanged, including mistakes in the requested details or provider-added marks; do not request rerolls or retouch to improve the comparison. Additional requested batches preserve earlier samples in the catalog; only the first saved output for each provider and prompt is playable. Disclose observed provider-side processing in provenance: the FLUX demo rewrites submitted prompts automatically, Meta reported automatically regenerating its chess image before delivery, and Meta constructed its second maze programmatically. That maze is explicitly labeled as a programmatic Meta AI output, with no image-model attribution. Save each completed output in `public/images/<Provider>/`, then add its manifest record. Do not register pending generations, missing files, or inferred attributions. “Nano Banana” can be recorded as Gemini's generator metadata when that product label is shown; modern Meta AI outputs use the distinct **Meta AI** answer label, never the historical **EMU** label.

Both game modes and question formats draw from `activeGeneratedImages`, which selects completed challenge outputs once any exist and enforces one output per provider and prompt. The fourteen earlier fox, robot, and teapot originals and later duplicate challenge variants remain in the full manifest of 155 images and the statistics catalog, but are excluded from new rounds. See the [archived matched prompts](docs/matched-image-prompts.md). If no challenge outputs exist, the active bank uses the other registered generations; if the manifest is empty, play falls back to the original catalog in `src/questions.ts`. Historical image ids remain resolvable. Legacy ids still resolve to `public/images/<Model>/<id>.png` via `modelImageDirectory`. Missing files show their prompt as a fallback.

Players can open **View prompt** beneath the artwork to read the exact prompt before guessing. Generator provenance stays in the data and does not appear in that disclosure.

Statistics count one submitted answer per question, attributed to its target provider in either question format. Overall, Classic, Quiz, and per-provider totals include past games; identifying the same image again increases the answer count without duplicating its thumbnail. The collection shows the current playable bank plus previously identified originals from earlier banks, with current-image progress listed separately. Retired, unidentified images do not appear as collectible placeholders. Saved counters and image lists are validated on load, and blocked browser storage falls back to session-only statistics.

Four-image questions are assembled by `src/imageRounds.ts`. Eligible groups must share both the exact prompt text and `promptId`, with at least four distinct providers. The next target comes from a provider with the fewest prior target questions; four displayed providers are then selected to level their cumulative image exposure, with unseen outputs preferred within each provider. The images are shuffled into positions A–D. Incomplete groups are excluded from comparison questions but remain available for single-image questions. All fifteen challenge prompts have at least four distinct providers and qualify for comparison rounds. Eligibility is derived from the active bank; if no group qualifies, a requested comparison falls back to a single-image question. **View shared prompt** discloses the common prompt once for all four images. Lifelines refer to Image A–D, and statistics record the target model and its image once per answer.

Seen images and target-provider counts are remembered locally in the browser across reloads, Classic and Quiz, and both question types. Every displayed question counts toward provider balance even if the player leaves without answering. After the first question establishes target history, single-image questions choose among the least-used target providers first, then draw unseen artwork from that provider while favoring the least recently shown prompt. After that provider's images have all appeared, its least recently shown prompt may recur while larger provider banks still have unseen images. New additions start unseen within their provider and do not need to catch up with older images' lifetime view counts.

Comparison questions favor underexposed providers, then the prompt that can supply the most unseen images from four distinct providers. When a matched group has fewer than four unseen providers, older outputs fill the remaining slots, minimizing overlap with the previous round. All four displayed images enter the shared history. The versioned history key is `guess-the-model:image-history:v1`; it stores image view counts, target-provider counts, and an ordered recency list. Older histories without target counts retain their existing selection behavior for one question, then start balancing from zero. Resetting statistics leaves this history intact. Invalid history recovers safely, and unavailable storage falls back to memory for the current session.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173/guess-the-model/.
3. Build for production and preview the result:
   ```bash
   npm run build
   npm run preview
   ```

## Testing

[Cypress](https://www.cypress.io/) covers the game rules, [Playwright](https://playwright.dev/) covers how the game looks, and ESLint covers code quality.

### Behaviour

Run the end-to-end suite (starts a dev server automatically):
```bash
npm run test:e2e
```
If a development server is already running, execute the tests directly:
```bash
npm run cy:run
```

### Screenshots

Playwright compares each screen against a committed baseline image, so an accidental change to the board, the ladder, or a final screen fails the build. The suite builds the app and serves it with `vite preview`, then captures board, final-screen, and prompt-disclosure views across desktop and mobile viewports:

```bash
npm run test:visual
```

When a visual change is intentional, review the diff and then rewrite the baselines:

```bash
npm run test:visual:update
```

After a failing run, `npm run test:visual:report` opens the HTML report with the expected, actual, and diff images side by side.

Baselines live in `tests/__screenshots__/<viewport>/` and are suffixed with the platform that produced them, because font rasterisation differs between macOS and the Linux containers CI runs on. A Linux run generates its own `-linux` baselines rather than failing against the macOS ones.

Determinism comes from `tests/helpers.ts`: it installs a fake clock so the lock-in and reveal beats are stepped through rather than waited out, pins `Math.random` so the same question and answer order appear every time, serves fixed fixture artwork for visual baselines, and stops every CSS animation. Missing-artwork coverage explicitly blocks image requests. Integration checks serve the registered files, verify the exact prompt and statistics thumbnails, and validate local assets and matched prompt consistency.

If port 5173 is already taken, point the suite somewhere else:
```bash
PW_PORT=5180 npm run test:visual
```

### Linting

```bash
npm run lint
```

## Audio Assets

Sound effects live in `public/audio/sfx` and music beds in `public/audio/bgm`. Both are addressed through the constants in `src/audio.ts`, which resolve paths against the Vite base so sound keeps working when the site is served from a sub-path:

```ts
import playSound, { Bgm, playMusic, Sfx } from './audio';

playSound(Sfx.Click);
playMusic(Bgm.Theme);
```

The music bed follows the ladder: `bgmForLevel` picks a more urgent track as the prize grows. Music and sound effects are muted until the player switches them on in the footer.

## License

MIT
