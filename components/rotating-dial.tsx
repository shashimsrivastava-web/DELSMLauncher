'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronRight, ArrowLeft, Clock, Search, X, Layers, Volume2, VolumeX } from 'lucide-react';

export type LinkItemType = 'link' | 'dial' | 'disabled' | 'back';
export type DialKey = 'main' | 'dgr' | 'ops' | 'll';

export interface DialLinkItem {
  id: string;
  title: string;
  url?: string;
  domain: string;
  category: string;
  type: LinkItemType;
  targetDial?: DialKey;
  subtitle?: string;
  sourceDialKey?: DialKey;
  sourceDialTitle?: string;
}

// 1. MAIN LANDING PAGE LINKS (Exactly as requested)
const MAIN_LINKS: DialLinkItem[] = [
  {
    id: 'checklists',
    title: 'Checklists App',
    url: 'https://delsm-checklists.vercel.app/',
    domain: 'delsm-checklists.vercel.app',
    category: 'Verification',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'devices-inventory',
    title: 'Devices Inventory App',
    url: 'https://assets-inventory-delsm.vercel.app/',
    domain: 'assets-inventory-delsm.vercel.app',
    category: 'Asset Management',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'packman-dg',
    title: 'Packman DG App',
    url: 'http://packmandg.lufthansa-group.com/',
    domain: 'packmandg.lufthansa-group.com',
    category: 'Dangerous Goods',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'dgr-videos-page',
    title: 'DGR Videos Page',
    subtitle: 'Open DGR Videos & Training Dial',
    domain: 'DGR Videos & Training Page',
    category: 'Training Dial',
    type: 'dial',
    targetDial: 'dgr',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'read-and-sign',
    title: 'Read and Sign App',
    subtitle: 'COMING SOON – No Link',
    domain: 'COMING SOON – No Link',
    category: 'Compliance',
    type: 'disabled',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'ops-page',
    title: 'OPS Page',
    subtitle: 'Open OPS Dial',
    domain: 'Flight & Ground OPS',
    category: 'Operations Dial',
    type: 'dial',
    targetDial: 'ops',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'look',
    title: 'LOOK',
    url: 'https://look.lufthansa-group.com/content/ng.html/dashboard',
    domain: 'look.lufthansa-group.com',
    category: 'LHG Dashboard',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'roster-x',
    title: 'Roster X App',
    url: 'https://rosterx-frontend.pages.dev/',
    domain: 'rosterx-frontend.pages.dev',
    category: 'Roster & Shifts',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'stock-x',
    title: 'STOCK X App',
    url: 'https://lhgstockportal-rgb.github.io/lhg-stock-portal/index.html',
    domain: 'lhgstockportal-rgb.github.io',
    category: 'Station Stock',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'll-page',
    title: 'LL Page',
    subtitle: 'Open LL Dial',
    domain: 'Lost & Luggage / LL Page',
    category: 'Baggage & LL Dial',
    type: 'dial',
    targetDial: 'll',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'daa-procedure',
    title: 'DAA procedure - YouTube',
    url: 'https://youtu.be/w3ZMblJi6wQ?si=wtY-AbF4CvFLUWQm',
    domain: 'youtu.be',
    category: 'Standard Operating Procedure',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
  {
    id: 'lhg-ops-expert',
    title: 'LHG Ops Expert',
    url: 'https://gemini.google.com/gem/1KqT7vrzJax38k7Z-lK0wXtqKlecq7Dd_?usp=sharing',
    domain: 'gemini.google.com',
    category: 'AI Operational Intelligence',
    type: 'link',
    sourceDialKey: 'main',
    sourceDialTitle: 'Main Landing Page',
  },
];

// 2. DGR VIDEOS AND TRAINING PAGE DIAL
const DGR_LINKS: DialLinkItem[] = [
  {
    id: 'dgr-packman-app',
    title: 'Packman DG App',
    url: 'http://packmandg.lufthansa-group.com/',
    domain: 'packmandg.lufthansa-group.com',
    category: 'Dangerous Goods App',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-easa',
    title: 'EASA: lithium batteries and other dangerous goods - YouTube',
    url: 'https://youtu.be/pwwdH_wNEeo?si=u3chcg2aTNmxNTpM',
    domain: 'youtu.be',
    category: 'Aviation Safety Video',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-lhg-short-info',
    title: 'Lit Bat in Pax Baggage - LHG Short Info',
    url: 'https://youtu.be/DlpZTktne-o?si=kK65wQGEMbrKqn6s',
    domain: 'youtu.be',
    category: 'Passenger Baggage Training',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-ped-smartbag',
    title: 'Lit bat and hidden DG - Check your knowledge',
    url: 'https://youtu.be/Or_y7V5lrLQ?si=Oa9cT60kjTzG1PjP',
    domain: 'youtu.be',
    category: 'Knowledge Check Video',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-lithium-hidden',
    title: 'PED and Smartbag – Check your knowledge',
    url: 'https://youtu.be/JzmP9MvKvi0?si=ODqChAwsL9lauZeq',
    domain: 'youtu.be',
    category: 'Knowledge Check Video',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-operator-approval',
    title: 'Approval of the Operator - YouTube',
    url: 'https://youtu.be/9ONqy4YPf_g?si=Ugp5Q_G22noef4MV',
    domain: 'youtu.be',
    category: 'Dangerous Goods Procedure',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-wheelchair',
    title: 'Unnotified wheelchair pax - Check your Knowledge',
    url: 'https://youtu.be/gF3kISCtxXA?si=7ZLJjNPpqLwbBnT_',
    domain: 'youtu.be',
    category: 'Knowledge Check Video',
    type: 'link',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
  {
    id: 'dgr-back-to-main',
    title: 'Back to Main DIAL',
    domain: 'Navigate to main DIAL',
    category: 'Navigation',
    type: 'back',
    targetDial: 'main',
    sourceDialKey: 'dgr',
    sourceDialTitle: 'DGR Videos and Training Page DIAL',
  },
];

// 3. OPS PAGE DIAL
const OPS_LINKS: DialLinkItem[] = [
  {
    id: 'ops-ramp-safety',
    title: 'Ramp Safety Film',
    url: 'https://youtu.be/uPpvNbSr5gk?si=NSrjtqx4QgkSrepc',
    domain: 'youtu.be',
    category: 'Safety Video',
    type: 'link',
    sourceDialKey: 'ops',
    sourceDialTitle: 'OPS Page DIAL',
  },
  {
    id: 'ops-read-and-sign',
    title: 'Read and Sign for AHD/AHI App (Under Construction)',
    subtitle: 'Under Construction – N/A',
    domain: 'Under Construction',
    category: 'AHD / AHI Compliance',
    type: 'disabled',
    sourceDialKey: 'ops',
    sourceDialTitle: 'OPS Page DIAL',
  },
  {
    id: 'ops-back-to-main',
    title: 'Back to Main Page',
    domain: 'Back to Main DIAL',
    category: 'Navigation',
    type: 'back',
    targetDial: 'main',
    sourceDialKey: 'ops',
    sourceDialTitle: 'OPS Page DIAL',
  },
];

// 4. LL PAGE DIAL
const LL_LINKS: DialLinkItem[] = [
  {
    id: 'll-worldtracer',
    title: 'WorldTracer',
    url: 'https://desktop.worldtracer.aero/desktop/lhwtweb.html',
    domain: 'desktop.worldtracer.aero',
    category: 'Baggage Tracing',
    type: 'link',
    sourceDialKey: 'll',
    sourceDialTitle: 'LL Page DIAL',
  },
  {
    id: 'll-star-alliance-hub',
    title: 'Star Alliance Baggage HUB',
    url: 'https://lhbaghub.staralliance.com/baghub-dashboard/',
    domain: 'lhbaghub.staralliance.com',
    category: 'Alliance Baggage Hub',
    type: 'link',
    sourceDialKey: 'll',
    sourceDialTitle: 'LL Page DIAL',
  },
  {
    id: 'll-baggage-tracker',
    title: 'Baggage Tracker App (Under Construction)',
    subtitle: 'Under Construction – N/A',
    domain: 'Under Construction',
    category: 'Tracking App',
    type: 'disabled',
    sourceDialKey: 'll',
    sourceDialTitle: 'LL Page DIAL',
  },
  {
    id: 'll-back-to-main',
    title: 'Back to Main Page',
    domain: 'Back to Main DIAL',
    category: 'Navigation',
    type: 'back',
    targetDial: 'main',
    sourceDialKey: 'll',
    sourceDialTitle: 'LL Page DIAL',
  },
];

const DIAL_DATA: Record<
  DialKey,
  { title: string; links: DialLinkItem[] }
> = {
  main: {
    title: 'Main Navigation Dial',
    links: MAIN_LINKS,
  },
  dgr: {
    title: 'DGR Videos and Training Page DIAL',
    links: DGR_LINKS,
  },
  ops: {
    title: 'OPS Page DIAL',
    links: OPS_LINKS,
  },
  ll: {
    title: 'LL Page DIAL',
    links: LL_LINKS,
  },
};

// All search-eligible unique items across all dials (excluding back buttons)
const ALL_SEARCHABLE_ITEMS: DialLinkItem[] = [
  ...MAIN_LINKS.filter((item) => item.type !== 'back'),
  ...DGR_LINKS.filter((item) => item.type !== 'back'),
  ...OPS_LINKS.filter((item) => item.type !== 'back'),
  ...LL_LINKS.filter((item) => item.type !== 'back'),
];

// Helper: Levenshtein distance for fuzzy typo handling
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Helper: Calculate fuzzy matching score
function calculateFuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase().trim();
  if (!q || !t) return 0;

  // Exact match
  if (t === q) return 1000;

  // Prefix match
  if (t.startsWith(q)) return 500 + Math.max(0, 100 - t.length);

  // Word boundary match (e.g. " ops", " dgr", " safety")
  const wordBoundaryIdx = t.indexOf(' ' + q);
  if (wordBoundaryIdx !== -1) return 400 + Math.max(0, 100 - wordBoundaryIdx);

  // Substring match
  const subIdx = t.indexOf(q);
  if (subIdx !== -1) return 300 + Math.max(0, 100 - subIdx);

  // Acronym match (e.g., "dgr", "ped", "sop", "wt")
  const words = t.split(/[\s\-_\/]+/);
  const acronym = words.map((w) => w[0]).join('');
  if (acronym.includes(q)) return 260;

  // In-order character sequence
  let qIdx = 0;
  let score = 0;
  let consecutive = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) {
      qIdx++;
      consecutive++;
      score += 15 + consecutive * 8;
    } else {
      consecutive = 0;
    }
  }
  if (qIdx === q.length) {
    return Math.max(score, 60);
  }

  // Nearest match for typos if query is at least 3 characters
  if (q.length >= 3) {
    // Check against whole text or individual words
    for (const word of words) {
      if (Math.abs(word.length - q.length) <= 2) {
        const dist = levenshteinDistance(q, word);
        if (dist <= 2) {
          return 120 - dist * 35;
        }
      }
    }
  }

  return 0;
}

