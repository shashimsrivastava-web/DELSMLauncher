'use client';

import React, { useEffect, useRef } from 'react';

interface WarpStar3D {
  x: number;
  y: number;
  z: number;
  pz: number;
  speed: number;
  size: number;
  color: string;
  brightness: number;
}

interface SolarFlareParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  wobbleSpeed: number;
  wobblePhase: number;
}

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

interface Ship3D {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  angle: number;
  direction: 'towards_camera' | 'away_into_depth';
  type: 'constitution' | 'galaxy' | 'shuttle';
  hasPlayedSound: boolean;
  opacity: number;
  sparks: SparkParticle[];
}

const STAR_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#e0f2fe',
  '#bae6fd',
  '#fef3c7',
  '#fde047',
  '#fed7aa',
  '#e9d5ff',
];

const SOLAR_COLORS = [
  '#ffffff',
  '#fef08a',
  '#fde047',
  '#f59e0b',
  '#fb923c',
  '#ea580c',
  '#ef4444',
  '#fda4af',
];

const SPARK_COLORS = ['#38bdf8', '#67e8f9', '#fbbf24', '#f59e0b', '#f43f5e', '#ffffff'];

export default function StarTrekBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle Star Trek warp flyby audio safely
  const playShipFlybySound = (direction: 'towards_camera' | 'away_into_depth') => {
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
      if (ctx.state !== 'running') return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.16, now);
      masterGain.connect(ctx.destination);

      if (direction === 'towards_camera') {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(50, now);
        subOsc.frequency.exponentialRampToValueAtTime(130, now + 0.5);
        subOsc.frequency.exponentialRampToValueAtTime(38, now + 1.5);

        subGain.gain.setValueAtTime(0.01, now);
        subGain.gain.linearRampToValueAtTime(0.32, now + 0.5);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

        const noiseBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.4), ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(160, now);
        filter.frequency.linearRampToValueAtTime(580, now + 0.5);
        filter.frequency.exponentialRampToValueAtTime(110, now + 1.4);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.01, now);
        noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

        subOsc.connect(subGain);
        subGain.connect(masterGain);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);

        subOsc.start(now);
        noise.start(now);
        subOsc.stop(now + 1.55);
        noise.stop(now + 1.45);
      } else {
        const warpOsc = ctx.createOscillator();
        const warpGain = ctx.createGain();
        warpOsc.type = 'triangle';
        warpOsc.frequency.setValueAtTime(170, now);
        warpOsc.frequency.exponentialRampToValueAtTime(38, now + 1.3);

        warpGain.gain.setValueAtTime(0.25, now);
        warpGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

        warpOsc.connect(warpGain);
        warpGain.connect(masterGain);

        warpOsc.start(now);
        warpOsc.stop(now + 1.35);
      }
    } catch {
      // Safe audio error boundary
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let isVisible = true;

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // 1. Forward Warp Speed Starfield (Stars moving outward & backward to give illusion of ship moving forward)
    const starCount = Math.min(280, Math.floor((width * height) / 3800));
    const stars: WarpStar3D[] = [];

    const initWarpStar = (star?: WarpStar3D, resetFar = false): WarpStar3D => {
      const z = resetFar ? 1150 + Math.random() * 250 : Math.random() * 1100 + 40;
      // Radially distributed around central field of view
      const angle = Math.random() * Math.PI * 2;
      const spread = Math.random() * Math.max(width, height) * 1.5 + 30;

      return {
        x: Math.cos(angle) * spread,
        y: Math.sin(angle) * spread,
        z,
        pz: z,
        // Rapid forward velocity for warp flight sensation
        speed: Math.random() * 12.0 + 9.5,
        size: Math.random() * 1.8 + 0.8,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        brightness: Math.random() * 0.4 + 0.6,
      };
    };

    for (let i = 0; i < starCount; i++) {
      stars.push(initWarpStar());
    }

    // 2. Solar Supernova in Top-Right with Soft Coronal Blur & Flare Eruptions
    let supernovaOrbitAngle = 0;
    let supernovaPulseTime = 0;
    const flareParticles: SolarFlareParticle[] = [];
    const maxFlares = 90;

    const spawnSolarFlare = (baseRadius: number) => {
      const angle = Math.random() * Math.PI * 2;
      flareParticles.push({
        angle,
        radius: baseRadius * (Math.random() * 0.35 + 0.8),
        speed: Math.random() * 2.2 + 1.0,
        size: Math.random() * 6.0 + 2.5,
        alpha: 1.0,
        maxAlpha: Math.random() * 0.7 + 0.35,
        decay: Math.random() * 0.015 + 0.007,
        color: SOLAR_COLORS[Math.floor(Math.random() * SOLAR_COLORS.length)],
        wobbleSpeed: Math.random() * 0.08 + 0.03,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    };

    // 3. 3D Star Trek Starships
    const ships: Ship3D[] = [];
    let nextShipTime = Date.now() + 2000;
    let shipIdCounter = 0;

    const spawnShip3D = () => {
      const direction: 'towards_camera' | 'away_into_depth' =
        Math.random() > 0.45 ? 'towards_camera' : 'away_into_depth';

      const types: Array<'constitution' | 'galaxy' | 'shuttle'> = ['constitution', 'galaxy', 'shuttle'];
      const type = types[Math.floor(Math.random() * types.length)];

      if (direction === 'towards_camera') {
        const startX = (Math.random() - 0.5) * (width * 0.7);
        const startY = (Math.random() - 0.5) * (height * 0.7);
        const targetX = startX + (Math.random() * 260 - 130);
        const targetY = startY + (Math.random() * 180 - 90);
        const angle = Math.atan2(targetY - startY, targetX - startX);

        ships.push({
          id: ++shipIdCounter,
          x: startX,
          y: startY,
          z: 980,
          vx: Math.cos(angle) * (Math.random() * 1.6 + 1.2),
          vy: Math.sin(angle) * (Math.random() * 1.3 + 0.9),
          vz: -(Math.random() * 9.5 + 6.5),
          angle,
          direction,
          type,
          hasPlayedSound: false,
          opacity: 0,
          sparks: [],
        });
      } else {
        const startX = (Math.random() - 0.5) * (width * 0.8);
        const startY = (Math.random() - 0.5) * (height * 0.8);
        const angle = (Math.random() * 40 - 20) * (Math.PI / 180);

        ships.push({
          id: ++shipIdCounter,
          x: startX,
          y: startY,
          z: 75,
          vx: Math.cos(angle) * 1.3,
          vy: Math.sin(angle) * 0.9,
          vz: Math.random() * 9.5 + 6.5,
          angle,
          direction,
          type,
          hasPlayedSound: false,
          opacity: 0,
          sparks: [],
        });
      }
    };

    // Draw 3D Starship Model
    const renderStarship3D = (
      screenX: number,
      screenY: number,
      scale: number,
      angle: number,
      type: 'constitution' | 'galaxy' | 'shuttle',
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(screenX, screenY);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

      const nacelleY = type === 'galaxy' ? 16 : 11;
      const trailLength = 75;

      // Nacelle Plasma Streamers
      const trailGrad = ctx.createLinearGradient(0, 0, -trailLength, 0);
      trailGrad.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
      trailGrad.addColorStop(0.35, 'rgba(14, 165, 233, 0.45)');
      trailGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');

      ctx.fillStyle = trailGrad;
      ctx.fillRect(-52, -nacelleY - 2, -trailLength, 4);
      ctx.fillRect(-52, nacelleY - 2, -trailLength, 4);

      // Deflector Dish
      ctx.beginPath();
      ctx.arc(-2, 0, 4.2, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Saucer Section
      ctx.beginPath();
      ctx.ellipse(24, 0, 22, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#e2e8f0';
      ctx.shadowColor = 'rgba(56, 189, 248, 0.35)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Bridge Dome
      ctx.beginPath();
      ctx.ellipse(22, 0, 9, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Bridge Beacon
      ctx.beginPath();
      ctx.arc(24, 0, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Secondary Hull Body
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-24, -7);
      ctx.lineTo(-42, -5);
      ctx.lineTo(-45, 0);
      ctx.lineTo(-42, 5);
      ctx.lineTo(-24, 7);
      ctx.closePath();
      ctx.fillStyle = '#94a3b8';
      ctx.fill();

      // Struts
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-28, -nacelleY);
      ctx.lineTo(-36, -nacelleY);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-36, nacelleY);
      ctx.lineTo(-28, nacelleY);
      ctx.closePath();
      ctx.fillStyle = '#64748b';
      ctx.fill();

      // Twin Warp Nacelles
      [-nacelleY, nacelleY].forEach((ny) => {
        ctx.beginPath();
        ctx.roundRect(-50, ny - 3.5, 48, 7, 2.5);
        ctx.fillStyle = '#475569';
        ctx.fill();

        // Bussard Ramscoop
        ctx.beginPath();
        ctx.arc(-2, ny, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#f87171';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Warp Coil Grille
        ctx.beginPath();
        ctx.roundRect(-44, ny - 1.5, 36, 3, 1.2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#0ea5e9';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      ctx.restore();
    };

    let lastFrameTime = performance.now();
    const fov = 340;

    // Main 60/120 FPS Render Loop
    const render = (nowTime: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((nowTime - lastFrameTime) / 1000, 0.08);
      lastFrameTime = nowTime;

      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Deep Space Obsidian Base
      ctx.fillStyle = '#010308';
      ctx.fillRect(0, 0, width, height);

      // 2. Solar Supernova: Positioned further to Top-Right and significantly bigger with soft blurred corona
      supernovaOrbitAngle += dt * 0.035;
      supernovaPulseTime += dt * 1.8;

      // Top-right coordinates with subtle orbital drift
      const sunOrbitX = width * 0.92 + Math.cos(supernovaOrbitAngle * 0.4) * 22;
      const sunOrbitY = height * 0.08 + Math.sin(supernovaOrbitAngle * 0.3) * 16;
      // Substantially bigger supernova core radius
      const sunCoreRadius = Math.min(width, height) * 0.36;

      // A. Massive Outer Ambient Coronal Shockwave (Soft radial gradient to deep space)
      const shockwaveRadius = sunCoreRadius * (2.9 + Math.sin(supernovaPulseTime * 0.5) * 0.12);
      const outerCorona = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 0.2,
        sunOrbitX,
        sunOrbitY,
        shockwaveRadius
      );
      outerCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      outerCorona.addColorStop(0.12, 'rgba(254, 240, 138, 0.80)');
      outerCorona.addColorStop(0.28, 'rgba(245, 158, 11, 0.55)');
      outerCorona.addColorStop(0.48, 'rgba(234, 88, 12, 0.32)');
      outerCorona.addColorStop(0.70, 'rgba(225, 29, 72, 0.16)');
      outerCorona.addColorStop(0.88, 'rgba(56, 189, 248, 0.08)');
      outerCorona.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = outerCorona;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, shockwaveRadius, 0, Math.PI * 2);
      ctx.fill();

      // B. Soft Atmospheric Coronal Glow Layer
      const softCoronaRadius = sunCoreRadius * 1.85;
      const midCorona = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 0.5,
        sunOrbitX,
        sunOrbitY,
        softCoronaRadius
      );
      midCorona.addColorStop(0, 'rgba(255, 255, 240, 0.90)');
      midCorona.addColorStop(0.35, 'rgba(253, 224, 71, 0.70)');
      midCorona.addColorStop(0.70, 'rgba(249, 115, 22, 0.40)');
      midCorona.addColorStop(1, 'rgba(239, 68, 68, 0)');

      ctx.fillStyle = midCorona;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, softCoronaRadius, 0, Math.PI * 2);
      ctx.fill();

      // C. Supernova Orbital Accretion Disk / Magnetic Rings
      ctx.save();
      ctx.translate(sunOrbitX, sunOrbitY);
      ctx.rotate(supernovaOrbitAngle * 0.7);

      const ringGrad = ctx.createRadialGradient(0, 0, sunCoreRadius * 0.8, 0, 0, sunCoreRadius * 2.5);
      ringGrad.addColorStop(0, 'rgba(251, 146, 60, 0)');
      ringGrad.addColorStop(0.35, 'rgba(253, 224, 71, 0.38)');
      ringGrad.addColorStop(0.65, 'rgba(244, 63, 94, 0.22)');
      ringGrad.addColorStop(0.88, 'rgba(56, 189, 248, 0.12)');
      ringGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, sunCoreRadius * 2.4, sunCoreRadius * 0.8, 0.3, 0, Math.PI * 2);
      ctx.fill();

      // D. Dynamic Solar Prominence Eruption Loops & Filaments
      const loopCount = 8;
      for (let l = 0; l < loopCount; l++) {
        const loopAngle = (l * (Math.PI * 2)) / loopCount + supernovaPulseTime * 0.25;
        const loopHeight = sunCoreRadius * (1.35 + Math.sin(supernovaPulseTime * 2.2 + l) * 0.28);
        const lx1 = Math.cos(loopAngle - 0.22) * sunCoreRadius * 0.92;
        const ly1 = Math.sin(loopAngle - 0.22) * sunCoreRadius * 0.92;
        const lx2 = Math.cos(loopAngle + 0.22) * sunCoreRadius * 0.92;
        const ly2 = Math.sin(loopAngle + 0.22) * sunCoreRadius * 0.92;
        const lcx = Math.cos(loopAngle) * loopHeight;
        const lcy = Math.sin(loopAngle) * loopHeight;

        ctx.strokeStyle = l % 2 === 0 ? 'rgba(254, 240, 138, 0.75)' : 'rgba(249, 115, 22, 0.65)';
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.quadraticCurveTo(lcx, lcy, lx2, ly2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      // E. Supernova Solar Eruptions & Plasma Flare Particle Streamers
      if (flareParticles.length < maxFlares) {
        spawnSolarFlare(sunCoreRadius);
      }

      for (let f = flareParticles.length - 1; f >= 0; f--) {
        const flare = flareParticles[f];
        flare.radius += flare.speed * (dt * 60);
        flare.wobblePhase += flare.wobbleSpeed;
        flare.alpha -= flare.decay * (dt * 60);

        if (flare.alpha <= 0 || flare.radius > shockwaveRadius) {
          flareParticles.splice(f, 1);
          continue;
        }

        const fx = sunOrbitX + Math.cos(flare.angle + Math.sin(flare.wobblePhase) * 0.12) * flare.radius;
        const fy = sunOrbitY + Math.sin(flare.angle + Math.sin(flare.wobblePhase) * 0.12) * flare.radius;

        ctx.fillStyle = flare.color;
        ctx.globalAlpha = flare.alpha * flare.maxAlpha;
        ctx.shadowColor = flare.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(fx, fy, flare.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // F. Soft-Blurred Incandescent Solar Core Disc (Multi-pass feathered blur gradient for realistic fluid plasma)
      const coreDiscGrad = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        0,
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 1.15
      );
      coreDiscGrad.addColorStop(0, '#ffffff');
      coreDiscGrad.addColorStop(0.25, '#fef9c3');
      coreDiscGrad.addColorStop(0.55, '#facc15');
      coreDiscGrad.addColorStop(0.80, '#f97316');
      coreDiscGrad.addColorStop(0.95, '#ef4444');
      coreDiscGrad.addColorStop(1, 'rgba(220, 38, 38, 0)'); // Soft feathered edge to eliminate harsh circle boundary

      ctx.fillStyle = coreDiscGrad;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, sunCoreRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // 3. 3D Stars: Streaming backward past camera to create the continuous illusion of spaceship flying forward at speed
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pz = star.z;
        // Move towards camera (z decreases rapidly)
        star.z -= star.speed * (dt * 60);

        if (star.z <= 20) {
          stars[i] = initWarpStar(star, true);
          continue;
        }

        // 3D Perspective Projection
        const k = fov / star.z;
        const sx = star.x * k + centerX;
        const sy = star.y * k + centerY;

        const pk = fov / Math.max(25, star.pz);
        const psx = star.x * pk + centerX;
        const psy = star.y * pk + centerY;

        if (sx < -100 || sx > width + 100 || sy < -100 || sy > height + 100) {
          stars[i] = initWarpStar(star, true);
          continue;
        }

        // Depth alpha and render sizing
        const depthAlpha = Math.max(0.18, Math.min(1.0, (1 - star.z / 1250) * 1.6));
        const renderSize = Math.max(0.7, (star.size * fov) / star.z);

        ctx.strokeStyle = star.color;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = depthAlpha * star.brightness;

        // Dynamic forward warp streak lines that stretch outward from the center
        const streakDist = Math.hypot(sx - psx, sy - psy);
        if (streakDist > 0.6) {
          ctx.lineWidth = Math.min(4.0, renderSize * 1.3);
          ctx.beginPath();
          ctx.moveTo(psx, psy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, renderSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      // 4. Spawn 3D Starships
      const timeMs = Date.now();
      if (timeMs > nextShipTime && ships.length < 2) {
        spawnShip3D();
        nextShipTime = timeMs + Math.random() * 8000 + 5500;
      }

      // 5. Update & Render 3D Starships & Sparks
      for (let i = ships.length - 1; i >= 0; i--) {
        const ship = ships[i];
        ship.x += ship.vx * (dt * 60);
        ship.y += ship.vy * (dt * 60);
        ship.z += ship.vz * (dt * 60);

        const k = fov / Math.max(25, ship.z);
        const sx = ship.x * k + centerX;
        const sy = ship.y * k + centerY;
        const renderScale = Math.max(0.08, Math.min(2.4, (fov / Math.max(30, ship.z)) * 0.45));

        if (ship.direction === 'towards_camera') {
          if (ship.z > 800) {
            ship.opacity = Math.min(1, (980 - ship.z) / 180);
          } else if (ship.z < 120) {
            ship.opacity = Math.max(0, ship.z / 120);
          } else {
            ship.opacity = 0.95;
          }

          if (!ship.hasPlayedSound && ship.z < 450) {
            ship.hasPlayedSound = true;
            playShipFlybySound('towards_camera');
          }
        } else {
          if (ship.z < 180) {
            ship.opacity = Math.min(0.95, (ship.z - 75) / 100);
          } else if (ship.z > 750) {
            ship.opacity = Math.max(0, (980 - ship.z) / 230);
          } else {
            ship.opacity = 0.95;
          }

          if (!ship.hasPlayedSound && ship.z > 140) {
            ship.hasPlayedSound = true;
            playShipFlybySound('away_into_depth');
          }
        }

        // Nacelle Plasma Sparks
        if (Math.random() > 0.22 && ship.opacity > 0.2) {
          for (let s = 0; s < 2; s++) {
            const sparkAngle = ship.angle + Math.PI + (Math.random() * 0.8 - 0.4);
            const speed = Math.random() * 3.5 + 2.0;
            ship.sparks.push({
              x: sx,
              y: sy + (s === 0 ? -10 : 10) * renderScale,
              vx: Math.cos(sparkAngle) * speed + (Math.random() - 0.5) * 2,
              vy: Math.sin(sparkAngle) * speed + (Math.random() - 0.5) * 2,
              size: Math.random() * 3.5 + 1.5,
              alpha: 1.0,
              decay: Math.random() * 0.05 + 0.03,
              color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
            });
          }
        }

        // Render Sparks
        for (let sp = ship.sparks.length - 1; sp >= 0; sp--) {
          const spark = ship.sparks[sp];
          spark.x += spark.vx * (dt * 60);
          spark.y += spark.vy * (dt * 60);
          spark.alpha -= spark.decay * (dt * 60);

          if (spark.alpha <= 0) {
            ship.sparks.splice(sp, 1);
            continue;
          }

          ctx.fillStyle = spark.color;
          ctx.globalAlpha = spark.alpha * ship.opacity;
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size * renderScale, 0, Math.PI * 2);
          ctx.fill();
        }

        // Render Ship
        renderStarship3D(sx, sy, renderScale, ship.angle, ship.type, ship.opacity);

        if (
          ship.z <= 25 ||
          ship.z >= 1000 ||
          sx < -200 ||
          sx > width + 200 ||
          sy < -200 ||
          sy > height + 200
        ) {
          ships.splice(i, 1);
        }
      }

      ctx.globalAlpha = 1;
    };

    animId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        lastFrameTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
      style={{
        background: '#010308',
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          willChange: 'transform',
        }}
      />
      {/* Deep space radial contrast gradient to preserve optimal text legibility for the dial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(1, 3, 8, 0.25) 0%, rgba(1, 3, 8, 0.70) 100%)',
        }}
      />
    </div>
  );
}
