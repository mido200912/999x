/**
 * pages/Landing.tsx — 999x Legendary Landing Page
 * Full animations via CSS + Intersection Observer only (zero deps)
 * Brand palette: canvas #1A0533 | lime #A8D840 | pistachio #E8F5C8 | violet #6B21A8
 */
import { SiteHeader } from '../../components/layout/SiteHeader';
import { NeoButton } from '../../components/ui/NeoButton';
import { useEffect, useRef, useState } from 'react';
import { Shield, Users, Briefcase, Zap, ChevronRight, Lock, Star, ArrowRight, CheckCircle } from 'lucide-react';

// ─── Scroll Reveal Hook ──────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.97)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const { ref, visible } = useScrollReveal(0.4);
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const dur = 1800;
    const step = 16;
    const increment = to / (dur / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [visible, to]);
  return <span ref={ref as any}>{val.toLocaleString()}{suffix}</span>;
}

// ─── Service Card ────────────────────────────────────────────────────────────
function ServiceCard({ icon, title, desc, delay, accent }: { icon: React.ReactNode; title: string; desc: string; delay: number; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={delay} className="flex-1 min-w-[260px]">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)',
        }}
        className="h-full rounded-3xl border border-white/10 bg-surface/60 backdrop-blur-sm p-8 cursor-default relative overflow-hidden group"
      >
        {/* Glow on hover */}
        <div className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 70%)` }} />

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border transition-colors duration-300`}
          style={{ background: `${accent}15`, borderColor: `${accent}30`, color: accent }}>
          {icon}
        </div>
        <h3 className="font-display font-bold text-[20px] text-white mb-3">{title}</h3>
        <p className="text-white/50 text-[14px] leading-relaxed">{desc}</p>
      </div>
    </Reveal>
  );
}

// ─── Typewriter ──────────────────────────────────────────────────────────────
function Typewriter({ words }: { words: string[] }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx, words]);

  return (
    <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #A8D840, #E8F5C8)' }}>
      {displayed}
      <span className="inline-block w-[3px] h-[0.9em] ml-1 bg-lime/80 rounded-full animate-pulse align-middle" />
    </span>
  );
}

