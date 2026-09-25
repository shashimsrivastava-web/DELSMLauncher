'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronRight, ArrowLeft, Clock, Search, X, Layers, Volume2, VolumeX, RotateCw, RotateCcw, Check } from 'lucide-react';

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

// Continuous Hermite-interpolated 3D slot configurations for physical inertia and fluid analog glide
function getContinuousSlotConfig(d: number) {
  if (d <= -2) {
    const extra = -2 - d;
    return {
      y: -360 - extra * 125,
      z: -210 - extra * 70,
      rotateX: Math.min(85, 58 + extra * 15),
      scale: Math.max(0.4, 0.68 - extra * 0.1),
      opacity: 0,
      isForefront: false,
      isCenter: false,
      boxShadow: 'none',
      shadowOverlayOpacity: 0.85,
      visible: false,
    };
  }
  if (d >= 5) {
    const extra = d - 5;
    return {
      y: 360 + extra * 125,
      z: -210 - extra * 70,
      rotateX: Math.max(-85, -58 - extra * 15),
      scale: Math.max(0.4, 0.68 - extra * 0.1),
      opacity: 0,
      isForefront: false,
      isCenter: false,
      boxShadow: 'none',
      shadowOverlayOpacity: 0.85,
      visible: false,
    };
  }

  const baseSlot = Math.floor(d);
  const frac = d - baseSlot;
  const c0 = SLOT_CONFIGS[baseSlot];
  const c1 = SLOT_CONFIGS[baseSlot + 1] || c0;

  // Smooth Hermite cubic interpolation for zero velocity derivative jitter at slot boundaries
  const t = frac * frac * (3 - 2 * frac);

  const y = c0.y + (c1.y - c0.y) * t;
  const z = c0.z + (c1.z - c0.z) * t;
  const rotateX = c0.rotateX + (c1.rotateX - c0.rotateX) * t;
  const scale = c0.scale + (c1.scale - c0.scale) * t;
  const opacity = c0.opacity + (c1.opacity - c0.opacity) * t;
  const shadowOverlayOpacity =
    c0.shadowOverlayOpacity + (c1.shadowOverlayOpacity - c0.shadowOverlayOpacity) * t;

  const isCenter = Math.abs(d - 1.0) < 0.45 || Math.abs(d - 2.0) < 0.45;
  const isForefront = d >= -0.5 && d <= 4.5;

  const boxShadow = isCenter
    ? '0 10px 32px -4px rgba(0,0,0,0.55), 0 0 28px rgba(56,189,248,0.22)'
    : d < 1.5
    ? '0 16px 40px -6px rgba(0,0,0,0.75), 0 8px 18px rgba(0,0,0,0.5)'
    : '0 -16px 40px -6px rgba(0,0,0,0.75), 0 -8px 18px rgba(0,0,0,0.5)';

  return {
    y,
    z,
    rotateX,
    scale,
    opacity,
    isForefront,
    isCenter,
    boxShadow,
    shadowOverlayOpacity,
    visible: opacity > 0.01,
  };
}

// Synthesizes a high-fidelity 16-bit PCM WAV mechanical ratchet click data URL for instant HTML5 fallback
function createClickWavUrl(): string {
  if (typeof window === 'undefined') return '';
  try {
    const sampleRate = 22050;
    const duration = 0.045; // 45ms duration
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    view.setUint32(0, 0x52494646, false); // 'RIFF'
    view.setUint32(4, 36 + numSamples * 2, true);
    view.setUint32(8, 0x57415645, false); // 'WAVE'
    // fmt chunk
    view.setUint32(12, 0x666d7420, false); // 'fmt '
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
    view.setUint16(22, 1, true); // NumChannels (1 = mono)
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    // data chunk
    view.setUint32(36, 0x64617461, false); // 'data'
    view.setUint32(40, numSamples * 2, true);

    // Generate crisp metallic transient click + friction noise
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const decay = Math.exp(-t / 0.012);
      const freq = 1600 * Math.exp(-t / 0.008) + 180;
      const tone = Math.sin(2 * Math.PI * freq * t);
      const noise = (Math.random() * 2 - 1) * Math.exp(-t / 0.006);
      const sample = Math.max(-1, Math.min(1, tone * 0.72 + noise * 0.45)) * decay;
      view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  } catch {
    return '';
  }
}

export type SoundThemeId =
  | 'mechanical'
  | 'avionics'
  | 'cyberpunk'
  | 'camera'
  | 'woodblock'
  | 'sonar'
  | 'bubble'
  | 'arcade'
  | 'vault'
  | 'crystal';

export interface SoundTheme {
  id: SoundThemeId;
  name: string;
  shortLabel: string;
  icon: string;
  description: string;
  clockwiseName: string;
  anticlockwiseName: string;
}

