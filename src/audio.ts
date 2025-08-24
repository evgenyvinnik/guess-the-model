let musicAudio: HTMLAudioElement | null = null;
let musicEnabled = true;
let sfxEnabled = true;

export function playMusic(src: string) {
  if (musicAudio) {
    musicAudio.pause();
  }
  musicAudio = new Audio(src);
  musicAudio.loop = true;
  if (musicEnabled) {
    musicAudio.play().catch(() => {
      // Ignore play errors (e.g. autoplay restrictions)
    });
  }
}

export function setMusicEnabled(enabled: boolean) {
  musicEnabled = enabled;
  if (musicAudio) {
    if (enabled) {
      musicAudio.play().catch(() => {
        // Ignore play errors
      });
    } else {
      musicAudio.pause();
    }
  }
}

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
}

/**
 * Plays an audio file from the given source path.
 * The source should reference a file located in the public/audio directory,
 * for example '/audio/sfx/click.wav'.
 */
export default function playSound(src: string) {
  if (!sfxEnabled) return;
  const audio = new Audio(src);
  audio.play().catch(() => {
    // Ignore play errors (e.g. autoplay restrictions)
  });
}
