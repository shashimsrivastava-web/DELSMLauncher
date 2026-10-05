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
  '#a5f3fc', // Ultra-bright Cyan
  '#67e8f9', // Electric Cyan
  '#38bdf8', // Vibrant Sky Blue
  '#0284c7', // Deep Royal Azure
  '#2563eb', // Electric Cobalt Blue
  '#1d4ed8', // Deep Searing Sapphire
  '#1e40af', // Menacing Midnight Blue
  '#1e3a8a', // Dark Abyssal Blue
  '#818cf8', // Menacing Violet Energy
];

const SPARK_COLORS = ['#38bdf8', '#67e8f9', '#fbbf24', '#f59e0b', '#f43f5e', '#ffffff'];

export default function StarTrekBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
        // Serene cinematic forward velocity (>55% slower for smooth depth)
        speed: Math.random() * 4.2 + 3.2,
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
        // One-third speed for slow, majestic plasma drift
        speed: (Math.random() * 0.9 + 0.45) * 0.333,
        size: Math.random() * 6.0 + 2.5,
        alpha: 1.0,
        maxAlpha: Math.random() * 0.7 + 0.35,
        decay: (Math.random() * 0.007 + 0.003) * 0.333,
        color: SOLAR_COLORS[Math.floor(Math.random() * SOLAR_COLORS.length)],
        wobbleSpeed: (Math.random() * 0.04 + 0.015) * 0.333,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    };

    // 3. 3D Star Trek Starships
    const ships: Ship3D[] = [];
    let nextShipTime = Date.now() + 3000;
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
          vx: Math.cos(angle) * (Math.random() * 0.65 + 0.45),
          vy: Math.sin(angle) * (Math.random() * 0.5 + 0.35),
          vz: -(Math.random() * 3.6 + 2.5),
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
          vx: Math.cos(angle) * 0.55,
          vy: Math.sin(angle) * 0.38,
          vz: Math.random() * 3.6 + 2.5,
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

    // Flight steering dynamics state (Steering Left -> Right -> Straight -> Repeat)
    let currentYaw = 0;
    let currentRoll = 0;
    let currentPitch = 0;
    let steeringTimer = 0;

    // Main 60/120 FPS Render Loop
    const render = (nowTime: number) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((nowTime - lastFrameTime) / 1000, 0.08);
      lastFrameTime = nowTime;

      const centerX = width / 2;
      const centerY = height / 2;

      // Update spaceship steering sequence: 7s Steering Left -> 7s Steering Right -> 7s Straight -> Repeat
      steeringTimer += dt;
      const CYCLE_PERIOD = 21; // 21s continuous flight cycle
      const phaseTime = steeringTimer % CYCLE_PERIOD;

      let targetYaw = 0;
      let targetRoll = 0;
      let targetPitch = 0;

      if (phaseTime < 7) {
        // 1. Steering Left: Starship banks left (-2.5°), perspective drifts right
        const p = phaseTime / 7;
        const curve = Math.sin(p * Math.PI);
        targetYaw = 65 * curve;
        targetRoll = -0.044 * curve; // Smooth banking left
        targetPitch = 10 * Math.sin(p * Math.PI * 2);
      } else if (phaseTime < 14) {
        // 2. Steering Right: Starship banks right (+2.5°), perspective drifts left
        const p = (phaseTime - 7) / 7;
        const curve = Math.sin(p * Math.PI);
        targetYaw = -65 * curve;
        targetRoll = 0.044 * curve; // Smooth banking right
        targetPitch = 10 * Math.sin(p * Math.PI * 2);
      } else {
        // 3. Cruising Straight Ahead: Level horizon, zero bank roll
        targetYaw = 0;
        targetRoll = 0;
        targetPitch = 0;
      }

      // Smooth flight inertia damping for authentic spaceship feel
      const damp = Math.min(1, dt * 2.6);
      currentYaw += (targetYaw - currentYaw) * damp;
      currentRoll += (targetRoll - currentRoll) * damp;
      currentPitch += (targetPitch - currentPitch) * damp;

      const vanishingX = centerX + currentYaw;
      const vanishingY = centerY + currentPitch;

      // 1. Deep Space Obsidian Base
      ctx.fillStyle = '#010308';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      // Apply cockpit banking roll around center
      ctx.translate(centerX, centerY);
      ctx.rotate(currentRoll);
      ctx.translate(-centerX, -centerY);

      // 2. Solar Supernova: Positioned Top-Right with Glowing RED Sun & Slow-Licking Deep-Blue Plasma Flames
      // Animation slowed down to one-third speed
      supernovaOrbitAngle += dt * 0.015;
      supernovaPulseTime += dt * 0.6;

      // Slow, menacing cosmic breathing pulsation (slowed to one-third)
      const breathingScale = 1.0 + Math.sin(supernovaPulseTime * 0.4) * 0.16;

      // Top-right coordinates with subtle orbital drift
      const sunOrbitX = width * 0.92 + Math.cos(supernovaOrbitAngle * 0.4) * 22;
      const sunOrbitY = height * 0.08 + Math.sin(supernovaOrbitAngle * 0.3) * 16;
      const baseCoreRadius = Math.min(width, height) * 0.35;
      const sunCoreRadius = baseCoreRadius * breathingScale;

      // A. Massive Menacing Dark Blue & Cyan Shockwave Corona (Flames & Plasma Field)
      const shockwaveRadius = sunCoreRadius * (3.0 + Math.sin(supernovaPulseTime * 0.5) * 0.2);
      const outerCorona = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 0.15,
        sunOrbitX,
        sunOrbitY,
        shockwaveRadius
      );
      outerCorona.addColorStop(0, 'rgba(165, 243, 252, 0.85)'); // Electric Cyan Plasma
      outerCorona.addColorStop(0.18, 'rgba(56, 189, 248, 0.75)'); // Vibrant Sky Blue
      outerCorona.addColorStop(0.40, 'rgba(37, 99, 235, 0.55)'); // Intense Cobalt Blue
      outerCorona.addColorStop(0.65, 'rgba(29, 78, 216, 0.35)'); // Deep Royal Blue
      outerCorona.addColorStop(0.85, 'rgba(30, 27, 75, 0.20)'); // Menacing Dark Indigo
      outerCorona.addColorStop(1, 'rgba(1, 3, 8, 0)');

      ctx.fillStyle = outerCorona;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, shockwaveRadius, 0, Math.PI * 2);
      ctx.fill();

      // B. Secondary Intense Electric Sapphire Corona (Plasma Glow)
      const softCoronaRadius = sunCoreRadius * 1.95;
      const midCorona = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 0.4,
        sunOrbitX,
        sunOrbitY,
        softCoronaRadius
      );
      midCorona.addColorStop(0, 'rgba(224, 242, 254, 0.90)');
      midCorona.addColorStop(0.30, 'rgba(56, 189, 248, 0.80)');
      midCorona.addColorStop(0.60, 'rgba(29, 78, 216, 0.55)');
      midCorona.addColorStop(0.85, 'rgba(30, 58, 138, 0.30)');
      midCorona.addColorStop(1, 'rgba(15, 23, 42, 0)');

      ctx.fillStyle = midCorona;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, softCoronaRadius, 0, Math.PI * 2);
      ctx.fill();

      // C. Menacing Blue Swirling Plasma Accretion Vortex (Simulating Fire Plasma at 1/3 speed)
      ctx.save();
      ctx.translate(sunOrbitX, sunOrbitY);
      ctx.rotate(supernovaOrbitAngle * 0.85);

      const ringGrad = ctx.createRadialGradient(0, 0, sunCoreRadius * 0.7, 0, 0, sunCoreRadius * 2.6);
      ringGrad.addColorStop(0, 'rgba(14, 165, 233, 0)');
      ringGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.45)');
      ringGrad.addColorStop(0.68, 'rgba(37, 99, 235, 0.35)');
      ringGrad.addColorStop(0.90, 'rgba(30, 27, 75, 0.20)');
      ringGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, sunCoreRadius * 2.5, sunCoreRadius * 0.85, 0.35, 0, Math.PI * 2);
      ctx.fill();

      // D1. Layer 1: Massive Undulating Deep Blue Fire Waves & Serpentine Plasma Flames (Simulating Fire physics at 1/3 speed)
      const deepFlameCount = 24;
      for (let b = 0; b < deepFlameCount; b++) {
        const baseAngle = (b * Math.PI * 2) / deepFlameCount + supernovaOrbitAngle * 0.4;
        const waveFlicker =
          Math.sin(supernovaPulseTime * 3.8 + b * 2.1) * 0.22 +
          Math.cos(supernovaPulseTime * 2.4 + b * 1.3) * 0.14;
        const flameAngle = baseAngle + waveFlicker;
        const waveHeightMult = 1.35 + Math.sin(supernovaPulseTime * 2.8 + b * 1.7) * 0.32 + (b % 4 === 0 ? 0.35 : 0.1);
        const flameLength = sunCoreRadius * waveHeightMult;

        const x1 = Math.cos(flameAngle - 0.24) * (sunCoreRadius * 0.92);
        const y1 = Math.sin(flameAngle - 0.24) * (sunCoreRadius * 0.92);
        const x2 = Math.cos(flameAngle + 0.24) * (sunCoreRadius * 0.92);
        const y2 = Math.sin(flameAngle + 0.24) * (sunCoreRadius * 0.92);
        
        // Curved licking flame tip with organic curl
        const curlOffset = Math.sin(supernovaPulseTime * 3.5 + b) * 0.25;
        const cx = Math.cos(flameAngle + curlOffset) * flameLength;
        const cy = Math.sin(flameAngle + curlOffset) * flameLength;

        const flameGrad = ctx.createLinearGradient(0, 0, cx, cy);
        flameGrad.addColorStop(0, 'rgba(165, 243, 252, 0.95)'); // Searing Cyan Base
        flameGrad.addColorStop(0.30, 'rgba(56, 189, 248, 0.88)'); // Electric Blue Body
        flameGrad.addColorStop(0.65, 'rgba(29, 78, 216, 0.65)'); // Deep Searing Cobalt
        flameGrad.addColorStop(0.90, 'rgba(30, 27, 75, 0.40)'); // Menacing Dark Indigo
        flameGrad.addColorStop(1, 'rgba(15, 23, 42, 0)'); // Vanishing Ember Tip

        ctx.fillStyle = flameGrad;
        ctx.shadowColor = '#2563eb';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx * 1.15, cy * 1.15, x2, y2);
        ctx.closePath();
        ctx.fill();
      }

      // D2. Layer 2: Fast-Licking Serrated Plasma Fire Jets (Secondary Roaring Blue Rim)
      const jetCount = 32;
      for (let j = 0; j < jetCount; j++) {
        const jetAngle = (j * Math.PI * 2) / jetCount - supernovaOrbitAngle * 0.55;
        const jetFlicker = Math.sin(supernovaPulseTime * 5.2 + j * 2.7) * 0.16;
        const angle = jetAngle + jetFlicker;
        const jetLength = sunCoreRadius * (1.18 + Math.sin(supernovaPulseTime * 4.2 + j * 3.1) * 0.24);

        const jx1 = Math.cos(angle - 0.14) * (sunCoreRadius * 0.96);
        const jy1 = Math.sin(angle - 0.14) * (sunCoreRadius * 0.96);
        const jx2 = Math.cos(angle + 0.14) * (sunCoreRadius * 0.96);
        const jy2 = Math.sin(angle + 0.14) * (sunCoreRadius * 0.96);
        const jcx = Math.cos(angle) * jetLength;
        const jcy = Math.sin(angle) * jetLength;

        const jetGrad = ctx.createLinearGradient(0, 0, jcx, jcy);
        jetGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        jetGrad.addColorStop(0.40, 'rgba(103, 232, 249, 0.85)');
        jetGrad.addColorStop(0.75, 'rgba(37, 99, 235, 0.55)');
        jetGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');

        ctx.fillStyle = jetGrad;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(jx1, jy1);
        ctx.quadraticCurveTo(jcx * 1.12, jcy * 1.12, jx2, jy2);
        ctx.closePath();
        ctx.fill();
      }

      // D3. Layer 3: Menacing Deep Blue & Electric Violet Solar Prominence Eruption Loops
      const loopCount = 10;
      for (let l = 0; l < loopCount; l++) {
        const loopAngle = (l * (Math.PI * 2)) / loopCount + supernovaPulseTime * 0.3;
        const loopHeight = sunCoreRadius * (1.45 + Math.sin(supernovaPulseTime * 2.8 + l * 1.6) * 0.35);
        const lx1 = Math.cos(loopAngle - 0.25) * sunCoreRadius * 0.92;
        const ly1 = Math.sin(loopAngle - 0.25) * sunCoreRadius * 0.92;
        const lx2 = Math.cos(loopAngle + 0.25) * sunCoreRadius * 0.92;
        const ly2 = Math.sin(loopAngle + 0.25) * sunCoreRadius * 0.92;
        const lcx = Math.cos(loopAngle) * loopHeight;
        const lcy = Math.sin(loopAngle) * loopHeight;

        ctx.strokeStyle = l % 2 === 0 ? 'rgba(56, 189, 248, 0.95)' : 'rgba(99, 102, 241, 0.88)';
        ctx.lineWidth = 4.2;
        ctx.shadowColor = l % 2 === 0 ? '#38bdf8' : '#6366f1';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.quadraticCurveTo(lcx, lcy, lx2, ly2);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.restore();

      // E. Menacing Blue Supernova Plasma Flare Particle Streamers (Only Blue Plasma)
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

        const fx = sunOrbitX + Math.cos(flare.angle + Math.sin(flare.wobblePhase) * 0.16) * flare.radius;
        const fy = sunOrbitY + Math.sin(flare.angle + Math.sin(flare.wobblePhase) * 0.16) * flare.radius;

        ctx.fillStyle = flare.color;
        ctx.globalAlpha = flare.alpha * flare.maxAlpha;
        ctx.shadowColor = flare.color;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(fx, fy, flare.size * 1.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // F. Sun Glowing Red Corona & Halo (Glowing intensely around the sun)
      const redGlowRadius = sunCoreRadius * 1.45;
      const redCoronaGrad = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 0.4,
        sunOrbitX,
        sunOrbitY,
        redGlowRadius
      );
      redCoronaGrad.addColorStop(0, 'rgba(255, 30, 30, 0.85)'); // Intense Red Glow
      redCoronaGrad.addColorStop(0.35, 'rgba(239, 68, 68, 0.65)'); // Fiery Crimson Halo
      redCoronaGrad.addColorStop(0.70, 'rgba(185, 28, 28, 0.35)'); // Deep Ruby Aura
      redCoronaGrad.addColorStop(1, 'rgba(127, 29, 29, 0)');

      ctx.fillStyle = redCoronaGrad;
      ctx.shadowColor = '#ff2222';
      ctx.shadowBlur = 45;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, redGlowRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // G. Searing Incandescent RED Sun Core Disc (Glowing Red Star Body)
      const coreDiscGrad = ctx.createRadialGradient(
        sunOrbitX,
        sunOrbitY,
        0,
        sunOrbitX,
        sunOrbitY,
        sunCoreRadius * 1.15
      );
      coreDiscGrad.addColorStop(0, '#ffffff'); // Searing White-Hot Center
      coreDiscGrad.addColorStop(0.12, '#ffe4e6'); // Incandescent Rose-White Heat
      coreDiscGrad.addColorStop(0.28, '#ff3b3b'); // Blazing Radiant Scarlet
      coreDiscGrad.addColorStop(0.52, '#ef4444'); // Vibrant Glowing Red
      coreDiscGrad.addColorStop(0.75, '#dc2626'); // Searing Crimson
      coreDiscGrad.addColorStop(0.90, '#991b1b'); // Menacing Deep Blood Red
      coreDiscGrad.addColorStop(1, 'rgba(127, 29, 29, 0)'); // Soft Feathered Transition

      ctx.fillStyle = coreDiscGrad;
      ctx.shadowColor = '#ff1111';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(sunOrbitX, sunOrbitY, sunCoreRadius * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. 3D Stars: Streaming backward past camera with dynamic forward warp streaking
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.pz = star.z;
        // Move towards camera (z decreases)
        star.z -= star.speed * (dt * 60);

        if (star.z <= 20) {
          stars[i] = initWarpStar(star, true);
          continue;
        }

        // 3D Perspective Projection for Leading Star Head
        const k = fov / star.z;
        const sx = star.x * k + vanishingX;
        const sy = star.y * k + vanishingY;

        // Calculate 3D Trailing Point for Pronounced Warp Streaking
        // As star gets closer, the perspective streak elongates dramatically toward the vanishing center
        const tailOffset = star.speed * 28 + (1250 - star.z) * 0.12;
        const tailZ = Math.min(1300, star.z + tailOffset);
        const tk = fov / Math.max(30, tailZ);
        const tx = star.x * tk + vanishingX;
        const ty = star.y * tk + vanishingY;

        if (sx < -120 || sx > width + 120 || sy < -120 || sy > height + 120) {
          stars[i] = initWarpStar(star, true);
          continue;
        }

        // Depth alpha and render sizing
        const depthAlpha = Math.max(0.2, Math.min(1.0, (1 - star.z / 1300) * 1.7));
        const renderSize = Math.max(0.8, (star.size * fov) / star.z);

        ctx.globalAlpha = depthAlpha * star.brightness;

        // Dynamic forward warp streak lines that stretch outward from the center
        const streakDist = Math.hypot(sx - tx, sy - ty);
        if (streakDist > 1.8) {
          const streakGrad = ctx.createLinearGradient(tx, ty, sx, sy);
          streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          streakGrad.addColorStop(0.55, star.color);
          streakGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = streakGrad;
          ctx.lineWidth = Math.max(0.9, Math.min(3.6, renderSize * 1.25));
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(sx, sy);
          ctx.stroke();

          // Bright star head point at leading edge
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(1.0, renderSize * 0.8), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = star.color;
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
        const sx = ship.x * k + vanishingX;
        const sy = ship.y * k + vanishingY;
        const renderScale = Math.max(0.08, Math.min(2.4, (fov / Math.max(30, ship.z)) * 0.45));

        if (ship.direction === 'towards_camera') {
          if (ship.z > 800) {
            ship.opacity = Math.min(1, (980 - ship.z) / 180);
          } else if (ship.z < 120) {
            ship.opacity = Math.max(0, ship.z / 120);
          } else {
            ship.opacity = 0.95;
          }
        } else {
          if (ship.z < 180) {
            ship.opacity = Math.min(0.95, (ship.z - 75) / 100);
          } else if (ship.z > 750) {
            ship.opacity = Math.max(0, (980 - ship.z) / 230);
          } else {
            ship.opacity = 0.95;
          }
        }

        // Nacelle Plasma Sparks
        if (Math.random() > 0.22 && ship.opacity > 0.2) {
          for (let s = 0; s < 2; s++) {
            const sparkAngle = ship.angle + Math.PI + (Math.random() * 0.8 - 0.4);
            const speed = Math.random() * 1.5 + 0.8;
            ship.sparks.push({
              x: sx,
              y: sy + (s === 0 ? -10 : 10) * renderScale,
              vx: Math.cos(sparkAngle) * speed + (Math.random() - 0.5) * 0.8,
              vy: Math.sin(sparkAngle) * speed + (Math.random() - 0.5) * 0.8,
              size: Math.random() * 3.0 + 1.2,
              alpha: 1.0,
              decay: Math.random() * 0.025 + 0.015,
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

      ctx.restore();
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