export const SOUND_THEMES: SoundTheme[] = [
  {
    id: 'mechanical',
    name: 'Mechanical Ratchet (Default)',
    shortLabel: 'Mechanical',
    icon: '⚙️',
    description: 'Crisp metallic ratchet snap with hollow chassis body resonance',
    clockwiseName: 'Clockwise Snap (1480Hz)',
    anticlockwiseName: 'Anticlockwise Slip (1780Hz)',
  },
  {
    id: 'avionics',
    name: 'Cockpit Avionics Relay',
    shortLabel: 'Avionics',
    icon: '✈️',
    description: 'Aeronautical cockpit magnetic relay switch with tactile latch pulse',
    clockwiseName: 'Engage Relay (1100Hz punch)',
    anticlockwiseName: 'Release Latch (1350Hz tick)',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Synth Hologram',
    shortLabel: 'Cyberpunk',
    icon: '⚡',
    description: 'Futuristic sci-fi laser detent blip and resonant harmonic pip',
    clockwiseName: 'Step Down Pip (2400Hz → 480Hz)',
    anticlockwiseName: 'Step Up Chirp (420Hz → 2800Hz)',
  },
  {
    id: 'camera',
    name: 'Camera Shutter & Iris',
    shortLabel: 'Shutter',
    icon: '📸',
    description: 'Precision mechanical leaf aperture click and winder spring',
    clockwiseName: 'Leaf Snap (1800Hz dual)',
    anticlockwiseName: 'Cocking Ratchet (Triple pip)',
  },
  {
    id: 'woodblock',
    name: 'Acoustic Woodblock Knock',
    shortLabel: 'Woodblock',
    icon: '🪵',
    description: 'Warm organic hollow oak & maple percussion detent knock',
    clockwiseName: 'Deep Oak Knock (480Hz)',
    anticlockwiseName: 'Bright Maple Tap (720Hz)',
  },
  {
    id: 'sonar',
    name: 'Sonar Radar Ping',
    shortLabel: 'Sonar',
    icon: '🌊',
    description: 'Ethereal underwater acoustic radar echo with Doppler resonance',
    clockwiseName: 'Deep Sub Ping (960Hz → 880Hz)',
    anticlockwiseName: 'High Radar Echo (1240Hz → 1320Hz)',
  },
  {
    id: 'bubble',
    name: 'Water Droplet & Bubble',
    shortLabel: 'Bubble',
    icon: '💧',
    description: 'Liquid surface bubble pop and dynamic acoustic water bead',
    clockwiseName: 'Droplet Plop (320Hz → 1100Hz)',
    anticlockwiseName: 'Splash Bead (650Hz → 1850Hz)',
  },
  {
    id: 'arcade',
    name: '8-Bit Retro Arcade Pip',
    shortLabel: '8-Bit Pip',
    icon: '👾',
    description: 'Vintage chiptune DAC square wave arpeggio step blip',
    clockwiseName: 'Step Down (880Hz → 587Hz)',
    anticlockwiseName: 'Step Up (587Hz → 1174Hz)',
  },
  {
    id: 'vault',
    name: 'Heavy Safe Vault Tumbler',
    shortLabel: 'Vault Lock',
    icon: '🔒',
    description: 'Heavy steel combination tumbler clunk with bolt slot friction',
    clockwiseName: 'Tumbler Drop (110Hz + 950Hz)',
    anticlockwiseName: 'Reverse Roll (1400Hz scrape)',
  },
  {
    id: 'crystal',
    name: 'Crystal Glass Harmonic',
    shortLabel: 'Crystal Bell',
    icon: '✨',
    description: 'Pure crystalline harmonic bell vibration and glass chime tone',
    clockwiseName: 'A6 Harmonic (1760Hz)',
    anticlockwiseName: 'C7 Bright Bell (2093Hz)',
  },
];

// Shared pre-computed noise buffer cache to eliminate memory allocation and GC stutter during rapid rotary clicks
let sharedNoiseBuffer: AudioBuffer | null = null;
let sharedNoiseSampleRate = 0;

function getSharedNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (sharedNoiseBuffer && sharedNoiseSampleRate === ctx.sampleRate) {
    return sharedNoiseBuffer;
  }
  const bufferSize = Math.floor(ctx.sampleRate * 0.035);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
  }
  sharedNoiseBuffer = buffer;
  sharedNoiseSampleRate = ctx.sampleRate;
  return buffer;
}

