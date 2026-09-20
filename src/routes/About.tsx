import type { ReactElement } from 'react';
import { ModelName } from '../questions.ts';

function About(): ReactElement {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 p-8 text-center text-white">
      <h1 className="text-3xl font-bold uppercase tracking-wide text-amber-300">
        About Guess the Model
      </h1>

      <p>
        Guess the Model is a playful web game built in August 2025. Identify the model behind
        an image, or find its image among four made from the same prompt, wrapped in
        the look of a certain million-dollar quiz show.
      </p>

      <div className="w-full">
        <h2 className="mb-2 text-xl font-bold uppercase tracking-wide">The line-up</h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {Object.values(ModelName).map((model) => (
            <li
              key={model}
              className="rounded-full border border-sky-400/60 px-4 py-1 text-sm font-bold"
            >
              {model}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full text-left">
        <h2 className="mb-2 text-center text-xl font-bold uppercase tracking-wide">
          How to play
        </h2>
        <ul className="list-disc space-y-1 pl-6 text-sm text-sky-100">
          <li>
            Choose Guess the model for one image, or Find the image to compare four images
            and pick the one made by a named model. Tap any comparison image to enlarge it.
          </li>
          <li>
            Classic mode walks the fifteen-rung money ladder. One wrong answer ends the run,
            but rungs five and ten bank your winnings.
          </li>
          <li>
            Three lifelines are yours once each per run: fifty-fifty, phone a friend, and ask
            the audience.
          </li>
          <li>Walk away at any point to keep the money you have already won.</li>
          <li>Quiz mode drops the stakes: twenty questions, no elimination, just a score.</li>
        </ul>
      </div>
    </div>
  );
}

export default About;
