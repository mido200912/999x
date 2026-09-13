/**
 * components/layout/SiteHeader.tsx — Site header (English only)
 * Contains: logo 999x + nav + CTA — no language switcher (removed per request)
 * Used on public pages: Landing, Onboarding
 */
import { Link, useLocation } from 'react-router-dom';
import { NeoButton } from '../ui/NeoButton';

export function SiteHeader() {
  const loc = useLocation();
  const isActive = (p: string) => loc.pathname === p;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10" style={{ background: 'rgba(21,3,32,0.85)' }}>
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-[76px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src="/logo_999x.jpg" alt="999x" className="w-11 h-11 rounded-2xl object-cover" />
          <span className="font-black text-pistachio hidden sm:inline">999x Operations Hub</span>
          <span className="px-1.5 py-0.5 rounded bg-lime/15 text-lime border border-lime/30 text-[10px] font-mono">OPS</span>
        </Link>

        {/* Nav — English only */}
        <nav className="hidden lg:flex gap-2 text-[14px]">
          <a href="/#pulse" className="px-4 py-2 rounded-xl hover:bg-white/5 text-pistachio/80">
            Diagnostic
          </a>
          <Link to="/onboarding" className={`px-4 py-2 rounded-xl ${isActive('/onboarding') ? 'bg-lime text-canvas' : 'hover:bg-white/5 text-pistachio/80'}`}>
            Wizard
          </Link>
          <Link to="/client/dashboard" className="px-4 py-2 rounded-xl hover:bg-white/5 text-pistachio/80">
            Client Hub
          </Link>
          <Link to="/admin/cockpit" className="px-4 py-2 rounded-xl hover:bg-white/5 text-pistachio/80">
            War Room
          </Link>
        </nav>

        {/* CTA — English only */}
        <div className="flex items-center gap-3">
          <NeoButton to="/login" variant="glass" className="hidden sm:inline-flex">
            Sign In
          </NeoButton>
          <NeoButton to="/onboarding">Start Free</NeoButton>
        </div>
      </div>
    </header>
  );
}