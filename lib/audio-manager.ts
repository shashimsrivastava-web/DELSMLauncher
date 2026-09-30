// Universal Web Audio Singleton & Interaction Auto-Unlocker
// Bypasses browser autoplay policies on first touch/click and persists audio preferences across page sessions.

let globalAudioCtx: AudioContext | null = null;
let isUnlocked = false;
let unlockPromise: Promise<AudioContext | null> | null = null;

const STORAGE_KEY_MUTED = 'delsm_dial_is_muted';
const STORAGE_KEY_THEME = 'delsm_dial_sound_theme';

export function getStoredMuteState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(STORAGE_KEY_MUTED);
    return val === 'true'; // Default is false (Sound Active)
  } catch {
    return false;
  }
}

export function setStoredMuteState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_MUTED, muted ? 'true' : 'false');
  } catch {
    // localStorage unavailable
  }
}

export function getStoredThemeId(fallback = 'mechanical'): string {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(STORAGE_KEY_THEME);
    return val || fallback;
  } catch {
    return fallback;
  }
}

export function setStoredThemeId(themeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
  } catch {
    // localStorage unavailable
  }
}

/**
 * Returns the singleton AudioContext, creating it if necessary.
 */
export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!globalAudioCtx) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      globalAudioCtx = new AudioCtx();
    }
  }

  return globalAudioCtx;
}

/**
 * Forces Web Audio to initialize and unlock on a user gesture call-stack.
 * Starts a synchronous silent buffer and ensures AudioContext transitions to 'running'.
 */
export function unlockAudioContext(): Promise<AudioContext | null> {
  const ctx = getSharedAudioContext();
  if (!ctx) return Promise.resolve(null);

  if (ctx.state === 'running' && isUnlocked) {
    return Promise.resolve(ctx);
  }

  if (unlockPromise) {
    return unlockPromise;
  }

  // Synchronous hardware audio wake: iOS Safari & Chrome Mobile require a bufferSource started directly in gesture
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Buffer fallback
  }

  unlockPromise = ctx
    .resume()
    .then(() => {
      isUnlocked = true;
      unlockPromise = null;
      return ctx;
    })
    .catch(() => {
      unlockPromise = null;
      return ctx;
    });

  return unlockPromise;
}

/**
 * Attaches passive global listeners on the first user interaction to unlock the audio pipeline.
 */
export function initUserInteractionAudioUnlock(onUnlocked?: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleInteraction = () => {
    unlockAudioContext().then(() => {
      if (globalAudioCtx && globalAudioCtx.state === 'running') {
        if (onUnlocked) onUnlocked();
        removeListeners();
      }
    });
  };

  const removeListeners = () => {
    window.removeEventListener('touchstart', handleInteraction, true);
    window.removeEventListener('touchend', handleInteraction, true);
    window.removeEventListener('touchmove', handleInteraction, true);
    window.removeEventListener('pointerdown', handleInteraction, true);
    window.removeEventListener('pointermove', handleInteraction, true);
    window.removeEventListener('mousedown', handleInteraction, true);
    window.removeEventListener('click', handleInteraction, true);
    window.removeEventListener('keydown', handleInteraction, true);
    window.removeEventListener('wheel', handleInteraction, true);
    document.removeEventListener('touchstart', handleInteraction, true);
    document.removeEventListener('pointerdown', handleInteraction, true);
  };

  const captureOpts = { capture: true, passive: true };
  window.addEventListener('touchstart', handleInteraction, captureOpts);
  window.addEventListener('touchend', handleInteraction, captureOpts);
  window.addEventListener('touchmove', handleInteraction, captureOpts);
  window.addEventListener('pointerdown', handleInteraction, captureOpts);
  window.addEventListener('pointermove', handleInteraction, captureOpts);
  window.addEventListener('mousedown', handleInteraction, captureOpts);
  window.addEventListener('click', handleInteraction, captureOpts);
  window.addEventListener('keydown', handleInteraction, captureOpts);
  window.addEventListener('wheel', handleInteraction, captureOpts);
  document.addEventListener('touchstart', handleInteraction, captureOpts);
  document.addEventListener('pointerdown', handleInteraction, captureOpts);

  // Focus and visibility restoration
  const handleVisibility = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      unlockAudioContext();
    }
  };

  window.addEventListener('focus', handleVisibility);
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    removeListeners();
    window.removeEventListener('focus', handleVisibility);
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}
