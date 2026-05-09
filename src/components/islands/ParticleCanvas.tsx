import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { themes, DEFAULT_THEME } from '@/lib/themes';
import type { ThemeName } from '@/lib/themes';

const PARTICLE_COUNT = 18;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  aspect: number;
  rotation: number;
  vr: number;
  alpha: number;
  color: string;
}

function getColors(): string[] {
  const name = (document.documentElement.getAttribute('data-theme') || DEFAULT_THEME) as ThemeName;
  const p = themes[name] ?? themes[DEFAULT_THEME];
  return [p.primary, p.secondary];
}

function spawnParticle(w: number, h: number, colors: string[], spreadY = false): Particle {
  const color = colors[Math.random() > 0.5 ? 0 : 1];
  return {
    x: Math.random() * w,
    y: spreadY ? Math.random() * h : h + Math.random() * 40 + 10,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -(Math.random() * 0.5 + 0.3),
    radius: Math.random() * 5 + 4,
    aspect: Math.random() * 0.15 + 0.35,
    rotation: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.03,
    alpha: Math.random() * 0.15 + 0.10,
    color,
  };
}

export default function ParticleCanvas() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (reducedMotion === true) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let colors = getColors();
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      spawnParticle(canvas.width, canvas.height, colors, true)
    );

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.radius * p.aspect, p.radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        if (p.y < -(p.radius * 2)) {
          const next = spawnParticle(canvas.width, canvas.height, colors);
          Object.assign(p, next);
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
      }
    }

    function loop() {
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    function onVisibility() {
      if (document.visibilityState === 'hidden') {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(loop);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);

    const observer = new MutationObserver(() => {
      colors = getColors();
      particles.forEach(p => {
        p.color = colors[Math.random() > 0.5 ? 0 : 1];
      });
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      observer.disconnect();
    };
  }, [reducedMotion]);

  if (reducedMotion === true) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}
