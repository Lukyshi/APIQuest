import { useEffect, useRef } from 'react';

/**
 * PixelWind — High-performance pixelated particle effect
 * Simulates gentle drifting jungle spores, golden pollen, and leaf specks
 * Crisp 8-bit square pixels drifting with slight wind oscillations.
 */
export default function PixelWind({ count = 40, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle palette: Emerald pollen, golden dust, deep moss leaf fragments
    const colors = [
      '#34d399', // bright emerald
      '#10b981', // emerald
      '#fbbf24', // golden amber pollen
      '#f59e0b', // warm gold
      '#6ee7b7', // light mint
      '#4ade80', // jungle green
    ];

    // Initialize particles
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() < 0.25 ? 3 : Math.random() < 0.6 ? 2 : 1, // Crisp 1-3px squares
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: 0.3 + Math.random() * 0.7, // Slow drift to the right
      speedY: -0.2 + Math.random() * 0.4, // Gentle up/down
      opacity: 0.25 + Math.random() * 0.55,
      angle: Math.random() * Math.PI * 2,
      angularSpeed: 0.01 + Math.random() * 0.02,
      amplitude: 0.4 + Math.random() * 0.8,
    }));

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.angle += p.angularSpeed;
        p.x += (p.speedX + Math.sin(p.angle) * p.amplitude) * (dt * 60);
        p.y += (p.speedY + Math.cos(p.angle * 0.8) * 0.3) * (dt * 60);

        // Wrap around screen boundaries
        if (p.x > width + 10) {
          p.x = -10;
          p.y = Math.random() * height;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.y < -10) p.y = height + 10;

        // Render crisp 8-bit pixel square
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-10 w-full h-full ${className}`}
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
}
