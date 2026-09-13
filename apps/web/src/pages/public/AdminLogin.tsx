/**
 * pages/AdminLogin.tsx — Admin / Ops Login Page
 * For 999x team (SUPER_ADMIN, OPS_MEMBER) to access War Room
 * Same API: POST /api/auth/login, but checks role
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { SiteHeader } from '../../components/layout/SiteHeader';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@999x.earth');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * handleLogin
   * Authentication flow for 999x internal team:
   * 1. POST credentials to /api/auth/login
   * 2. Role-guard: only SUPER_ADMIN and OPS_MEMBER can enter the War Room
   * 3. On success: persist JWT and user object to localStorage, redirect to /admin/cockpit
   * 4. Demo fallback: if the API is unreachable, accepts a hardcoded admin123 password
   *    so the demo site works without a live backend.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const api = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${api}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error?.message || 'Login failed');
      if (!['SUPER_ADMIN', 'OPS_MEMBER'].includes(j.data.user.role)) {
        throw new Error('Not an admin account — use Client Login');
      }
      localStorage.setItem('999x_user', JSON.stringify(j.data.user));
      localStorage.setItem('999x_token', j.data.accessToken);
      nav('/admin/cockpit');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader />
      <div className="max-w-[480px] mx-auto px-5 py-16">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-violet/30 shadow-[0_0_20px_rgba(107,33,168,0.4)] mx-auto">
            <img src="/logo_999x.jpg" alt="999x" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-display font-black text-[28px] text-pistachio mt-3">Ops War Room Login</h1>
          <p className="text-white/50 text-[13px] mt-1">For 999x team only — SUPER_ADMIN / OPS_MEMBER</p>
        </div>

        <GlassCard className="border-violet/30">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[12px] font-bold text-pistachio">Ops Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@999x.earth"
                required
                className="w-full mt-1.5 h-11 rounded-xl px-3 bg-canvas border border-white/10 text-pistachio outline-none focus:border-violet"
              />
            </div>
            <div>
              <label className="text-[12px] font-bold text-pistachio">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full mt-1.5 h-11 rounded-xl px-3 bg-canvas border border-white/10 text-pistachio outline-none focus:border-violet"
              />
              <div className="text-[11px] text-white/30 mt-1">Demo: admin@999x.earth / admin123</div>
            </div>

            {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[12px]">{error}</div>}

            <NeoButton type="submit" disabled={loading} className="w-full bg-violet hover:bg-violet-600">
              {loading ? 'Signing in...' : 'Enter War Room →'}
            </NeoButton>

            <div className="text-center text-[12px] text-white/40">
              Client?{' '}
              <Link to="/login" className="text-lime hover:underline">
                Client Login
              </Link>
            </div>
          </form>
        </GlassCard>

        <div className="mt-4 p-3 rounded-xl bg-canvas border border-white/10 text-[11px] font-mono text-white/30">
          <div>Demo seed (run in api):</div>
          <div className="text-lime mt-1">POST /api/auth/register — email: admin@999x.earth / pass: admin123</div>
        </div>
      </div>
    </div>
  );
}
