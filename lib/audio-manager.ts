// Universal Web Audio Singleton & Interaction Auto-Unlocker
// Bypasses browser autoplay policies on first touch/click, forces auto-play activation,
// and ensures audio state persists across page sessions & refreshes.

let globalAudioCtx: AudioContext | null = null;
let isAudioEngineUnlocked = false;

const STORAGE_KEY_MUTED = 'delsm_dial_is_muted';
const STORAGE_KEY_THEME = 'delsm_dial_sound_theme';

// Silent 44.1kHz 1-sample WAV Data URI for unlocking HTML5 media playback hardware
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';

let fallbackAudioElement: HTMLAudioElement | null = null;

export function getStoredMuteState(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const val = localStorage.getItem(STORAGE_KEY_MUTED);
    // Explicitly check for 'true'. If unset or anything else, default is FALSE (Sound Active)
    return val === 'true';
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
      try {
        globalAudioCtx = new AudioCtx({ latencyHint: 'interactive' });
      } catch {
        globalAudioCtx = new AudioCtx();
      }
    }
  }

  return globalAudioCtx;
}

/**
 * Synchronously plays an inaudible audio buffer to wake the hardware DAC on iOS WebKit & Android Chrome.
 */
export function wakeAudioHardware(ctx: AudioContext): void {
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // Ignore hardware buffer start errors
  }
}

/**
 * Plays a silent HTML5 Audio element to unlock the device media pipeline (dual WebAudio + HTML5 unlock).
 */
export function unlockMediaElement(): void {
  if (typeof window === 'undefined') return;
  try {
    if (!fallbackAudioElement) {
      fallbackAudioElement = new Audio(SILENT_WAV_DATA_URI);
      fallbackAudioElement.volume = 0.01;
      fallbackAudioElement.preload = 'auto';
    }
    const playPromise = fallbackAudioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (fallbackAudioElement) {
            fallbackAudioElement.pause();
            fallbackAudioElement.currentTime = 0;
          }
        })
        .catch(() => {
          // Autoplay policy handled on next user gesture
        });
    }
  } catch {
    // Safe boundary
  }
}

/**
 * Forces Web Audio to initialize and unlock synchronously during any user interaction event.
 * Re-invokes resume() directly on the gesture call stack without getting blocked by stale promises.
 */
export function unlockAudioContext(): Promise<AudioContext | null> {
  const ctx = getSharedAudioContext();
  if (!ctx) return Promise.resolve(null);

  // Wake hardware synchronously in the current gesture callstack
  wakeAudioHardware(ctx);
  unlockMediaElement();

  if (ctx.state === 'running') {
    isAudioEngineUnlocked = true;
    return Promise.resolve(ctx);
  }

  // Directly call resume() synchronously on the context
  return ctx
    .resume()
    .then(() => {
      isAudioEngineUnlocked = true;
      wakeAudioHardware(ctx);
      return ctx;
    })
    .catch(() => {
      return ctx;
    });
}

/**
 * Automatically cycles mute/unmute to force the browser audio subsystem to activate
 * on launch, refresh, and first user interaction.
 */
export function forceAutoPlayOrMuteUnmuteCycle(onActivated?: () => void): void {
  if (typeof window === 'undefined') return;

  const isUserExplicitlyMuted = getStoredMuteState();

  // 1. Instantly wake the Web Audio context & HTML5 audio pipeline
  const ctx = getSharedAudioContext();
  if (ctx) {
    wakeAudioHardware(ctx);
    if (ctx.state !== 'running') {
      ctx.resume().catch(() => {});
    }
  }
  unlockMediaElement();

  // 2. If user hasn't explicitly muted, ensure persistent state is active (unmuted)
  if (!isUserExplicitlyMuted) {
    setStoredMuteState(false);
    isAudioEngineUnlocked = true;
    if (onActivated) {
      onActivated();
    }
  }
}

/**
 * Attaches high-priority capturing event listeners on all primary user interactions
 * (touch, pointer, click, keydown, wheel, scroll) to force audio initialization immediately
 * on the first user interaction, bypassing mobile autoplay restrictions.
 */
export function initUserInteractionAudioUnlock(onUnlocked?: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // Eagerly try to wake on initialization
  forceAutoPlayOrMuteUnmuteCycle(onUnlocked);

  let hasTriggered = false;

  const handleInteraction = () => {
    // Synchronously unlock and resume on every gesture
    unlockAudioContext().then((ctx) => {
      if (ctx && ctx.state === 'running') {
        isAudioEngineUnlocked = true;
        if (!hasTriggered && onUnlocked) {
          hasTriggered = true;
          onUnlocked();
        }
      }
    });
  };

  const removeListeners = () => {
    const events = [
      'touchstart',
      'touchend',
      'touchmove',
      'pointerdown',
      'pointerup',
      'pointermove',
      'mousedown',
      'mouseup',
      'click',
      'keydown',
      'wheel',
      'scroll',
    ];

    events.forEach((evt) => {
      window.removeEventListener(evt, handleInteraction, true);
      document.removeEventListener(evt, handleInteraction, true);
      if (document.body) {
        document.body.removeEventListener(evt, handleInteraction, true);
      }
    });
  };

  const captureOpts: AddEventListenerOptions = { capture: true, passive: true };
  const events = [
    'touchstart',
    'touchend',
    'touchmove',
    'pointerdown',
    'pointerup',
    'pointermove',
    'mousedown',
    'mouseup',
    'click',
    'keydown',
    'wheel',
    'scroll',
  ];

  events.forEach((evt) => {
    window.addEventListener(evt, handleInteraction, captureOpts);
    document.addEventListener(evt, handleInteraction, captureOpts);
    if (document.body) {
      document.body.addEventListener(evt, handleInteraction, captureOpts);
    }
  });

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
