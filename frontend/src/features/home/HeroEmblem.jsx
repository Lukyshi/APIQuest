import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * HeroEmblem — Interactive Golden Compass Emblem with Retro Arcade Sparks
 * 
 * Features:
 * - Floating animation and multi-layered ambient temple aura
 * - Interactive mouse-click spark explosion (canvas-based 60fps arcade particles)
 * - Directional velocities, friction, gravity, expanding shockwave rings, and 8-bit spark squares
 * - Responsive sizing that balances the hero layout without awkward spacing
 */
export default function HeroEmblem() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const ringsRef = useRef([]);
  const animFrameRef = useRef(null);
  const [isSparking, setIsSparking] = useState(false);

  // Spark color palette: Golden, amber, emerald & diamond white
  const sparkColors = [
    '#fbbf24', // bright gold
    '#f59e0b', // amber
    '#fde68a', // pale star yellow
    '#34d399', // radiant emerald
    '#10b981', // deep emerald
    '#ffffff', // pure white spark center
  ];

  // Animation loop running only while particles or shockwaves exist
  const updateAndDraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw and update expanding shockwave rings
    ringsRef.current = ringsRef.current.filter((ring) => {
      ring.radius += ring.speed;
      ring.alpha -= 0.035;

      if (ring.alpha <= 0) return false;

      ctx.save();
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = Math.max(0, ring.alpha);
      ctx.lineWidth = ring.width;
      ctx.shadowBlur = 12;
      ctx.shadowColor = ring.color;
      ctx.stroke();
      ctx.restore();

      return true;
    });

    // 2. Draw and update pixel sparks
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= p.friction;
      p.vy = p.vy * p.friction + p.gravity;
      p.alpha -= p.decay;
      p.rotation += p.rotSpeed;

      if (p.alpha <= 0) return false;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;

      // Draw crisp 8-bit square or cross spark
      if (p.isCross) {
        const s = p.size;
        ctx.fillRect(-s / 2, -s / 6, s, s / 3);
        ctx.fillRect(-s / 6, -s / 2, s / 3, s);
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }

      ctx.restore();
      return true;
    });

    // Keep loop alive if any elements remain
    if (particlesRef.current.length > 0 || ringsRef.current.length > 0) {
      animFrameRef.current = requestAnimationFrame(updateAndDraw);
    } else {
      animFrameRef.current = null;
    }
  }, []);

  // Resize canvas to match container bounds
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Spawn spark burst upon clicking the emblem
  const handleEmblemClick = (e) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    // Use click position relative to container, fallback to center
    const clickX = e ? e.clientX - rect.left : rect.width / 2;
    const clickY = e ? e.clientY - rect.top : rect.height / 2;

    // Trigger visual pulse state
    setIsSparking(true);
    setTimeout(() => setIsSparking(false), 250);

    // Add 28-36 arcade spark particles
    const sparkCount = 32;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
      const speed = 3.5 + Math.random() * 8.5;
      particlesRef.current.push({
        x: clickX,
        y: clickY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        friction: 0.93,
        gravity: 0.12,
        size: Math.random() < 0.35 ? 6 : Math.random() < 0.7 ? 4 : 3,
        color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
        alpha: 1,
        decay: 0.018 + Math.random() * 0.022,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        isCross: Math.random() < 0.3,
      });
    }

    // Add 2 glowing shockwave rings
    ringsRef.current.push(
      {
        x: clickX,
        y: clickY,
        radius: 8,
        speed: 4.5,
        alpha: 0.85,
        width: 3,
        color: '#fbbf24',
      },
      {
        x: clickX,
        y: clickY,
        radius: 4,
        speed: 6.5,
        alpha: 0.7,
        width: 2,
        color: '#34d399',
      }
    );

    // Start rendering loop if not already running
    if (!animFrameRef.current) {
      animFrameRef.current = requestAnimationFrame(updateAndDraw);
    }
  };

  return (
    <div
      ref={containerRef}
      className="lg:col-span-5 flex flex-col items-center justify-center animate-slide-up relative py-8 lg:py-0 select-none"
    >
      {/* Multi-layered ambient temple aura */}
      <div className="pointer-events-none absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-500/25 via-emerald-500/15 to-transparent blur-[80px]" />
      <div className="pointer-events-none absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-amber-400/20 blur-[55px]" />

      {/* Canvas Particle Overlay for 60fps Sparks */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-20"
      />

      {/* Floating Emblem Click Target */}
      <div
        onClick={handleEmblemClick}
        className="relative group flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95"
        title="Click the temple emblem to unleash arcade sparks!"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEmblemClick(null);
          }
        }}
      >
        <img
          src="/logo.png"
          alt="API Quest Golden Compass Emblem — Click for sparks!"
          className={`w-56 sm:w-72 md:w-80 lg:w-[350px] xl:w-[410px] max-w-full h-auto object-contain animate-float drop-shadow-[0_0_35px_rgba(245,158,11,0.55)] drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_50px_rgba(245,158,11,0.85)] ${
            isSparking ? 'scale-105 brightness-125 drop-shadow-[0_0_65px_rgba(251,191,36,0.95)]' : ''
          }`}
          draggable={false}
        />
      </div>

      {/* Subtle Grounding Pedestal Glow */}
      <div className="w-40 sm:w-56 lg:w-64 h-3.5 bg-gradient-to-r from-transparent via-amber-500/35 to-transparent blur-md rounded-full mt-3" />
    </div>
  );
}

