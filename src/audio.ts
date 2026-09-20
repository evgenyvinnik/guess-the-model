/**
 * Thin wrapper around HTMLAudioElement with two independent mutes: one for
 * the music bed and one for short effects. Paths are resolved against the
 * Vite base so the game keeps its sound when served from a sub-path.
 */

export const Sfx = {
  Click: 'sfx/click.wav',
  LockIn: 'sfx/audio_tic-toc.mp3',
  Right: 'sfx/audio_right.mp3',
  Wrong: 'sfx/audio_wrong.mp3',
  Winner: 'sfx/audio_winner.mp3',
} as const;

export type Sfx = typeof Sfx[keyof typeof Sfx];

export const Bgm = {
  Theme: 'bgm/theme.wav',
  Level1: 'bgm/audio_level-1.mp3',
  Level2: 'bgm/audio_level-2.mp3',
  Level3: 'bgm/audio_level-3.mp3',
} as const;

export type Bgm = typeof Bgm[keyof typeof Bgm];

/** Music bed that matches the tension of a one-based ladder level. */
export function bgmForLevel(level: number): Bgm {
  if (level >= 11) return Bgm.Level3;
  if (level >= 6) return Bgm.Level2;
  return Bgm.Level1;
}

function resolve(path: string): string {
  return `${import.meta.env.BASE_URL}audio/${path}`;
}

let musicAudio: HTMLAudioElement | null = null;
let musicTrack: string | null = null;
let musicEnabled = false;
let sfxEnabled = false;

export function playMusic(track: string): void {
  const src = resolve(track);
  if (musicAudio && musicTrack === track) {
    if (musicEnabled && musicAudio.paused) {
      musicAudio.play().catch(() => {
        // Ignore play errors (e.g. autoplay restrictions)
      });
    }
    return;
  }
  if (musicAudio) {
    musicAudio.pause();
  }
  musicAudio = new Audio(src);
  musicAudio.loop = true;
  musicAudio.volume = 0.4;
  musicTrack = track;
  if (musicEnabled) {
    musicAudio.play().catch(() => {
      // Ignore play errors (e.g. autoplay restrictions)
    });
  }
}

export function stopMusic(): void {
  if (musicAudio) {
    musicAudio.pause();
  }
  musicAudio = null;
  musicTrack = null;
}

export function setMusicEnabled(enabled: boolean): void {
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

export function setSfxEnabled(enabled: boolean): void {
  sfxEnabled = enabled;
}

/** Plays a one-shot effect from `public/audio`. */
export default function playSound(effect: string): void {
  if (!sfxEnabled) return;
  const audio = new Audio(resolve(effect));
  audio.play().catch(() => {
    // Ignore play errors (e.g. autoplay restrictions)
  });
}
