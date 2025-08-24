/**
 * Plays an audio file from the given source path.
 * The source should reference a file located in the public/audio directory,
 * for example '/audio/sfx/click.mp3'.
 */
export default function playSound(src: string) {
  const audio = new Audio(src);
  audio.play().catch(() => {
    // Ignore play errors (e.g. autoplay restrictions)
  });
}
