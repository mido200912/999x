/**
 * components/layout/DashboardLayout.tsx — Dashboard Layout (Client/Admin)
 * Collapsible sidebar + notifications + user badge + token budget + sponsor link
 */
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { storage, LS_KEYS } from '../../lib/storage';
import { Home, Map, Ticket, Diamond, Zap, FlaskConical, Users, Bell, ArrowLeft, CheckCircle, Activity, Menu, X, UserCheck, Terminal, Inbox } from 'lucide-react';
import { CompanySwitcher } from '../ui/CompanySwitcher';
import { AICoPilotDrawer } from '../ui/AICoPilotDrawer';

type Props = { children: ReactNode };

export function DashboardLayout({ children }: Props) {
  const loc = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const client = storage.get<any>(LS_KEYS.CLIENT, null);
  const isActive = (p: string) => loc.pathname === p;

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
      active
        ? 'bg-lime/10 text-lime font-bold shadow-[inset_0_0_16px_rgba(163,230,53,0.1)] border border-lime/20'
        : 'hover:bg-white/5 text-pistachio/70 hover:text-pistachio border border-transparent'
    }`;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-[72px] flex items-center gap-3 px-6 border-b border-white/10 shrink-0">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-lime/20 shadow-[0_0_15px_rgba(138,154,91,0.3)]">
          <img src="/logo_999x.jpg" alt="999x Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="font-black text-pistachio text-[15px] tracking-tight">999x Hub</div>
          <div className="font-mono text-[10px] text-white/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            LIVE OPS
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        <div className="text-[10px] font-mono tracking-widest text-white/25 mb-3 px-3">CLIENT HUB</div>
        <Link to="/client/dashboard" className={linkCls(isActive('/client/dashboard'))} onClick={() => setSidebarOpen(false)}>
          <Home className="w-4 h-4" /> Client Dashboard
        </Link>
        <Link to="/client/roadmap" className={linkCls(isActive('/client/roadmap'))} onClick={() => setSidebarOpen(false)}>
          <Map className="w-4 h-4" /> Roadmap
        </Link>
        <Link to="/client/tickets" className={linkCls(isActive('/client/tickets'))} onClick={() => setSidebarOpen(false)}>
          <Ticket className="w-4 h-4" /> Tickets
        </Link>
        <Link to="/sponsor-studio" className={linkCls(isActive('/sponsor-studio'))} onClick={() => setSidebarOpen(false)}>
          <Diamond className="w-4 h-4" /> Sponsor Studio
        </Link>

        <div className="pt-4 mt-4 border-t border-white/10 text-[10px] font-mono tracking-widest text-white/25 mb-3 px-3">
          OPS WAR ROOM
        </div>
        <Link to="/admin/approvals" className={linkCls(isActive('/admin/approvals'))} onClick={() => setSidebarOpen(false)}>
          <Inbox className="w-4 h-4" /> Inbox / Approvals
        </Link>
        <Link to="/admin/cockpit" className={linkCls(isActive('/admin/cockpit'))} onClick={() => setSidebarOpen(false)}>
          <Zap className="w-4 h-4" /> War Room Kanban
        </Link>
        <Link to="/admin/ai-studio" className={linkCls(isActive('/admin/ai-studio'))} onClick={() => setSidebarOpen(false)}>
          <FlaskConical className="w-4 h-4" /> AI Studio
        </Link>
        <Link to="/admin/crm" className={linkCls(isActive('/admin/crm'))} onClick={() => setSidebarOpen(false)}>
          <Users className="w-4 h-4" /> CRM Ledger
        </Link>
        <Link to="/admin/prospects" className={linkCls(isActive('/admin/prospects'))} onClick={() => setSidebarOpen(false)}>
          <UserCheck className="w-4 h-4" /> Prospects CRM
        </Link>
        <Link to="/admin/dev" className={linkCls(isActive('/admin/dev'))} onClick={() => setSidebarOpen(false)}>
          <Terminal className="w-4 h-4" /> Developer Ops
        </Link>

        <div className="mt-6">
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-pistachio/50 text-[12px] hover:border-lime/30 transition-all">
            <ArrowLeft className="w-4 h-4" /> Landing Page
          </Link>
        </div>
      </nav>

      {/* Token Budget */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <div className="rounded-xl p-3 bg-canvas border border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-[10px] font-mono text-white/40">TOKEN BUDGET</div>
            <div className="font-mono text-lime font-bold text-[11px]">62% used</div>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-lime rounded-full transition-all duration-700" style={{ width: '62%' }} />
          </div>
          <div className="font-mono text-pistachio/70 text-[12px] mt-1">124K / 200K tokens</div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-white/10 sticky top-0 h-screen" style={{ background: 'rgba(34,6,51,0.97)' }}>
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] flex flex-col border-r border-white/10 lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'rgba(34,6,51,0.99)' }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top header */}
        <header className="h-[64px] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 backdrop-blur-xl shrink-0" style={{ background: 'rgba(21,3,32,0.90)' }}>
          <div className="flex items-center gap-3">
            {/* Mobile burger */}
            <button
              id="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pistachio/60 hover:border-lime/30 transition-all"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="font-mono text-[12px] text-white/50 hidden sm:block">LIVE OPS • minimax/m3:free</span>
            </div>
            <CompanySwitcher />
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                id="notif-bell"
                onClick={() => setNotifOpen(o => !o)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pistachio/70 hover:border-lime/30 transition-all relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-lime text-canvas text-[10px] font-bold flex items-center justify-center">2</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 glass-panel rounded-2xl p-4 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-mono text-[11px] text-white/40">NOTIFICATIONS</div>
                    <button onClick={() => setNotifOpen(false)} className="text-white/40 hover:text-white"><X className="w-3 h-3" /></button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-lime/10 border border-lime/20 text-[12px] flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-lime mt-0.5 shrink-0" />
                      <div>
                        <span className="text-lime font-bold">New ticket resolved</span>
                        <div className="text-white/50 text-[11px] mt-0.5">Speaker dropout — alternative found</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[12px] flex items-start gap-3">
                      <Activity className="w-4 h-4 text-pistachio mt-0.5 shrink-0" />
                      <div>
                        <span className="text-pistachio font-bold">Health score updated</span>
                        <div className="text-white/50 text-[11px] mt-0.5">72 → 85 after RACI restructuring</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-lime/30 to-violet/30 border border-lime/20 flex items-center justify-center font-bold text-[11px] text-pistachio">
                {client?.name?.[0]?.toUpperCase() ?? 'A'}
              </div>
              <div className="hidden sm:block">
                <div className="text-[12px] font-bold text-pistachio leading-none">{client?.name ?? 'Admin'}</div>
                <div className="text-[10px] font-mono text-lime leading-none mt-0.5">SUPER_ADMIN</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">{children}</main>
      </div>

      {/* Floating Autonomous AI Co-Pilot */}
      <AICoPilotDrawer />
    </div>
  );
}