// Rich Web Audio synthesis for each of the 10 sound themes with distinct directional turns
function renderSoundTheme(ctx: AudioContext, themeId: SoundThemeId, direction: 'up' | 'down') {
  const now = ctx.currentTime;
  const isUp = direction === 'up';

  switch (themeId) {
    case 'mechanical': {
      // 1. Mechanical Ratchet (Default)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.95, now);
      masterGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const baseFreq = isUp ? 1780 : 1480;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(isUp ? 210 : 160, now + 0.042);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = getSharedNoiseBuffer(ctx);
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(isUp ? 3200 : 2600, now);
      noiseFilter.Q.setValueAtTime(2.8, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.45, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

      const lowOsc = ctx.createOscillator();
      const lowGain = ctx.createGain();
      lowOsc.type = 'sine';
      lowOsc.frequency.setValueAtTime(isUp ? 250 : 220, now);
      lowOsc.frequency.exponentialRampToValueAtTime(isUp ? 65 : 50, now + 0.06);
      lowGain.gain.setValueAtTime(0.38, now);
      lowGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

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
      break;
    }

    case 'avionics': {
      // 2. Cockpit Avionics Magnetic Relay Switch
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.92, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isUp ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(isUp ? 1350 : 1100, now);
      osc.frequency.exponentialRampToValueAtTime(isUp ? 420 : 280, now + 0.038);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(isUp ? 0.42 : 0.35, now + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(isUp ? 3800 : 2900, now);
      chimeGain.gain.setValueAtTime(0.18, now);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      const thump = ctx.createOscillator();
      const thumpGain = ctx.createGain();
      thump.type = 'sine';
      thump.frequency.setValueAtTime(isUp ? 115 : 75, now);
      thumpGain.gain.setValueAtTime(0.55, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(master);
      chime.connect(chimeGain);
      chimeGain.connect(master);
      thump.connect(thumpGain);
      thumpGain.connect(master);

      osc.start(now);
      chime.start(now);
      thump.start(now);
      osc.stop(now + 0.04);
      chime.stop(now + 0.028);
      thump.stop(now + 0.055);
      break;
    }

    case 'cyberpunk': {
      // 3. Cyberpunk Synth Hologram
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.88, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      if (isUp) {
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(2800, now + 0.038);
      } else {
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.04);
      }

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isUp ? 2400 : 1600, now);
      filter.Q.setValueAtTime(3.8, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.48, now + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(isUp ? 3600 : 850, now);
      shimmerGain.gain.setValueAtTime(0.22, now);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(master);

      osc.start(now);
      shimmer.start(now);
      osc.stop(now + 0.045);
      shimmer.stop(now + 0.038);
      break;
    }

    case 'camera': {
      // 4. Camera Shutter & Iris Blade
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.95, now);
      master.connect(ctx.destination);

      if (!isUp) {
        const click1 = ctx.createOscillator();
        const click1Gain = ctx.createGain();
        click1.type = 'triangle';
        click1.frequency.setValueAtTime(1800, now);
        click1.frequency.exponentialRampToValueAtTime(350, now + 0.015);
        click1Gain.gain.setValueAtTime(0.55, now);
        click1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.016);

        const click2 = ctx.createOscillator();
        const click2Gain = ctx.createGain();
        click2.type = 'triangle';
        click2.frequency.setValueAtTime(2600, now + 0.018);
        click2.frequency.exponentialRampToValueAtTime(500, now + 0.034);
        click2Gain.gain.setValueAtTime(0.001, now);
        click2Gain.gain.setValueAtTime(0.5, now + 0.018);
        click2Gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        click1.connect(click1Gain);
        click1Gain.connect(master);
        click2.connect(click2Gain);
        click2Gain.connect(master);

        click1.start(now);
        click2.start(now + 0.018);
        click1.stop(now + 0.018);
        click2.stop(now + 0.038);
      } else {
        [0, 0.012, 0.024].forEach((delay, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(2200 + idx * 450, now + delay);
          osc.frequency.exponentialRampToValueAtTime(800, now + delay + 0.01);
          gain.gain.setValueAtTime(0.42 - idx * 0.06, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.01);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now + delay);
          osc.stop(now + delay + 0.012);
        });
      }
      break;
    }

    case 'woodblock': {
      // 5. Acoustic Woodblock Knock
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.95, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = isUp ? 740 : 480;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, now + 0.05);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.72, now + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (isUp ? 0.045 : 0.055));

      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harm.type = 'sine';
      harm.frequency.setValueAtTime(freq * (isUp ? 2.0 : 0.5), now);
      harmGain.gain.setValueAtTime(0.35, now);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      const tap = ctx.createOscillator();
      const tapGain = ctx.createGain();
      tap.type = 'triangle';
      tap.frequency.setValueAtTime(isUp ? 2600 : 1800, now);
      tapGain.gain.setValueAtTime(0.35, now);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

      osc.connect(gain);
      gain.connect(master);
      harm.connect(harmGain);
      harmGain.connect(master);
      tap.connect(tapGain);
      tapGain.connect(master);

      osc.start(now);
      harm.start(now);
      tap.start(now);
      osc.stop(now + 0.06);
      harm.stop(now + 0.04);
      tap.stop(now + 0.01);
      break;
    }

    case 'sonar': {
      // 6. Sonar Radar Ping
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.85, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      if (isUp) {
        osc.frequency.setValueAtTime(1240, now);
        osc.frequency.linearRampToValueAtTime(1320, now + 0.07);
      } else {
        osc.frequency.setValueAtTime(960, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.075);
      }

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.68, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (isUp ? 0.07 : 0.08));

      const echo = ctx.createOscillator();
      const echoGain = ctx.createGain();
      echo.type = 'sine';
      echo.frequency.setValueAtTime(isUp ? 2480 : 440, now);
      echoGain.gain.setValueAtTime(0.2, now);
      echoGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(master);
      echo.connect(echoGain);
      echoGain.connect(master);

      osc.start(now);
      echo.start(now);
      osc.stop(now + 0.085);
      echo.stop(now + 0.065);
      break;
    }

    case 'bubble': {
      // 7. Water Droplet & Bubble
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.92, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      if (isUp) {
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(1950, now + 0.032);
      } else {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.036);
      }

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.65, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.04);
      break;
    }

    case 'arcade': {
      // 8. 8-Bit Retro Arcade Pip
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.78, now);
      master.connect(ctx.destination);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      if (isUp) {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(1174.66, now + 0.018); // D6
      } else {
        osc.frequency.setValueAtTime(880.0, now); // A5
        osc.frequency.setValueAtTime(587.33, now + 0.018); // D5
      }

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.setValueAtTime(0.35, now + 0.035);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.045);
      break;
    }

    case 'vault': {
      // 9. Heavy Safe Vault Tumbler
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.95, now);
      master.connect(ctx.destination);

      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = 'sine';
      thud.frequency.setValueAtTime(isUp ? 145 : 110, now);
      thud.frequency.exponentialRampToValueAtTime(45, now + 0.06);
      thudGain.gain.setValueAtTime(0.65, now);
      thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(isUp ? 1350 : 950, now);
      click.frequency.exponentialRampToValueAtTime(180, now + 0.028);
      clickGain.gain.setValueAtTime(0.48, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      thud.connect(thudGain);
      thudGain.connect(master);
      click.connect(clickGain);
      clickGain.connect(master);

      thud.start(now);
      click.start(now);
      thud.stop(now + 0.07);
      click.stop(now + 0.035);
      break;
    }

    case 'crystal': {
      // 10. Crystal Glass Harmonic
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.85, now);
      master.connect(ctx.destination);

      const f1 = isUp ? 2093 : 1760; // C7 or A6
      const f2 = isUp ? 4186 : 3520; // C8 or A7

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(f1, now);
      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.55, now + 0.002);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(f2, now);
      gain2.gain.setValueAtTime(0.01, now);
      gain2.gain.linearRampToValueAtTime(0.28, now + 0.002);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc1.connect(gain1);
      gain1.connect(master);
      osc2.connect(gain2);
      gain2.connect(master);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.09);
      osc2.stop(now + 0.065);
      break;
    }
  }
}