interface SlotConfig {
  y: number;
  z: number;
  rotateX: number;
  scale: number;
  opacity: number;
  isForefront: boolean;
  isCenter: boolean;
  boxShadow: string;
  shadowOverlayOpacity: number;
}

const SLOT_CONFIGS: Record<number, SlotConfig> = {
  [-2]: {
    y: -360,
    z: -210,
    rotateX: 58,
    scale: 0.68,
    opacity: 0,
    isForefront: false,
    isCenter: false,
    boxShadow: '0 32px 64px -12px rgba(0,0,0,0.92), 0 0 40px rgba(0,0,0,0.85)',
    shadowOverlayOpacity: 0.65,
  },
  [-1]: {
    y: -235,
    z: -125,
    rotateX: 42,
    scale: 0.80,
    opacity: 0.32,
    isForefront: true,
    isCenter: false,
    boxShadow: '0 24px 52px -8px rgba(0,0,0,0.88), 0 12px 28px rgba(0,0,0,0.7)',
    shadowOverlayOpacity: 0.45,
  },
  [0]: {
    y: -140,
    z: -55,
    rotateX: 24,
    scale: 0.90,
    opacity: 0.68,
    isForefront: true,
    isCenter: false,
    boxShadow: '0 16px 40px -6px rgba(0,0,0,0.75), 0 8px 18px rgba(0,0,0,0.5)',
    shadowOverlayOpacity: 0.22,
  },
  [1]: {
    y: -46,
    z: 22,
    rotateX: 7,
    scale: 1.04,
    opacity: 1.0,
    isForefront: true,
    isCenter: true,
    boxShadow: '0 10px 32px -4px rgba(0,0,0,0.55), 0 0 28px rgba(56,189,248,0.22)',
    shadowOverlayOpacity: 0,
  },
  [2]: {
    y: 46,
    z: 22,
    rotateX: -7,
    scale: 1.04,
    opacity: 1.0,
    isForefront: true,
    isCenter: true,
    boxShadow: '0 10px 32px -4px rgba(0,0,0,0.55), 0 0 28px rgba(56,189,248,0.22)',
    shadowOverlayOpacity: 0,
  },
  [3]: {
    y: 140,
    z: -55,
    rotateX: -24,
    scale: 0.90,
    opacity: 0.68,
    isForefront: true,
    isCenter: false,
    boxShadow: '0 -16px 40px -6px rgba(0,0,0,0.75), 0 -8px 18px rgba(0,0,0,0.5)',
    shadowOverlayOpacity: 0.22,
  },
  [4]: {
    y: 235,
    z: -125,
    rotateX: -42,
    scale: 0.80,
    opacity: 0.32,
    isForefront: true,
    isCenter: false,
    boxShadow: '0 -24px 52px -8px rgba(0,0,0,0.88), 0 -12px 28px rgba(0,0,0,0.7)',
    shadowOverlayOpacity: 0.45,
  },
  [5]: {
    y: 360,
    z: -210,
    rotateX: -58,
    scale: 0.68,
    opacity: 0,
    isForefront: false,
    isCenter: false,
    boxShadow: '0 -32px 64px -12px rgba(0,0,0,0.92), 0 0 40px rgba(0,0,0,0.85)',
    shadowOverlayOpacity: 0.65,
  },
};

