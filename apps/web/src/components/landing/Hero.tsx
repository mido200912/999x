/**
 * components/landing/Hero.tsx — Legendary Landing Hero
 * Canvas particle animation + mouse parallax + animated KPI counters
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { NeoButton } from '../ui/NeoButton';
import { useLang } from '../../hooks/useLang';

// ─── Canvas Particle System ───────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number; }[] = [];
    const COUNT = 60;

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(163,230,53,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163,230,53,${p.alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display}{suffix}</>;
}

// ─── Hero Component ────────────────────────────────────────────────────────────
export function Hero() {
  const { t } = useLang();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [kpis, setKpis] = useState({ health: 0, churn: 0, sponsors: 0 });
  const [floatY, setFloatY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    // Animate KPI counters after mount
    const timer = setTimeout(() => setKpis({ health: 88, churn: 11, sponsors: 94 }), 500);

    // Floating logo animation
    const startTime = Date.now();
    const animate = () => {
      const t = (Date.now() - startTime) / 1000;
      setFloatY(Math.sin(t * 0.8) * 8);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  }, []);

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-10 pt-12 lg:pt-16 pb-16 relative overflow-hidden"
    >
      {/* Canvas Particle Background */}
      <ParticleCanvas />

      {/* Ambient mouse-tracking glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[900px] h-[900px] rounded-full bg-lime/5 blur-[140px] -z-10 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(calc(-50% + ${mousePos.x * 120}px), calc(-50% + ${mousePos.y * 120}px))` }}
      />

      <div className="grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-[13px] font-mono border border-lime/30 bg-surface/80 backdrop-blur-md shadow-[0_0_20px_rgba(163,230,53,0.15)]">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            منظومة معتمدة لـ 340+ فريق
          </div>

          <h1 className="font-display font-black leading-[1.08] text-[34px] sm:text-[46px] lg:text-[56px] text-pistachio tracking-tight">
            <span className="block drop-shadow-[0_4px_24px_rgba(243,248,204,0.1)]">{t('hero_title1')}</span>
            <span className="block drop-shadow-[0_4px_24px_rgba(243,248,204,0.1)]">{t('hero_title2')}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime to-emerald-400 mt-1 drop-shadow-[0_4px_32px_rgba(163,230,53,0.3)]">{t('hero_title3')}</span>
          </h1>

          <p className="text-[16px] leading-8 text-pistachio/80 max-w-[620px] font-sub">
            {t('hero_desc')}
          </p>

          <div className="flex flex-wrap gap-4">
            <NeoButton to="/onboarding">{t('hero_cta')}</NeoButton>
            <NeoButton variant="glass" to="/client/dashboard">
              {t('hero_demo')}
            </NeoButton>
          </div>

          <div className="pt-5 border-t border-white/10 flex items-center gap-4 text-[12px] font-mono text-pistachio/50">
            <span>AUC • GUC • Techne • RiseUp</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1 text-lime/80">★ 4.9/5 على 127 مشروع</span>
          </div>
        </div>

        {/* Right Dashboard Preview */}
        <div className="lg:col-span-5 relative z-10 perspective-[1200px]">
          <div
            className="glass-panel rounded-3xl p-7 sm:p-9 border-lime/30 shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_40px_rgba(163,230,53,0.1)] transition-transform duration-500 ease-out"
            style={{ transform: `rotateY(${mousePos.x * 12}deg) rotateX(${-mousePos.y * 12}deg)` }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 text-[12px] font-mono">
              <span className="text-lime font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" /> 999x CORE • LIVE
              </span>
              <span className="text-white/40">LATENCY: 14ms</span>
            </div>

            <div className="py-6 flex flex-col items-center">
              {/* Floating Logo with parallax + float animation */}
              <div
                className="w-36 h-36 rounded-3xl overflow-hidden border border-lime/30 shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-none"
                style={{
                  transform: `translateZ(40px) translateX(${mousePos.x * -20}px) translateY(${mousePos.y * -20 + floatY}px)`,
                  transition: 'transform 0.1s ease-out',
                }}
              >
                <img src="/logo_999x.jpg" alt="999x" className="w-full h-full object-cover" />
              </div>
              <span className="font-mono text-[11px] text-white/40 mt-6 tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                NEO-CYBER EXECUTIVE
              </span>
            </div>

            {/* Animated KPI Counters */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-3 rounded-2xl bg-canvas/70 border border-white/10 text-center hover:border-lime/40 hover:shadow-[0_0_16px_rgba(163,230,53,0.15)] transition-all duration-300 group">
                <div className="text-[10px] font-mono text-white/40">HEALTH</div>
                <div className="font-mono font-black text-lime text-[22px] transition-all duration-1000">
                  <AnimatedNumber value={kpis.health} suffix="/100" />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-canvas/70 border border-white/10 text-center hover:border-pistachio/30 hover:shadow-[0_0_16px_rgba(243,248,204,0.1)] transition-all duration-300">
                <div className="text-[10px] font-mono text-white/40">CHURN</div>
                <div className="font-mono font-black text-pistachio text-[22px] transition-all duration-1000">
                  <AnimatedNumber value={kpis.churn} suffix="%" />
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-canvas/70 border border-white/10 text-center hover:border-pistachio/30 hover:shadow-[0_0_16px_rgba(243,248,204,0.1)] transition-all duration-300">
                <div className="text-[10px] font-mono text-white/40">SPONSORS</div>
                <div className="font-mono font-black text-pistachio text-[22px] transition-all duration-1000">
                  <AnimatedNumber value={kpis.sponsors} suffix="%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}