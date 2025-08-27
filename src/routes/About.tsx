import type { ReactElement } from 'react';

function About(): ReactElement {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center text-white">
      <h1 className="text-3xl font-bold">About Guess the Model</h1>
      <p className="max-w-xl">
        Guess the Model is a playful web game built in August 2025. Each round shows an AI-generated
        artwork and challenges you to guess which generative art model produced it. The game ships
        with five popular generators—DALL·E 3, Midjourney v6, Stable Diffusion 3,
        Ideogram 2, and Adobe Firefly 2. Can you spot the subtle differences in style and pick the
        right model?
      </p>
    </div>
  );
}

export default About;