export default function RotatingDial() {
  const [activeDialKey, setActiveDialKey] = useState<DialKey>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [step, setStep] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Enabled by default on app launch
  const [hasInteractedSound, setHasInteractedSound] = useState(false); // Controls launch prompt visibility

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  // Web Audio Context for authentic mechanical dial clicks
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Subtle mobile haptic vibration feedback on snap or item click
  const triggerHapticFeedback = useCallback((pattern: number | number[] = 14) => {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
        navigator.vibrate(pattern);
      }
    } catch {
      // Haptics not supported or blocked by browser policy
    }
  }, []);

  // Dedicated helper to instantiate and fully wake audio engine on mobile
  const ensureAudioUnlocked = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // iOS Safari requires playing a tiny silent buffer inside a user gesture event to fully activate output
      const silentBuffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // Ignore
    }
  }, []);

  // Unlock audio context eagerly on the very first touch/click/pointer interaction
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      ensureAudioUnlocked();
    };

    // Capture on all initial touch/click vectors across window and document
    const options = { capture: true, passive: true };
    window.addEventListener('touchstart', handleFirstUserInteraction, options);
    window.addEventListener('touchend', handleFirstUserInteraction, options);
    window.addEventListener('pointerdown', handleFirstUserInteraction, options);
    window.addEventListener('click', handleFirstUserInteraction, options);
    window.addEventListener('keydown', handleFirstUserInteraction, options);

    return () => {
      window.removeEventListener('touchstart', handleFirstUserInteraction, options);
      window.removeEventListener('touchend', handleFirstUserInteraction, options);
      window.removeEventListener('pointerdown', handleFirstUserInteraction, options);
      window.removeEventListener('click', handleFirstUserInteraction, options);
      window.removeEventListener('keydown', handleFirstUserInteraction, options);
    };
  }, [ensureAudioUnlocked]);

  // Play realistic mechanical dial click sound with HIGH volume output
  const playMechanicalClick = useCallback((direction: 'up' | 'down' = 'down') => {
    // Fire haptic vibration synchronously on snap
    triggerHapticFeedback();

    if (isMuted) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;

      // Always ensure state is resumed (critical for iOS Safari and Android Chrome)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;

      // Master output volume set to HIGH (0.92)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.92, now);
      masterGain.connect(ctx.destination);

      // 1. Mechanical metallic "snap" transient oscillator (loud crisp impact)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Slightly different pitch for up vs down rotation, mimicking ratchet teeth
      const baseFreq = direction === 'down' ? 1480 : 1720;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.042);

      // High volume envelope for prominent mechanical presence
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.58, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      // 2. High-frequency friction noise burst (mechanical detent friction)
      const bufferSize = Math.floor(ctx.sampleRate * 0.026);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(2600, now);
      noiseFilter.Q.setValueAtTime(2.8, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.42, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

      // 3. Low-frequency hollow body resonance (heavy rotary drum chassis)
      const lowOsc = ctx.createOscillator();
      const lowGain = ctx.createGain();
      lowOsc.type = 'sine';
      lowOsc.frequency.setValueAtTime(220, now);
      lowOsc.frequency.exponentialRampToValueAtTime(50, now + 0.06);

      lowGain.gain.setValueAtTime(0.35, now);
      lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      // Connect components into masterGain
      osc.connect(gain);
      gain.connect(masterGain);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);

      lowOsc.connect(lowGain);
      lowGain.connect(masterGain);

      osc.start(now);
      whiteNoise.start(now);
      lowOsc.start(now);

      osc.stop(now + 0.045);
      whiteNoise.stop(now + 0.028);
      lowOsc.stop(now + 0.065);
    } catch {
      // Audio autoplay or permissions handled gracefully
    }
  }, [isMuted, triggerHapticFeedback]);

  // Explicit user activation from the top-right loudspeaker button
  const handleLoudspeakerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setHasInteractedSound(true);

      if (isMuted) {
        // Unmute and immediately wake audio engine
        ensureAudioUnlocked();
        setIsMuted(false);
        showToast('Mechanical Dial Sound: ON 🔊');
        // Play an immediate sample click so the user immediately hears it working
        setTimeout(() => {
          playMechanicalClick('down');
        }, 50);
      } else {
        // Mute (clicking twice/toggling off)
        setIsMuted(true);
        showToast('Mechanical Dial Sound: MUTED 🔇 (Click again to turn ON)');
      }
    },
    [isMuted, ensureAudioUnlocked, playMechanicalClick, showToast]
  );

  // Interaction tracking for smooth, controlled drag, momentum glide, and wheel
  const isPointerDown = useRef(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const dragAccumulator = useRef(0);
  const lastStepTime = useRef(0);
  const hasDragged = useRef(false);
  const lastWheelTime = useRef(0);
  const wheelAccumulator = useRef(0);

  // Velocity tracking and physics-based inertia deceleration animation
  const recentDeltas = useRef<{ dy: number; time: number }[]>([]);
  const momentumRafId = useRef<number | null>(null);
  const isDecelerating = useRef(false);

  const clearMomentum = useCallback(() => {
    if (momentumRafId.current !== null) {
      cancelAnimationFrame(momentumRafId.current);
      momentumRafId.current = null;
    }
    isDecelerating.current = false;
  }, []);

  const isSearchActive = searchQuery.trim().length > 0;

  // Filter links through fuzzy scoring
  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];

    const scored = ALL_SEARCHABLE_ITEMS.map((item) => {
      const titleScore = calculateFuzzyScore(q, item.title) * 2.0;
      const domainScore = calculateFuzzyScore(q, item.domain) * 1.2;
      const catScore = calculateFuzzyScore(q, item.category) * 1.5;
      const dialScore = calculateFuzzyScore(q, item.sourceDialTitle || '') * 1.1;
      const subScore = item.subtitle ? calculateFuzzyScore(q, item.subtitle) * 1.2 : 0;

      const maxScore = Math.max(titleScore, domainScore, catScore, dialScore, subScore);
      return { item, score: maxScore };
    });

    const matches = scored
      .filter((entry) => entry.score > 40)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);

    // Deduplicate items if identical url/id appears in multiple places
    const seen = new Set<string>();
    const uniqueMatches: DialLinkItem[] = [];
    for (const match of matches) {
      if (!seen.has(match.id)) {
        seen.add(match.id);
        uniqueMatches.push(match);
      }
    }

    return uniqueMatches;
  }, [searchQuery]);

  // Options to return to various DIALs
  const returnDialOptions: DialLinkItem[] = useMemo(() => {
    return [
      {
        id: 'return-main',
        title: 'Return to Main DIAL',
        domain: 'Landing Page Navigation',
        category: 'Page Navigation',
        type: 'back',
        targetDial: 'main',
      },
      {
        id: 'return-ops',
        title: 'Go to OPS Page DIAL',
        domain: 'Flight & Ground Operations',
        category: 'Page Navigation',
        type: 'dial',
        targetDial: 'ops',
      },
      {
        id: 'return-dgr',
        title: 'Go to DGR Videos & Training DIAL',
        domain: 'Dangerous Goods Training',
        category: 'Page Navigation',
        type: 'dial',
        targetDial: 'dgr',
      },
      {
        id: 'return-ll',
        title: 'Go to LL Page DIAL',
        domain: 'Baggage Tracing & Hub',
        category: 'Page Navigation',
        type: 'dial',
        targetDial: 'll',
      },
    ];
  }, []);

  // Compute final link list for current view (Search mode vs Normal Dial mode)
  const currentDial = DIAL_DATA[activeDialKey];
  const links = useMemo(() => {
    let list: DialLinkItem[] = [];

    if (isSearchActive) {
      if (searchResults.length > 0) {
        // Display matched search results + return options at the end
        list = [...searchResults, ...returnDialOptions];
      } else {
        // No matches found card + all return options
        list = [
          {
            id: 'no-match-card',
            title: `No matches found for "${searchQuery.trim()}"`,
            subtitle: 'Try a different search term or return to a DIAL below',
            domain: 'Fuzzy Search: 0 Results',
            category: 'Search Result',
            type: 'disabled',
          },
          ...returnDialOptions,
        ];
      }
    } else {
      list = currentDial.links;
    }

    // Ensure at least 6 items for smooth 3D drum rotation loop
    if (list.length === 0) return list;
    while (list.length < 6) {
      const currentLength = list.length;
      list = [
        ...list,
        ...list.map((item, idx) => ({
          ...item,
          id: `${item.id}-cycle-${currentLength + idx}`,
        })),
      ];
    }
    return list;
  }, [isSearchActive, searchResults, returnDialOptions, currentDial.links, searchQuery]);

  const totalItems = links.length;

  const switchDial = useCallback((key: DialKey) => {
    clearMomentum();
    setActiveDialKey(key);
    setSearchQuery('');
    setStep(0);
  }, [clearMomentum]);

  const handleSearchChange = (val: string) => {
    clearMomentum();
    setSearchQuery(val);
    setStep(0);
  };

  const clearSearch = useCallback(() => {
    clearMomentum();
    setSearchQuery('');
    setStep(0);
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  }, [clearMomentum]);

  const rotateUp = useCallback(() => {
    playMechanicalClick('up');
    setStep((prev) => prev - 1);
  }, [playMechanicalClick]);

  const rotateDown = useCallback(() => {
    playMechanicalClick('down');
    setStep((prev) => prev + 1);
  }, [playMechanicalClick]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user presses Escape: clear search or return to main
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isSearchActive) {
          clearSearch();
        } else if (activeDialKey !== 'main') {
          switchDial('main');
        }
        return;
      }

      // If user is typing in the search input, do not rotate with arrow keys
      if (document.activeElement === searchInputRef.current) {
        return;
      }

      // Quick shortcut '/' to focus search bar
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'KeyS') {
        e.preventDefault();
        rotateDown();
      } else if (e.key === 'ArrowUp' || e.key === 'KeyW') {
        e.preventDefault();
        rotateUp();
      } else if (e.key === 'PageDown') {
        e.preventDefault();
        setStep((prev) => prev + 2);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        setStep((prev) => prev - 2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateDown, rotateUp, activeDialKey, switchDial, isSearchActive, clearSearch]);

  // Smooth wheel listener with generous threshold and cooldown
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();

      // Enforce a calm cooldown between wheel-triggered steps (320ms)
      if (now - lastStepTime.current < 320) return;

      wheelAccumulator.current += e.deltaY;

      if (Math.abs(wheelAccumulator.current) > 55) {
        if (wheelAccumulator.current > 0) {
          rotateDown();
        } else {
          rotateUp();
        }
        lastStepTime.current = now;
        wheelAccumulator.current = 0;
      }
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelEvent);
  }, [rotateDown, rotateUp]);

  // Unified, buttery-smooth pointer events with physical momentum glide
  const handlePointerDown = (e: React.PointerEvent) => {
    // Prime and wake mobile audio immediately on gesture
    ensureAudioUnlocked();

    // Ignore drag if clicking directly on input or button controls
    if ((e.target as HTMLElement).closest('input, button')) return;

    clearMomentum();
    isPointerDown.current = true;
    startY.current = e.clientY;
    lastY.current = e.clientY;
    dragAccumulator.current = 0;
    recentDeltas.current = [];
    hasDragged.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;

    const totalDelta = e.clientY - startY.current;
    const dy = e.clientY - lastY.current;
    lastY.current = e.clientY;

    if (Math.abs(totalDelta) > 8) {
      hasDragged.current = true;
    }

    const now = performance.now();
    // Maintain a rolling window of recent movement deltas for release velocity
    recentDeltas.current.push({ dy, time: now });
    if (recentDeltas.current.length > 5) {
      recentDeltas.current.shift();
    }

    dragAccumulator.current += dy;

    // Natural, calm rotation threshold (55px movement per step)
    // with a minimum 260ms cooldown to eliminate rapid stutter/shaking
    const ROTATE_THRESHOLD = 55;
    const STEP_COOLDOWN = 260;

    if (
      Math.abs(dragAccumulator.current) >= ROTATE_THRESHOLD &&
      now - lastStepTime.current > STEP_COOLDOWN
    ) {
      if (dragAccumulator.current < 0) {
        rotateDown();
      } else {
        rotateUp();
      }
      lastStepTime.current = now;
      dragAccumulator.current = 0;
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    // Calculate release velocity from the last 120ms of movement
    const now = performance.now();
    const validDeltas = recentDeltas.current.filter((d) => now - d.time < 120);

    let releaseVelocity = 0; // pixels per ms
    if (validDeltas.length >= 2) {
      const sumDy = validDeltas.reduce((acc, cur) => acc + cur.dy, 0);
      const timeSpan = Math.max(1, validDeltas[validDeltas.length - 1].time - validDeltas[0].time);
      releaseVelocity = sumDy / timeSpan;
    }

    // Physical inertia deceleration:
    // If released with velocity, the rotating dial continues to coast forward in that direction
    // under heavy rotational friction (0.91 per frame) until it smoothly settles into the ratchet detent.
    const absVel = Math.abs(releaseVelocity);
    if (absVel > 0.28) {
      isDecelerating.current = true;
      let currentVelocity = releaseVelocity;
      let accumulatedDistance = 0;
      let lastFrameTime = performance.now();
      const DISTANCE_PER_DETENT = 58; // Physical step threshold
      const FRICTION = 0.905; // Natural rotary cylinder friction coefficient

      const stepDeceleration = (currentTime: number) => {
        const dt = Math.min(32, Math.max(8, currentTime - lastFrameTime));
        lastFrameTime = currentTime;

        // Apply friction decay scaled by frame delta
        currentVelocity *= Math.pow(FRICTION, dt / 16.67);
        accumulatedDistance += currentVelocity * dt;

        // Trigger detent click step whenever accumulated distance crosses threshold
        if (Math.abs(accumulatedDistance) >= DISTANCE_PER_DETENT) {
          if (accumulatedDistance < 0) {
            rotateDown();
            accumulatedDistance += DISTANCE_PER_DETENT;
          } else {
            rotateUp();
            accumulatedDistance -= DISTANCE_PER_DETENT;
          }
        }

        // Continue coasting until velocity falls below tactile threshold
        if (Math.abs(currentVelocity) > 0.08) {
          momentumRafId.current = requestAnimationFrame(stepDeceleration);
        } else {
          // Final slight nudge if lingering past halfway detent mark
          if (Math.abs(accumulatedDistance) > DISTANCE_PER_DETENT * 0.45) {
            if (accumulatedDistance < 0) {
              rotateDown();
            } else {
              rotateUp();
            }
          }
          isDecelerating.current = false;
          momentumRafId.current = null;
        }
      };

      momentumRafId.current = requestAnimationFrame(stepDeceleration);
    }

    dragAccumulator.current = 0;
    recentDeltas.current = [];
    setTimeout(() => {
      hasDragged.current = false;
    }, 140);
  };

  const handleAction = (item: DialLinkItem, slotOffset: number, e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Tap to center: If a user taps on an upper (slotOffset < 1) or lower (slotOffset > 2) visible card,
    // rotate the dial to bring that item into center focus
    if (slotOffset === -1) {
      e.preventDefault();
      rotateUp();
      setTimeout(() => rotateUp(), 200);
      return;
    }
    if (slotOffset === 0) {
      e.preventDefault();
      rotateUp();
      return;
    }
    if (slotOffset === 3) {
      e.preventDefault();
      rotateDown();
      return;
    }
    if (slotOffset === 4) {
      e.preventDefault();
      rotateDown();
      setTimeout(() => rotateDown(), 200);
      return;
    }

    if (item.type === 'disabled') {
      e.preventDefault();
      triggerHapticFeedback([10, 40, 10]); // Subtle double buzz for disabled / locked item
      showToast(`${item.title}: ${item.subtitle || 'Under Construction – No Link available at this time.'}`);
      return;
    }

    if (item.type === 'dial' && item.targetDial) {
      e.preventDefault();
      triggerHapticFeedback(22); // Satisfying tactile buzz for dial drill-down
      switchDial(item.targetDial);
      return;
    }

    if (item.type === 'back' && item.targetDial) {
      e.preventDefault();
      triggerHapticFeedback(18);
      switchDial(item.targetDial);
      return;
    }

    if (item.type === 'back') {
      e.preventDefault();
      triggerHapticFeedback(18);
      switchDial('main');
      return;
    }

    // Direct link opens natively via href & target="_blank"
    triggerHapticFeedback(25); // Confirmatory haptic pulse on link launch
  };

  const getItemTransformData = (index: number) => {
    const rawDiff = index - step;
    let d = ((rawDiff % totalItems) + totalItems) % totalItems;
    if (d > totalItems / 2) {
      d -= totalItems;
    }

    const config = SLOT_CONFIGS[d];

    if (config) {
      return {
        d,
        y: config.y,
        z: config.z,
        rotateX: config.rotateX,
        scale: config.scale,
        opacity: config.opacity,
        isForefront: config.isForefront,
        isCenter: config.isCenter,
        boxShadow: config.boxShadow,
        shadowOverlayOpacity: config.shadowOverlayOpacity,
        visible: true,
      };
    }

    const isAbove = d < 0;
    return {
      d,
      y: isAbove ? -450 : 450,
      z: -280,
      rotateX: isAbove ? 80 : -80,
      scale: 0.60,
      opacity: 0,
      isForefront: false,
      isCenter: false,
      boxShadow: '0 0 0 rgba(0,0,0,0)',
      shadowOverlayOpacity: 0.85,
      visible: false,
    };
  };

  return (
    <main
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      tabIndex={0}
      aria-label="3D Vertical Rotating Dial Menu. Use scroll, drag, or arrow keys to rotate."
      className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col items-center bg-[#07080c] select-none cursor-grab active:cursor-grabbing focus:outline-none touch-none"
    >
      {/* Prominent Floating Top-Right Loudspeaker Audio Controller */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-5 z-50 flex flex-col items-end pointer-events-auto">
        <button
          type="button"
          onClick={handleLoudspeakerClick}
          aria-label={!isMuted ? 'Sound active (ON). Click to mute mechanical dial audio' : 'Sound muted (OFF). Click to activate mechanical dial audio'}
          title={!isMuted ? 'Sound is ACTIVE (ON) — Click to mute' : 'Sound is MUTED (OFF) — Click to turn ON'}
          className={`relative group flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.7)] backdrop-blur-md border transition-all duration-200 cursor-pointer active:scale-95 ${
            !isMuted
              ? 'bg-gradient-to-br from-amber-500/25 via-amber-400/15 to-neutral-900/90 border-amber-400/70 shadow-[0_0_24px_rgba(245,158,11,0.4)] hover:border-amber-300 hover:shadow-[0_0_32px_rgba(245,158,11,0.55)]'
              : 'bg-neutral-900/90 border-red-500/30 text-neutral-400 hover:border-red-400/60 hover:text-white hover:bg-neutral-800 shadow-[0_0_16px_rgba(239,68,68,0.15)]'
          }`}
        >
          {/* Ambient wave pulse when sound is active */}
          {!isMuted && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl border-2 border-amber-400/50 animate-ping opacity-25 pointer-events-none"
            />
          )}

          {/* Sound State Icon */}
          <div className="flex items-center justify-center mb-0.5">
            {!isMuted ? (
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)] group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400 group-hover:scale-110 group-hover:text-red-300 transition-transform" />
            )}
          </div>

          {/* Clear Visual State Label Badge (ON / OFF) */}
          <span
            className={`text-[9px] sm:text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded-full border leading-tight transition-colors ${
              !isMuted
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                : 'bg-neutral-800 text-neutral-400 border-neutral-600'
            }`}
          >
            {!isMuted ? 'ON' : 'OFF'}
          </span>

          {/* Glowing Status Indicator Dot */}
          <span
            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-neutral-950 ${
              !isMuted
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : 'bg-red-500/80 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
            }`}
          />
        </button>

        {/* Floating Prompt Bar: Only shown when audio is MUTED */}
        {isMuted && (
          <div
            onClick={handleLoudspeakerClick}
            className="sound-prompt-pulse mt-2.5 max-w-[215px] sm:max-w-[245px] p-2.5 rounded-xl bg-neutral-900/95 border border-amber-400/50 shadow-[0_12px_28px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.2)] text-left cursor-pointer transition-all hover:border-amber-300"
          >
            <div className="flex items-start gap-2">
              <span className="text-base leading-none">🔊</span>
              <div>
                <p className="text-[11px] sm:text-xs font-semibold text-amber-300 leading-tight">
                  Tap to Activate Sound!
                </p>
                <p className="text-[10px] sm:text-[11px] text-neutral-300 leading-snug mt-0.5">
                  Sound is currently muted. Tap here or icon above to turn ON.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Header: Search Bar + Return to DIALs Controller + DELSM LaunchPad Banner */}
      <header className="z-30 w-[92vw] max-w-[540px] pt-2 sm:pt-4 pr-14 sm:pr-0 flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="relative w-full flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search all DIALs (e.g. Checklists, DGR, OPS, Ramp, Star, LL)..."
            className="w-full pl-10 pr-20 py-2 sm:py-2.5 rounded-xl bg-neutral-900/85 border border-white/20 text-neutral-100 placeholder-neutral-500 text-xs sm:text-sm font-medium tracking-tight shadow-xl backdrop-blur-md focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all touch-auto pointer-events-auto"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            {isSearchActive && (
              <button
                type="button"
                onClick={clearSearch}
                title="Clear search"
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white/5 rounded border border-white/10">
              /
            </kbd>
          </div>
        </div>

        {/* Quick Return to Any DIAL Options */}
        <div className="w-full flex items-center justify-between px-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-neutral-400 truncate">
            <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="text-neutral-500 shrink-0">DIAL:</span>
            <span className="text-neutral-200 font-medium truncate">
              {isSearchActive ? `Search (${searchResults.length} matches)` : currentDial.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Mechanical Audio Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              className={`p-1 mr-0.5 rounded transition-colors cursor-pointer ${
                !isMuted
                  ? 'text-amber-400 hover:text-amber-300 hover:bg-white/10'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/10'
              }`}
              title={isMuted ? 'Unmute mechanical dial sound' : 'Mute mechanical dial sound'}
              aria-label={isMuted ? 'Unmute dial sound' : 'Mute dial sound'}
            >
              {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <span className="text-neutral-600 hidden sm:inline mr-1">Switch:</span>
            {(['main', 'dgr', 'ops', 'll'] as DialKey[]).map((key) => {
              const isActive = activeDialKey === key && !isSearchActive;
              const labels: Record<DialKey, string> = {
                main: 'Main',
                dgr: 'DGR',
                ops: 'OPS',
                ll: 'LL',
              };

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchDial(key)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Open ${DIAL_DATA[key].title}`}
                >
                  {labels[key]}
                </button>
              );
            })}
          </div>
        </div>

        {/* DELSM LaunchPad App Banner (Inserted between search bar and 3D dial) */}
        <div
          onClick={() => {
            if (isSearchActive) clearSearch();
            if (activeDialKey !== 'main') switchDial('main');
          }}
          title="DELSM LaunchPad - Click to return to Main Dial"
          className="relative w-full h-[58px] sm:h-[72px] rounded-xl overflow-hidden border border-sky-400/25 hover:border-sky-300/50 shadow-[0_8px_28px_rgba(0,18,50,0.7),0_0_20px_rgba(14,165,233,0.12)] bg-[#07132a] flex items-center px-3.5 sm:px-4 shrink-0 transition-all cursor-pointer group select-none"
        >
          {/* Banner Graphic Background with smooth gradient fade */}
          <Image
            src="/delsm_banner.jpg"
            alt="DELSM LaunchPad Banner"
            fill
            sizes="(max-width: 768px) 92vw, 540px"
            priority
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75 group-hover:opacity-90 group-hover:scale-[1.015] transition-all duration-300 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Contrast enhancement overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061226]/95 via-[#081a36]/85 to-[#040e1e]/65 pointer-events-none" />

          {/* Banner Content Layout matching provided image */}
          <div className="relative z-10 flex items-center gap-3 sm:gap-4 w-full min-w-0">
            {/* DELSM LaunchPad Emblem SVG Badge */}
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full relative flex items-center justify-center p-0.5 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.45)]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id="emblemGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="60%" stopColor="#0b2347" />
                    <stop offset="100%" stopColor="#030d1a" />
                  </radialGradient>
                  <path id="textCircleTop" d="M 18,50 A 32,32 0 0,1 82,50" fill="none" />
                  <path id="textCircleBottom" d="M 82,50 A 32,32 0 0,1 18,50" fill="none" />
                </defs>
                <circle cx="50" cy="50" r="48" fill="#030e1e" stroke="#2563eb" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="44" fill="url(#emblemGlow)" stroke="#f59e0b" strokeWidth="1.2" />
                <text fill="#ffffff" fontSize="8" fontWeight="bold" letterSpacing="1.5" textAnchor="middle">
                  <textPath href="#textCircleTop" startOffset="50%">DELSM</textPath>
                </text>
                <text fill="#ffffff" fontSize="6.2" fontWeight="bold" letterSpacing="1" textAnchor="middle">
                  <textPath href="#textCircleBottom" startOffset="50%">LAUNCHPAD</textPath>
                </text>
                <circle cx="50" cy="50" r="32" fill="#08182f" stroke="#1d4ed8" strokeWidth="1" />
                <path d="M 28 66 L 72 26 A 32 32 0 0 1 68 74 L 28 66 Z" fill="#f59e0b" opacity="0.92" />
                <g fill="#f59e0b" opacity="0.9">
                  <rect x="33" y="32" width="4.5" height="4.5" rx="1" transform="rotate(-30 35 34)" />
                  <rect x="42" y="27" width="4.5" height="4.5" rx="1" transform="rotate(-30 44 29)" />
                  <rect x="30" y="41" width="4.5" height="4.5" rx="1" transform="rotate(-30 32 43)" />
                  <rect x="39" y="36" width="4.5" height="4.5" rx="1" transform="rotate(-30 41 38)" />
                </g>
                <g fill="#08182f" opacity="0.9">
                  <rect x="52" y="55" width="4.5" height="4.5" rx="1" transform="rotate(-30 54 57)" />
                  <rect x="61" y="50" width="4.5" height="4.5" rx="1" transform="rotate(-30 63 52)" />
                  <rect x="56" y="64" width="4.5" height="4.5" rx="1" transform="rotate(-30 58 66)" />
                </g>
                <path
                  d="M 43 68 L 56 36 L 50 36 L 68 24 L 68 44 L 62 38 L 49 70 Z"
                  fill="#fbbf24"
                  stroke="#030e1e"
                  strokeWidth="1.2"
                />
              </svg>
            </div>

            {/* Banner Titles Matching the User Image */}
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-2">
                <h1 className="text-white font-black text-sm sm:text-xl tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  DELSM LaunchPad
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Lufthansa Group
                </span>
              </div>
              <p className="text-sky-200/90 text-[10.5px] sm:text-[13px] font-medium tracking-tight truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] mt-0.5">
                DELSM Apps Drawer and important Links
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 3D Scene Viewport */}
      <div
        className="relative w-full max-w-[560px] flex-1 flex items-center justify-center -mt-1 sm:-mt-2 overflow-visible"
        style={{
          perspective: '1100px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* Dial Cylinder Container */}
        <div
          className="relative w-full h-full min-h-[560px] flex items-center justify-center"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {links.map((item, index) => {
            const data = getItemTransformData(index);
            const isClickable = item.type !== 'disabled';
            const isReturnItem = item.type === 'back';

            return (
              <a
                key={item.id}
                href={item.url || '#'}
                target={item.url ? '_blank' : undefined}
                rel={item.url ? 'noopener noreferrer' : undefined}
                tabIndex={data.isForefront ? 0 : -1}
                aria-hidden={!data.isForefront}
                aria-label={`${item.title} (${item.domain})`}
                onClick={(e) => handleAction(item, data.d, e)}
                style={{
                  transform: `translate3d(0, ${data.y}px, ${data.z}px) rotateX(${data.rotateX}deg) scale(${data.scale})`,
                  opacity: data.opacity,
                  boxShadow: data.boxShadow,
                  filter: data.isCenter
                    ? 'none'
                    : `drop-shadow(0 ${data.d < 0 ? '16px' : '-16px'} 20px rgba(0,0,0,0.65))`,
                  pointerEvents: data.isForefront ? 'auto' : 'none',
                  visibility: data.visible ? 'visible' : 'hidden',
                  willChange: 'transform, opacity, box-shadow, filter',
                  transition:
                    'transform 580ms cubic-bezier(0.2, 0.95, 0.35, 1), opacity 500ms cubic-bezier(0.2, 0.95, 0.35, 1), box-shadow 580ms cubic-bezier(0.2, 0.95, 0.35, 1), filter 580ms cubic-bezier(0.2, 0.95, 0.35, 1), background-color 200ms ease, border-color 200ms ease',
                }}
                className={`absolute w-[88vw] max-w-[460px] h-[78px] px-6 py-3.5 rounded-xl flex items-center justify-between group transition-all outline-none touch-manipulation active:scale-[0.98] ${
                  !isClickable ? 'cursor-not-allowed' : 'cursor-pointer'
                } ${
                  isReturnItem
                    ? 'border-indigo-500/30 hover:border-indigo-400/60'
                    : ''
                } ${
                  data.isCenter
                    ? 'bg-gradient-to-r from-neutral-900/95 via-sky-950/40 to-neutral-900/95 text-white border border-sky-400/60 dial-center-glow hover:border-sky-300 hover:bg-neutral-800/95 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
                    : 'bg-neutral-900/40 text-neutral-300 border border-white/10 hover:border-white/30 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
                }`}
              >
                {/* Subtle perspective depth shadow overlay as item tilts into background */}
                {data.shadowOverlayOpacity > 0 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none transition-opacity duration-500"
                    style={{ opacity: data.shadowOverlayOpacity }}
                  />
                )}

                {/* Subtle illuminated accent bar on the left edge for center item */}
                {data.isCenter && (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-sky-400 via-amber-300 to-sky-400 rounded-r shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  />
                )}

                <div className="flex flex-col min-w-0 pr-4">
                  <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase text-neutral-400 font-mono mb-0.5">
                    <span className={data.isCenter ? 'text-sky-300 font-semibold' : ''}>{item.category}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="truncate">{item.domain}</span>
                    {item.sourceDialTitle && isSearchActive && (
                      <>
                        <span aria-hidden="true" className="text-neutral-600">·</span>
                        <span className="text-indigo-400 truncate">{item.sourceDialTitle}</span>
                      </>
                    )}
                  </div>
                  <span
                    className={`font-semibold tracking-tight truncate transition-colors ${
                      data.isCenter
                        ? 'text-lg sm:text-xl text-white drop-shadow-[0_2px_10px_rgba(56,189,248,0.35)]'
                        : 'text-base sm:text-lg text-neutral-200'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>

                <div
                  className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    data.isCenter
                      ? 'text-sky-300 bg-sky-500/15 border border-sky-400/30 shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:text-white group-hover:border-sky-300'
                      : 'text-neutral-500 group-hover:text-neutral-300'
                  }`}
                >
                  {item.type === 'link' && <ArrowUpRight className="w-5 h-5" />}
                  {item.type === 'dial' && <ChevronRight className="w-5 h-5" />}
                  {item.type === 'back' && <ArrowLeft className="w-5 h-5 text-indigo-400" />}
                  {item.type === 'disabled' && <Clock className="w-4 h-4 text-amber-400/80" />}
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Discrete Toast Notification for Coming Soon or feedback */}
      {toastMessage && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-lg bg-neutral-900/95 border border-white/20 text-neutral-200 text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md pointer-events-none transition-all">
          {toastMessage}
        </div>
      )}
    </main>
  );
}