export default function RotatingDial() {
  const [activeDialKey, setActiveDialKey] = useState<DialKey>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [visualOffset, setVisualOffset] = useState(0);
  const step = Math.round(visualOffset);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Enabled by default on app launch
  const [hasInteractedSound, setHasInteractedSound] = useState(false); // Controls launch prompt visibility

  // 10 Dial Sound Themes management
  const [selectedSoundThemeId, setSelectedSoundThemeId] = useState<SoundThemeId>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('delsm_dial_sound_theme');
        if (saved && SOUND_THEMES.some((t) => t.id === saved)) {
          return saved as SoundThemeId;
        }
      } catch {
        // localStorage not available
      }
    }
    return 'mechanical';
  });
  const [isSoundSelectorOpen, setIsSoundSelectorOpen] = useState(false);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const didLongPressRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const currentSoundTheme = useMemo(() => {
    return SOUND_THEMES.find((t) => t.id === selectedSoundThemeId) || SOUND_THEMES[0];
  }, [selectedSoundThemeId]);

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

  // HTML5 audio fallback pool for zero-latency, infallible playback even when Web Audio is suspended
  const fallbackAudioPoolRef = useRef<HTMLAudioElement[]>([]);
  const fallbackAudioIndexRef = useRef(0);

  const playFallbackAudio = useCallback(() => {
    if (isMuted) return;
    try {
      const pool = fallbackAudioPoolRef.current;
      if (pool.length > 0) {
        const audio = pool[fallbackAudioIndexRef.current % pool.length];
        fallbackAudioIndexRef.current++;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    } catch {
      // Ignore
    }
  }, [isMuted]);

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

  // Dedicated helper to instantiate and fully wake audio engine
  const ensureAudioUnlocked = useCallback(async () => {
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
        await ctx.resume().catch(() => {});
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

  // Play selected dial sound with directional variation (clockwise / anticlockwise)
  const playDialSound = useCallback(
    (direction: 'up' | 'down' = 'down', overrideThemeId?: SoundThemeId) => {
      // Fire haptic vibration synchronously on snap
      triggerHapticFeedback();

      // If a specific theme is explicitly being tested/previewed, ensure sound is unmuted
      if (overrideThemeId) {
        setIsMuted(false);
      } else if (isMuted) {
        return;
      }

      const themeIdToPlay = overrideThemeId || selectedSoundThemeId;

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) {
          playFallbackAudio();
          return;
        }

        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;

        if (ctx.state === 'running') {
          renderSoundTheme(ctx, themeIdToPlay, direction);
        } else {
          // If suspended due to browser policy, resume and play as soon as active
          ctx
            .resume()
            .then(() => {
              renderSoundTheme(ctx, themeIdToPlay, direction);
            })
            .catch(() => {
              playFallbackAudio();
            });
          // Also immediately fire fallback audio so user interaction is never silent
          playFallbackAudio();
        }
      } catch {
        playFallbackAudio();
      }
    },
    [isMuted, triggerHapticFeedback, playFallbackAudio, selectedSoundThemeId]
  );

  // Backward compatibility alias so all snap/step rotations call playDialSound
  const playMechanicalClick = playDialSound;

  // Cycle to next sound theme or set a specific theme - activates sound and ensures unmuted state
  const cycleSoundTheme = useCallback(
    (targetThemeId?: SoundThemeId, autoReturn = false) => {
      ensureAudioUnlocked();
      // Activating sound when a sound profile is selected
      setIsMuted(false);
      setHasInteractedSound(true);

      let nextTheme: SoundTheme;
      if (targetThemeId) {
        nextTheme = SOUND_THEMES.find((t) => t.id === targetThemeId) || SOUND_THEMES[0];
      } else {
        const currentIndex = SOUND_THEMES.findIndex((t) => t.id === selectedSoundThemeId);
        const nextIndex = (currentIndex + 1) % SOUND_THEMES.length;
        nextTheme = SOUND_THEMES[nextIndex];
      }

      setSelectedSoundThemeId(nextTheme.id);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('delsm_dial_sound_theme', nextTheme.id);
        } catch {
          // localStorage disabled
        }
      }

      triggerHapticFeedback([25, 45, 25]);
      showToast(`${nextTheme.icon} Sound Activated: ${nextTheme.name} 🔊`);

      // Play immediate demonstration: clockwise then anticlockwise
      setTimeout(() => {
        playDialSound('down', nextTheme.id);
      }, 30);
      setTimeout(() => {
        playDialSound('up', nextTheme.id);
      }, 160);

      if (autoReturn) {
        setIsSoundSelectorOpen(false);
      }
    },
    [ensureAudioUnlocked, selectedSoundThemeId, triggerHapticFeedback, showToast, playDialSound]
  );

  // Handle returning from the sound selector to the app main interface with guaranteed sound activation
  const handleReturnFromSoundSelector = useCallback(() => {
    ensureAudioUnlocked();
    setIsMuted(false);
    setHasInteractedSound(true);
    setIsSoundSelectorOpen(false);

    // Play immediate detent audio feedback to confirm active sound on returning to dial
    setTimeout(() => {
      playDialSound('down');
    }, 45);
  }, [ensureAudioUnlocked, playDialSound]);

  // Force sound on initial launch and unlock audio context across all initial user interaction vectors
  useEffect(() => {
    // Initialize HTML5 fallback audio pool
    if (typeof window !== 'undefined') {
      try {
        const wavUrl = createClickWavUrl();
        if (wavUrl) {
          fallbackAudioPoolRef.current = [
            new Audio(wavUrl),
            new Audio(wavUrl),
            new Audio(wavUrl),
          ];
          fallbackAudioPoolRef.current.forEach((el) => {
            el.volume = 0.95;
            el.preload = 'auto';
          });
        }
      } catch {
        // Fallback initialization
      }
    }

    let hasAutoWoken = false;

    // Eager attempt to wake audio and force welcome mechanical sound on initial page load
    const attemptEagerWake = async () => {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          await ctx.resume().catch(() => {});
        }

        if (ctx.state === 'running' && !hasAutoWoken) {
          hasAutoWoken = true;
          // Successfully allowed by browser: force initial crisp ratchet sound!
          playDialSound('down');
        }
      } catch {
        // Browser autoplay policy holds audio until first interaction
      }
    };

    attemptEagerWake();

    // Universal gesture handler to immediately unlock and force mechanical click on very first user interaction
    const handleFirstGestureUnlock = () => {
      if (!hasAutoWoken) {
        hasAutoWoken = true;
        ensureAudioUnlocked();
        playFallbackAudio();
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointerdown', handleFirstGestureUnlock, true);
      window.removeEventListener('mousedown', handleFirstGestureUnlock, true);
      window.removeEventListener('touchstart', handleFirstGestureUnlock, true);
      window.removeEventListener('touchend', handleFirstGestureUnlock, true);
      window.removeEventListener('click', handleFirstGestureUnlock, true);
      window.removeEventListener('keydown', handleFirstGestureUnlock, true);
      window.removeEventListener('wheel', handleFirstGestureUnlock, true);
      window.removeEventListener('scroll', handleFirstGestureUnlock, true);
    };

    const captureOptions = { capture: true, passive: true };
    window.addEventListener('pointerdown', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('mousedown', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('touchstart', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('touchend', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('click', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('keydown', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('wheel', handleFirstGestureUnlock, captureOptions);
    window.addEventListener('scroll', handleFirstGestureUnlock, captureOptions);

    return () => {
      cleanup();
    };
  }, [playDialSound, ensureAudioUnlocked, playFallbackAudio]);

  // Touch long-press start (mobile)
  const handleLoudspeakerTouchStart = (e: React.TouchEvent) => {
    didLongPressRef.current = false;
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }

    longPressTimeoutRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      triggerHapticFeedback([40, 50, 40]);
      setIsSoundSelectorOpen(true);
      cycleSoundTheme();
    }, 450); // 450ms long press threshold
  };

  const handleLoudspeakerTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const dy = Math.abs(touch.clientY - touchStartPosRef.current.y);
    if (dx > 12 || dy > 12) {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }
    }
  };

  const handleLoudspeakerTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    if (didLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      didLongPressRef.current = false;
    }
  };

  // Double click (desktop / mouse)
  const handleLoudspeakerDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSoundSelectorOpen(true);
    cycleSoundTheme();
  };

  // Single click: Toggle mute/unmute or unlock
  const handleLoudspeakerClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      // If this was part of a double-click gesture (detail === 2), delegate to double click
      if (e.detail === 2) {
        setIsSoundSelectorOpen(true);
        cycleSoundTheme();
        return;
      }

      setHasInteractedSound(true);

      const isContextSuspended =
        !audioCtxRef.current || audioCtxRef.current.state === 'suspended';

      // If user clicked the button while muted OR if browser had suspended the audio context on first run
      if (isMuted || isContextSuspended) {
        ensureAudioUnlocked();
        setIsMuted(false);
        showToast(`Sound: ON 🔊 (${currentSoundTheme.name})`);
        setTimeout(() => {
          playDialSound('down');
        }, 30);
      } else {
        setIsMuted(true);
        showToast('Sound: MUTED 🔇 (Click again to turn ON)');
      }
    },
    [isMuted, ensureAudioUnlocked, playDialSound, showToast, currentSoundTheme, cycleSoundTheme]
  );

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

  // Inertia and rotational momentum state refs
  const offsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const velocityRef = useRef(0);
  const startOffsetRef = useRef(0);
  const startYRef = useRef(0);
  const lastYRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasDragged = useRef(false);
  const recentDeltas = useRef<{ dy: number; time: number }[]>([]);
  const momentumRafId = useRef<number | null>(null);
  const isDeceleratingRef = useRef(false);
  const settlingTargetRef = useRef<number | null>(null);
  const lastSoundNotchRef = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const wheelLastTimeRef = useRef(0);

  const clearMomentum = useCallback(() => {
    if (momentumRafId.current !== null) {
      cancelAnimationFrame(momentumRafId.current);
      momentumRafId.current = null;
    }
    isDeceleratingRef.current = false;
    settlingTargetRef.current = null;
    velocityRef.current = 0;
  }, []);

  const switchDial = useCallback((key: DialKey) => {
    clearMomentum();
    setActiveDialKey(key);
    setSearchQuery('');
    offsetRef.current = 0;
    targetOffsetRef.current = 0;
    wheelAccumulatorRef.current = 0;
    setVisualOffset(0);
    lastSoundNotchRef.current = 0;
  }, [clearMomentum]);

  const handleSearchChange = (val: string) => {
    clearMomentum();
    setSearchQuery(val);
    offsetRef.current = 0;
    targetOffsetRef.current = 0;
    wheelAccumulatorRef.current = 0;
    setVisualOffset(0);
    lastSoundNotchRef.current = 0;
  };

  const clearSearch = useCallback(() => {
    clearMomentum();
    setSearchQuery('');
    offsetRef.current = 0;
    targetOffsetRef.current = 0;
    wheelAccumulatorRef.current = 0;
    setVisualOffset(0);
    lastSoundNotchRef.current = 0;
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  }, [clearMomentum]);

  // Smooth glide to a target integer slot with critically-damped deceleration & zero-lag auditory feedback
  const glideToSlot = useCallback(
    (targetSlot: number, triggerImmediateSound = true) => {
      ensureAudioUnlocked();
      clearMomentum();
      isDeceleratingRef.current = true;
      targetOffsetRef.current = targetSlot;

      const startPos = offsetRef.current;
      const diff = targetSlot - startPos;

      if (Math.abs(diff) < 0.001) {
        offsetRef.current = targetSlot;
        setVisualOffset(targetSlot);
        isDeceleratingRef.current = false;
        return;
      }

      const dir = diff > 0 ? 'down' : 'up';

      // Zero-lag instant auditory & haptic feedback on user action
      if (triggerImmediateSound) {
        playDialSound(dir);
        triggerHapticFeedback(14);
        lastSoundNotchRef.current = targetSlot;
      }

      const startTime = performance.now();
      // Fast, snappy, and responsive glide: ~160ms for 1 notch, smooth ease-out for multi-slot glide
      const duration = Math.min(420, Math.max(160, Math.abs(diff) * 140));

      const animateGlide = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Silky smooth cubic ease-out
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentPos = startPos + diff * ease;

        offsetRef.current = currentPos;
        setVisualOffset(currentPos);

        const currentNotch = Math.round(currentPos);
        if (currentNotch !== lastSoundNotchRef.current) {
          playDialSound(dir);
          triggerHapticFeedback(12);
          lastSoundNotchRef.current = currentNotch;
        }

        if (progress < 1) {
          momentumRafId.current = requestAnimationFrame(animateGlide);
        } else {
          offsetRef.current = targetSlot;
          setVisualOffset(targetSlot);
          isDeceleratingRef.current = false;
          momentumRafId.current = null;
        }
      };

      momentumRafId.current = requestAnimationFrame(animateGlide);
    },
    [ensureAudioUnlocked, clearMomentum, playDialSound, triggerHapticFeedback]
  );

  const rotateUp = useCallback(() => {
    glideToSlot(Math.round(offsetRef.current) - 1, true);
  }, [glideToSlot]);

  const rotateDown = useCallback(() => {
    glideToSlot(Math.round(offsetRef.current) + 1, true);
  }, [glideToSlot]);

  // Physical inertia deceleration animation: custom non-linear velocity-dependent friction algorithm simulating physical flywheel weight
  const startInertiaDeceleration = useCallback(
    (initialVelocity: number) => {
      clearMomentum();
      isDeceleratingRef.current = true;
      settlingTargetRef.current = null;
      velocityRef.current = initialVelocity;
      let lastFrameTime = performance.now();

      const stepDeceleration = (currentTime: number) => {
        const dt = Math.min(36, Math.max(4, currentTime - lastFrameTime)) / 1000;
        lastFrameTime = currentTime;

        let v = velocityRef.current;
        let pos = offsetRef.current;

        // Phase 1: Coasting phase with custom velocity-dependent non-linear physical friction
        if (Math.abs(v) > 0.82 && settlingTargetRef.current === null) {
          const absV = Math.abs(v);
          const sign = Math.sign(v);

          // Physical flywheel weight & aerodynamic/bearing friction model:
          // 1. Viscous laminar grease resistance (linear with velocity)
          const kViscous = 2.1;
          // 2. High-speed drag resistance (proportional to velocity^1.55): absorbs peak burst of kinetic energy to impart tangible physical 'weight'
          const kWeight = 0.14 * Math.pow(absV, 0.55);
          // 3. Coulomb surface contact friction (constant bearing drag)
          const kBearing = 1.6;

          // Composite non-linear deceleration force (slots/sec^2)
          const decelRate = kBearing + (kViscous + kWeight) * absV;

          // Velocity decay over elapsed time step
          const nextAbsV = Math.max(0, absV - decelRate * dt);
          v = sign * nextAbsV;

          pos += v * dt;
          velocityRef.current = v;
          offsetRef.current = pos;
          setVisualOffset(pos);

          const notch = Math.round(pos);
          if (notch !== lastSoundNotchRef.current) {
            const dir = v > 0 ? 'down' : 'up';
            playDialSound(dir);
            triggerHapticFeedback(12);
            lastSoundNotchRef.current = notch;
          }

          momentumRafId.current = requestAnimationFrame(stepDeceleration);
        } else {
          // Phase 2: Smooth magnetic detent lock & critically-damped spring capture
          if (settlingTargetRef.current === null) {
            // Predict forward landing slot based on remaining momentum so it never reverses or jerks
            settlingTargetRef.current = Math.round(pos + v * 0.24);
          }

          const target = settlingTargetRef.current;
          const dist = target - pos;

          // Critically-damped spring parameters: no overshoot, buttery smooth stop
          const springK = 38.0;
          const dampingC = 12.8;
          const springAcc = dist * springK - v * dampingC;

          v += springAcc * dt;
          pos += v * dt;

          velocityRef.current = v;
          offsetRef.current = pos;
          setVisualOffset(pos);

          const notch = Math.round(pos);
          if (notch !== lastSoundNotchRef.current) {
            const dir = dist > 0 ? 'down' : 'up';
            playDialSound(dir);
            triggerHapticFeedback(12);
            lastSoundNotchRef.current = notch;
          }

          if (Math.abs(dist) < 0.0025 && Math.abs(v) < 0.04) {
            offsetRef.current = target;
            setVisualOffset(target);
            velocityRef.current = 0;
            isDeceleratingRef.current = false;
            settlingTargetRef.current = null;
            momentumRafId.current = null;
          } else {
            momentumRafId.current = requestAnimationFrame(stepDeceleration);
          }
        }
      };

      momentumRafId.current = requestAnimationFrame(stepDeceleration);
    },
    [clearMomentum, playDialSound, triggerHapticFeedback]
  );

  // Keyboard navigation with smooth deceleration gliding
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
        glideToSlot(Math.round(offsetRef.current) + 2);
      } else if (e.key === 'PageUp') {
        e.preventDefault();
        glideToSlot(Math.round(offsetRef.current) - 2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rotateDown, rotateUp, activeDialKey, switchDial, isSearchActive, clearSearch, glideToSlot]);

  // Immediate, buttery-smooth wheel listener with zero audio lag and responsive detent tracking
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      ensureAudioUnlocked();

      // Normalize delta across input devices (pixels, lines, pages)
      let rawDelta = e.deltaY;
      if (e.deltaMode === 1) rawDelta *= 20;
      else if (e.deltaMode === 2) rawDelta *= 300;

      const now = performance.now();
      // If idle for more than 160ms, reset wheel accumulator to synchronize with user's new motion
      if (now - wheelLastTimeRef.current > 160) {
        wheelAccumulatorRef.current = 0;
        targetOffsetRef.current = Math.round(offsetRef.current);
      }
      wheelLastTimeRef.current = now;

      wheelAccumulatorRef.current += rawDelta;

      // 45px threshold per detent notch step
      const THRESHOLD = 45;
      if (Math.abs(wheelAccumulatorRef.current) >= THRESHOLD) {
        const steps = Math.trunc(wheelAccumulatorRef.current / THRESHOLD);
        wheelAccumulatorRef.current -= steps * THRESHOLD;

        // Immediate directional ratchet sound - zero lag!
        const dir = steps > 0 ? 'down' : 'up';
        playDialSound(dir);
        triggerHapticFeedback(14);

        // Smoothly advance target slot and animate without delay
        const currentBase = isDeceleratingRef.current
          ? targetOffsetRef.current
          : Math.round(offsetRef.current);
        const newTarget = currentBase + steps;
        targetOffsetRef.current = newTarget;

        glideToSlot(newTarget, false);
      }
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelEvent);
  }, [ensureAudioUnlocked, playDialSound, triggerHapticFeedback, glideToSlot]);

  // Unified, buttery-smooth pointer events with physical momentum glide
  const handlePointerDown = (e: React.PointerEvent) => {
    ensureAudioUnlocked();

    // Ignore drag if clicking directly on input or button controls
    if ((e.target as HTMLElement).closest('input, button, [role="dialog"]')) return;

    clearMomentum();
    isPointerDownRef.current = true;
    startYRef.current = e.clientY;
    startOffsetRef.current = offsetRef.current;
    lastYRef.current = e.clientY;
    recentDeltas.current = [{ dy: 0, time: performance.now() }];
    hasDragged.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const totalDelta = e.clientY - startYRef.current;
    const dy = e.clientY - lastYRef.current;
    lastYRef.current = e.clientY;

    if (Math.abs(totalDelta) > 6) {
      hasDragged.current = true;
    }

    const now = performance.now();
    recentDeltas.current.push({ dy, time: now });
    if (recentDeltas.current.length > 5) {
      recentDeltas.current.shift();
    }

    // 1:1 responsive tactile dragging: 64px = 1 detent step
    const STEP_PX = 64;
    const newOffset = startOffsetRef.current - totalDelta / STEP_PX;
    offsetRef.current = newOffset;
    setVisualOffset(newOffset);

    // Synchronize directional sound and haptic feedback as detents are crossed while dragging
    const notch = Math.round(newOffset);
    if (notch !== lastSoundNotchRef.current) {
      const dir = newOffset > lastSoundNotchRef.current ? 'down' : 'up';
      playDialSound(dir);
      triggerHapticFeedback(14);
      lastSoundNotchRef.current = notch;
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    // Calculate release velocity from the last 80ms of movement
    const now = performance.now();
    const validDeltas = recentDeltas.current.filter((d) => now - d.time < 80);

    let releaseVelocity = 0; // steps per second
    if (validDeltas.length >= 2) {
      const sumDy = validDeltas.reduce((acc, cur) => acc + cur.dy, 0);
      const timeSpan = Math.max(8, validDeltas[validDeltas.length - 1].time - validDeltas[0].time);
      const pxPerSec = -(sumDy / timeSpan) * 1000;
      releaseVelocity = pxPerSec / 64; // convert to steps/sec
    }

    // Clamp maximum release speed to ensure controlled, natural flywheel glide
    releaseVelocity = Math.max(-16, Math.min(16, releaseVelocity));

    if (Math.abs(releaseVelocity) < 0.25) {
      // Releasing stationary: cleanly settle into closest slot with magnetic ease
      glideToSlot(Math.round(offsetRef.current), false);
    } else {
      // Launch smooth physical inertia deceleration animation
      startInertiaDeceleration(releaseVelocity);
    }

    setTimeout(() => {
      hasDragged.current = false;
    }, 150);
  };

  const handleAction = (item: DialLinkItem, slotOffset: number, e: React.MouseEvent) => {
    ensureAudioUnlocked();
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Tap to center: If a user taps on an upper (slotOffset <= 0.6) or lower (slotOffset >= 2.4) visible card,
    // smoothly glide the dial with physical deceleration to bring that item into center focus
    if (slotOffset <= 0.6) {
      e.preventDefault();
      glideToSlot(Math.round(offsetRef.current + slotOffset - 1));
      return;
    }
    if (slotOffset >= 2.4) {
      e.preventDefault();
      glideToSlot(Math.round(offsetRef.current + slotOffset - 2));
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
    const rawDiff = index - visualOffset;
    let d = ((rawDiff % totalItems) + totalItems) % totalItems;
    if (d > totalItems / 2) {
      d -= totalItems;
    }

    const cfg = getContinuousSlotConfig(d);
    return {
      d,
      ...cfg,
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
      className="fixed inset-0 w-full max-w-full h-full h-[100dvh] overflow-hidden flex flex-col items-center bg-[#07080c] select-none cursor-grab active:cursor-grabbing focus:outline-none touch-none"
    >
      {/* Top Header: Full Screen Width Search Bar + DELSM LaunchPad & Right-Aligned Volume Controller + Quick Switch DIAL Bar */}
      <header className="z-30 w-full max-w-full px-2.5 sm:px-5 pt-2 sm:pt-3 flex flex-col items-center gap-1.5 sm:gap-2 shrink-0">
        {/* 1. Full Screen Width Search Bar with 3D Depth Search Icon right-aligned */}
        <div className="relative w-full max-w-full flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search all DIALs (e.g. Checklists, DGR, OPS, Ramp, Star, LL)..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            style={{ fontSize: '16px' }}
            className="w-full pl-4 sm:pl-5 pr-20 sm:pr-24 py-2 sm:py-2.5 rounded-xl bg-neutral-900/90 border border-white/20 text-neutral-100 placeholder-neutral-500 text-[16px] font-medium tracking-tight shadow-xl backdrop-blur-md focus:outline-none focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 transition-all touch-auto pointer-events-auto"
          />

          {/* Right-aligned controls: Clear search + 3D Search Icon with Depth + kbd shortcut */}
          <div className="absolute right-2 sm:right-2.5 flex items-center gap-1.5 pointer-events-auto">
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

            {/* Tactile 3D Search Icon with physical depth and metallic bevel */}
            <button
              type="button"
              onClick={() => searchInputRef.current?.focus()}
              title="Search DIALs"
              aria-label="Search DIALs"
              className="relative group flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-b from-sky-400/30 via-slate-800 to-[#07132a] border border-sky-400/60 shadow-[0_4px_0_#020b18,0_6px_12px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.7)] active:translate-y-[2px] active:shadow-[0_2px_0_#020b18,0_2px_6px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(0,0,0,0.9)] transition-all cursor-pointer select-none"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <Search className="w-4 h-4 text-sky-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-white group-hover:scale-105 transition-all" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
            </button>

            <kbd className="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white/5 rounded border border-white/10">
              /
            </kbd>
          </div>
        </div>

        {/* 2. DELSM LaunchPad Banner + Volume Icon: Together taking the entire width of the screen */}
        <div
          onClick={() => {
            if (isSearchActive) clearSearch();
            if (activeDialKey !== 'main') switchDial('main');
          }}
          title="DELSM LaunchPad - Click to return to Main Dial"
          className="relative w-full min-h-[62px] sm:min-h-[72px] rounded-xl overflow-hidden border border-sky-400/25 hover:border-sky-300/50 shadow-[0_8px_28px_rgba(0,18,50,0.7),0_0_20px_rgba(14,165,233,0.12)] bg-[#07132a] flex items-center justify-between px-3 sm:px-4 py-2 shrink-0 transition-all cursor-pointer group select-none"
        >
          {/* Banner Graphic Background with smooth gradient fade */}
          <Image
            src="/delsm_banner.jpg"
            alt="DELSM LaunchPad Banner"
            fill
            sizes="100vw"
            priority
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75 group-hover:opacity-90 group-hover:scale-[1.015] transition-all duration-300 pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Contrast enhancement overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061226]/95 via-[#081a36]/85 to-[#040e1e]/75 pointer-events-none" />

          {/* Left: DELSM LaunchPad Emblem & Titles */}
          <div className="relative z-10 flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1 mr-2">
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

            {/* Banner Titles */}
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-white font-black text-xs sm:text-base md:text-lg tracking-tight leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] truncate">
                  DELSM LaunchPad
                </h1>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-400/30 shrink-0">
                  Lufthansa Group
                </span>
              </div>
              <p className="text-sky-200/90 text-[10px] sm:text-[12px] font-medium tracking-tight truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] mt-0.5">
                DELSM Apps Drawer and important Links
              </p>
            </div>
          </div>

          {/* Right: Volume Icon right-aligned to DELSM LaunchPad icon */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-20 flex items-center gap-1.5 sm:gap-2 shrink-0 pointer-events-auto"
          >
            {/* Active Sound Theme Pill Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                ensureAudioUnlocked();
                setIsSoundSelectorOpen(true);
              }}
              title="Click to view all 10 Dial Sound Themes. (Double-click or hold volume button to quick switch)"
              className="hidden md:flex px-2 py-1 rounded-lg text-[10px] font-mono font-medium bg-neutral-900/90 border border-amber-400/40 text-neutral-200 hover:border-amber-300 hover:text-amber-300 hover:bg-neutral-800 transition-all items-center gap-1 shadow-md backdrop-blur-md cursor-pointer select-none"
            >
              <span>{currentSoundTheme.icon}</span>
              <span className="truncate max-w-[75px]">{currentSoundTheme.shortLabel}</span>
              <span className="text-[8px] text-amber-400 font-bold">10 FX</span>
            </button>

            {/* 3D Tactile Volume Controller Button */}
            <button
              type="button"
              onClick={handleLoudspeakerClick}
              onDoubleClick={handleLoudspeakerDoubleClick}
              onTouchStart={handleLoudspeakerTouchStart}
              onTouchMove={handleLoudspeakerTouchMove}
              onTouchEnd={handleLoudspeakerTouchEnd}
              aria-label={!isMuted ? `Sound active: ${currentSoundTheme.name}. Click to mute, double-click or long-press to switch sound theme.` : 'Sound muted. Click to turn on.'}
              title={!isMuted ? `Sound: ON (${currentSoundTheme.name})\n• Click: Mute/Unmute\n• Double-click or Long-press: Change Sound Theme (10 FX)` : 'Sound: MUTED — Click to turn ON'}
              className={`relative group flex items-center justify-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-[0_4px_0_#020b18,0_6px_14px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] active:translate-y-[2px] active:shadow-[0_2px_0_#020b18,0_2px_6px_rgba(0,0,0,0.8)] border transition-all cursor-pointer select-none ${
                !isMuted
                  ? 'bg-gradient-to-b from-amber-500/25 via-amber-950/40 to-neutral-950 border-amber-400/70 shadow-[0_0_16px_rgba(245,158,11,0.35)] hover:border-amber-300'
                  : 'bg-gradient-to-b from-neutral-800 to-neutral-950 border-red-500/40 text-neutral-400 hover:border-red-400/60 hover:text-white'
              }`}
            >
              {/* Ambient wave pulse when sound is active */}
              {!isMuted && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl border border-amber-400/50 animate-ping opacity-20 pointer-events-none"
                />
              )}

              {/* Sound Icon */}
              {!isMuted ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] group-hover:scale-110 transition-transform" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:scale-110 group-hover:text-red-300 transition-transform" />
              )}

              {/* Sound state badge and theme indicator */}
              <div className="flex flex-col items-start leading-none">
                <span
                  className={`text-[9px] font-mono font-bold tracking-wider ${
                    !isMuted ? 'text-emerald-300' : 'text-neutral-400'
                  }`}
                >
                  {!isMuted ? 'ON' : 'MUTED'}
                </span>
                <span className="text-[8px] text-amber-400 font-mono mt-0.5">
                  {currentSoundTheme.icon}
                </span>
              </div>

              {/* Glowing Status Dot */}
              <span
                className={`w-2 h-2 rounded-full border border-neutral-950 ml-0.5 ${
                  !isMuted
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    : 'bg-red-500/80 shadow-[0_0_4px_rgba(239,68,68,0.6)]'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Floating Prompt Bar: Shown cleanly below banner when audio is MUTED */}
        {isMuted && (
          <div
            onClick={handleLoudspeakerClick}
            className="sound-prompt-pulse w-full max-w-sm p-2 rounded-xl bg-neutral-900/95 border border-amber-400/50 shadow-[0_8px_20px_rgba(0,0,0,0.8),0_0_16px_rgba(245,158,11,0.2)] flex items-center justify-between gap-2 cursor-pointer transition-all hover:border-amber-300"
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">🔊</span>
              <p className="text-[11px] font-semibold text-amber-300 leading-tight">
                Tap here to activate dial sound!
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400 text-neutral-950">
              UNMUTE
            </span>
          </div>
        )}

        {/* 3. Quick Return to Any DIAL Options */}
        <div className="w-full flex items-center justify-between px-1 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-neutral-400 truncate">
            <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span className="text-neutral-200 font-medium truncate">
              {isSearchActive ? `Search (${searchResults.length} matches)` : currentDial.title}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
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
                  transition: 'background-color 200ms ease, border-color 200ms ease',
                }}
                className={`absolute w-[88vw] max-w-[460px] h-[78px] px-6 py-3.5 rounded-xl flex items-center justify-between group outline-none touch-manipulation active:scale-[0.98] ${
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
                    className="absolute inset-0 rounded-xl bg-gradient-to-b from-black/80 via-black/40 to-black/80 pointer-events-none"
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

      {/* 10 Sound Themes Selector Modal */}
      {isSoundSelectorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Dial Sound Themes Selector"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={handleReturnFromSoundSelector}
        >
          <div
            className="relative w-full max-w-lg max-h-[88vh] overflow-hidden flex flex-col rounded-2xl bg-neutral-900 border border-amber-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.2)] text-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900">
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">🔊</span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
                    Dial Sound Profiles
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      10 FX Available
                    </span>
                  </h2>
                  <p className="text-[11px] text-neutral-400">
                    Selecting a profile automatically turns sound ON and returns to the dial
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReturnFromSoundSelector}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Return to Main Interface (Sound Active)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable list of 10 sound themes */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
              {SOUND_THEMES.map((theme, idx) => {
                const isActive = selectedSoundThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      cycleSoundTheme(theme.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-400/70 shadow-[0_0_16px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40'
                        : 'bg-neutral-800/40 border-white/5 hover:border-white/20 hover:bg-neutral-800/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl sm:text-2xl select-none">{theme.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-white">
                              {idx + 1}. {theme.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/50 flex items-center gap-1">
                                <Volume2 className="w-2.5 h-2.5" />
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">
                            {theme.description}
                          </p>
                        </div>
                      </div>

                      {/* 1-Tap Select & Return Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cycleSoundTheme(theme.id, true);
                        }}
                        title={`Activate ${theme.name} and return to dial`}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          isActive
                            ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                            : 'bg-white/10 hover:bg-amber-400 hover:text-neutral-950 text-neutral-200 border border-white/10'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>{isActive ? 'Use & Return' : 'Select'}</span>
                      </button>
                    </div>

                    {/* Clockwise vs Anticlockwise Direction Preview Controls */}
                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/5 text-[10px] font-mono text-neutral-400">
                      <span className="text-neutral-500">Direction preview:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            ensureAudioUnlocked();
                            setIsMuted(false);
                            playDialSound('down', theme.id);
                          }}
                          title={`Test Clockwise: ${theme.clockwiseName}`}
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-amber-400/20 hover:text-amber-300 border border-white/10 transition-colors flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3 text-amber-400" />
                          <span>CW (Down)</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            ensureAudioUnlocked();
                            setIsMuted(false);
                            playDialSound('up', theme.id);
                          }}
                          title={`Test Anticlockwise: ${theme.anticlockwiseName}`}
                          className="px-2 py-1 rounded-md bg-white/5 hover:bg-sky-400/20 hover:text-sky-300 border border-white/10 transition-colors flex items-center gap-1 text-[10px] cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3 text-sky-400" />
                          <span>CCW (Up)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-neutral-950/80 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="truncate">
                💡 Tip: Double-click or hold volume button to quick-switch anytime
              </span>
              <button
                type="button"
                onClick={handleReturnFromSoundSelector}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-neutral-950 font-bold hover:bg-amber-300 transition-colors text-xs shrink-0 flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.3)]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Return to Dial (Sound ON)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