// ─── Grid Background ─────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Dot grid */}
      <div style={{
        backgroundImage: 'radial-gradient(circle, rgba(168,216,64,0.15) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        width: '100%', height: '100%',
        maskImage: 'radial-gradient(ellipse 80% 70% at 50% 0%, black 30%, transparent 100%)',
      }} />
      {/* Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #6B21A840 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute top-[20%] right-[5%] w-[400px] h-[400px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #A8D84030 0%, transparent 70%)', filter: 'blur(80px)' }} />
    </div>
  );
}

// ─── Main Landing ─────────────────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen bg-canvas text-white overflow-x-hidden">
      <SiteHeader />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-28 px-5 sm:px-8 text-center overflow-hidden">
        <GridBg />
        <div className="relative z-10 max-w-[900px] mx-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-lime/20 bg-lime/5 mb-8 text-[12px] font-mono text-lime/80 tracking-widest">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
            CAIRO'S #1 ELITE OPS TEAM
          </div>

          <h1 className="font-display font-black text-[42px] sm:text-[56px] md:text-[72px] leading-[1.08] tracking-tight mb-6">
            We Engineer<br />
            <Typewriter words={['Winning Teams.', 'Mega Events.', 'Rapid Growth.', 'Pure Results.']} />
          </h1>

          <p className="text-white/50 text-[17px] md:text-[19px] max-w-[560px] mx-auto mb-10 leading-relaxed">
            999x is an elite force of HR strategists, PR architects, and operations commanders. We embed inside your organization and engineer results — fast.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <NeoButton to="/register" className="h-13 px-8 text-[15px]">
              Start Your Transformation <ChevronRight className="w-4 h-4 ml-1" />
            </NeoButton>
            <NeoButton variant="glass" to="/login" className="h-13 px-8 text-[15px]">
              Client Portal
            </NeoButton>
          </div>
        </div>

        {/* Floating badge */}
        <div className="relative z-10 mt-16 flex justify-center">
          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm">
            {[['50+', 'Projects'], ['98%', 'Success Rate'], ['3 Days', 'Avg Onboard']].map(([n, l]) => (
              <div key={l} className="text-center px-4 first:pl-0 last:pr-0 border-r border-white/10 last:border-0">
                <div className="font-display font-black text-[20px] text-lime">{n}</div>
                <div className="text-[11px] font-mono text-white/30 tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8 border-y border-white/5" style={{ background: 'linear-gradient(to bottom, rgba(107,33,168,0.08), transparent)' }}>
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { to: 50, suffix: '+', label: 'Clients Served' },
            { to: 98, suffix: '%', label: 'Satisfaction Rate' },
            { to: 120, suffix: '+', label: 'Events Executed' },
            { to: 4, suffix: ' Yrs', label: 'In the Field' },
          ].map(({ to, suffix, label }, i) => (
            <Reveal key={label} delay={i * 100} className="text-center">
              <div className="font-display font-black text-[48px] md:text-[56px] text-lime leading-none">
                <Counter to={to} suffix={suffix} />
              </div>
              <div className="text-[13px] font-mono text-white/30 tracking-widest mt-2">{label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <Reveal className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-lime font-mono text-[11px] tracking-widest mb-4">
              <Zap className="w-3.5 h-3.5" /> WHAT WE DO
            </div>
            <h2 className="font-display font-bold text-[36px] md:text-[44px] text-white mb-4 tracking-tight">
              Three Pillars. One Team.
            </h2>
            <p className="text-white/40 text-[16px] max-w-[500px] mx-auto">
              We don't consult from the sidelines — we get in the trenches with you.
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-6">
            <ServiceCard delay={0} accent="#6B21A8" icon={<Users className="w-7 h-7" />}
              title="Human Resources" desc="Team restructuring, RACI design, talent scoring, churn prevention, and cultural transformation for high-velocity organizations." />
            <ServiceCard delay={100} accent="#A8D840" icon={<Briefcase className="w-7 h-7" />}
              title="Sponsorship & PR" desc="Sponsor deck creation, corporate outreach, brand narrative, media relations, and conference monetization strategies." />
            <ServiceCard delay={200} accent="#E8F5C8" icon={<Shield className="w-7 h-7" />}
              title="Crisis Operations" desc="24/7 embedded ops command for failing startups and mega events. We become your war room until the mission is complete." />
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(107,33,168,0.06), transparent)' }}>
        <div className="max-w-[900px] mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className="font-display font-bold text-[36px] text-white mb-4">The 999x Process</h2>
            <p className="text-white/40">From first call to full ops — in 72 hours.</p>
          </Reveal>

          <div className="space-y-4">
            {[
              { n: '01', title: 'Discovery Call', desc: 'We diagnose your current state through a structured 45-min session with your leadership team.' },
              { n: '02', title: 'Ops Blueprint', desc: 'Within 24 hours, we deliver a custom operational map with priorities, timelines, and assigned team leads.' },
              { n: '03', title: 'Embed & Execute', desc: 'Our team integrates into yours immediately — running task boards, leading standups, and pushing results.' },
              { n: '04', title: 'Handover & Scale', desc: 'We document every process and train your team before exiting, leaving a self-sustaining system behind.' },
            ].map(({ n, title, desc }, i) => (
              <Reveal key={n} delay={i * 80}>
                <div className="flex gap-6 p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-lime/20 hover:bg-lime/[0.02] transition-all duration-300 group">
                  <div className="shrink-0 font-display font-black text-[40px] text-lime/20 leading-none group-hover:text-lime/40 transition-colors">{n}</div>
                  <div>
                    <h3 className="font-bold text-[18px] text-white mb-2 flex items-center gap-2">
                      {title} <ArrowRight className="w-4 h-4 text-lime/0 group-hover:text-lime/70 transition-all group-hover:translate-x-1 duration-300" />
                    </h3>
                    <p className="text-white/40 text-[14px] leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal System Note ─────────────────────────── */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-[1000px] mx-auto">
          <Reveal>
            <div className="relative rounded-3xl border border-violet/20 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(107,33,168,0.15) 0%, rgba(26,5,51,0.8) 100%)' }}>
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl opacity-50" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(168,216,64,0.12), transparent 70%)' }} />

              <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 text-lime font-mono text-[11px] tracking-widest mb-4">
                    <Lock className="w-3.5 h-3.5" /> PROPRIETARY TECHNOLOGY
                  </div>
                  <h2 className="font-display font-bold text-[30px] md:text-[36px] text-white mb-5 leading-tight">
                    Powered by the<br /><span className="text-lime">999x Internal Hub</span>
                  </h2>
                  <p className="text-white/50 text-[15px] leading-relaxed mb-8">
                    Our team operates through a proprietary closed-access management platform — not available to the public. It gives us real-time health scores, AI-driven task prioritization, and sponsor readiness metrics for every client engagement.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Real-Time Health Scoring', 'AI Strategy Engine', 'Tenant-Isolated Data', 'Audit Logs'].map((f) => (
                      <div key={f} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[12px] font-mono text-white/50">
                        <CheckCircle className="w-3 h-3 text-lime" /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fake terminal */}
                <div className="shrink-0 w-full md:w-[280px]">
                  <div className="rounded-2xl border border-white/10 bg-canvas/80 backdrop-blur-sm shadow-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet" />
                      <div className="w-2.5 h-2.5 rounded-full bg-pistachio" />
                      <div className="w-2.5 h-2.5 rounded-full bg-lime" />
                      <span className="ml-2 font-mono text-[10px] text-white/20">999x-hub terminal</span>
                    </div>
                    <div className="p-4 space-y-2 font-mono text-[11px]">
                      <div className="text-lime/60">$ run health-check --client=acme</div>
                      <div className="text-white/30">→ HR Stability......... <span className="text-lime">87%</span></div>
                      <div className="text-white/30">→ Sponsor Ready........ <span className="text-lime">94%</span></div>
                      <div className="text-white/30">→ Churn Risk........... <span className="text-pistachio">12%</span></div>
                      <div className="text-white/30">→ Exec Speed........... <span className="text-lime">91%</span></div>
                      <div className="text-lime/40 mt-3">✓ Overall Score: <span className="text-lime font-bold">91/100</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-20 px-5 sm:px-8">
        <div className="max-w-[1100px] mx-auto">
          <Reveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-lime font-mono text-[11px] tracking-widest mb-4">
              <Star className="w-3.5 h-3.5" /> FROM THE FIELD
            </div>
            <h2 className="font-display font-bold text-[36px] text-white">Words from the Trenches</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { q: '"999x turned our chaotic 300-person event into a military-grade operation in 48 hours. Absolutely relentless team."', name: 'A. Hassan', role: 'Techne Summit Director' },
              { q: '"They restructured our entire HR pipeline and cut churn by 40% in the first month. These people don\'t play."', name: 'M. Saleh', role: 'CEO, FinTech Startup' },
              { q: '"The sponsor deck they built got us 6 partnerships in 2 weeks. I didn\'t think that was possible."', name: 'N. Omar', role: 'Events Lead, Cairo Hub' },
            ].map(({ q, name, role }, i) => (
              <Reveal key={name} delay={i * 100}>
                <div className="h-full rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-violet/30 transition-all duration-300">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-lime text-lime" />)}
                  </div>
                  <p className="text-white/60 text-[14px] leading-relaxed mb-6 italic">{q}</p>
                  <div>
                    <div className="font-bold text-pistachio text-[14px]">{name}</div>
                    <div className="text-white/30 text-[12px] font-mono">{role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8">
        <Reveal>
          <div className="max-w-[800px] mx-auto text-center">
            <div className="relative rounded-3xl p-12 md:p-16 overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(168,216,64,0.12) 0%, rgba(107,33,168,0.2) 100%)', border: '1px solid rgba(168,216,64,0.2)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(107,33,168,0.3), transparent 70%)' }} />
              <div className="relative z-10">
                <h2 className="font-display font-black text-[36px] md:text-[48px] text-white mb-5 leading-tight">
                  Ready to build something<br /><span className="text-lime">legendary?</span>
                </h2>
                <p className="text-white/50 text-[16px] mb-10 max-w-[500px] mx-auto">
                  Fill out the client form and our ops team will reach out within 24 hours to schedule your discovery call.
                </p>
                <NeoButton to="/register" className="h-14 px-10 text-[16px] shadow-[0_0_50px_rgba(168,216,64,0.3)]">
                  Book Your Discovery Call <ArrowRight className="w-5 h-5 ml-2" />
                </NeoButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo_999x.jpg" alt="999x" className="w-8 h-8 rounded-xl object-cover" />
            <span className="font-display font-black text-pistachio">999x</span>
            <span className="text-white/20 text-[12px] font-mono">OPERATIONS HUB</span>
          </div>
          <p className="text-white/20 text-[12px] font-mono">
            &copy; {new Date().getFullYear()} 999x Elite Operations. Proprietary platform — not publicly available.
          </p>
        </div>
      </footer>
    </div>
  );
}
