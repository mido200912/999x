/**
 * pages/ClientTickets.tsx — Ticket Center + Webhook Integration
 * Full neo-cyber UI • Priority glows • Timeline threads
 * No mock data — real API only.
 */
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { api } from '../../lib/api';
import { storage, LS_KEYS } from '../../lib/storage';
import { MessageSquare, Plus, X, Zap, Smartphone, Monitor, Inbox, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

type Ticket = { _id: string; subject: string; urgency: string; status: string; aiSuggestedSolution?: string; source?: string; createdAt?: string };

const PRIORITY_STYLES: Record<string, string> = {
  NORMAL: 'bg-white/5 border-white/10 text-white/50',
  URGENT: 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
  CRITICAL_BLOCKER: 'bg-red-500/15 border-red-500/40 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
};

const URGENCY_DOT: Record<string, string> = {
  NORMAL: 'bg-white/40', URGENT: 'bg-amber-400', CRITICAL_BLOCKER: 'bg-red-400 animate-pulse',
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'text-amber-400', IN_PROGRESS: 'text-lime', RESOLVED: 'text-white/40 line-through',
};

// ── New Ticket Modal ──────────────────────────────────────────────────────────
function NewTicketModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (subject: string, urgency: string) => Promise<void> }) {
  const [subject, setSubject] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) { setError('Please describe the issue'); return; }
    setLoading(true); setError('');
    try { await onSubmit(subject.trim(), urgency); onClose(); }
    catch (err: any) { setError(err.message || 'Failed to submit ticket'); }
    finally { setLoading(false); }
  };

  const URGENCY_OPTS = [
    { id: 'NORMAL', label: 'Normal', desc: 'Non-blocking issue', color: 'hover:border-white/30', active: 'bg-white/10 border-white/30 text-white' },
    { id: 'URGENT', label: 'Urgent', desc: 'Needs attention soon', color: 'hover:border-amber-500/40', active: 'bg-amber-500/20 border-amber-500/50 text-amber-400' },
    { id: 'CRITICAL_BLOCKER', label: 'Critical', desc: 'Ops is blocked!', color: 'hover:border-red-500/40', active: 'bg-red-500/20 border-red-500/50 text-red-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass-panel rounded-3xl p-7 w-full max-w-[520px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-black text-pistachio text-[22px]">Open New Ticket</h2>
            <p className="text-[12px] text-white/40 mt-1">999x AI Engine will triage and respond automatically</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">ISSUE DESCRIPTION *</label>
            <textarea autoFocus value={subject} onChange={e => setSubject(e.target.value)} placeholder="Describe the blocker in detail — the more context you provide, the better our AI can respond..." rows={4} className="w-full rounded-xl px-4 py-3 bg-canvas border border-white/10 text-pistachio text-[13px] placeholder-white/20 focus:border-lime/50 outline-none resize-none transition-all leading-relaxed" />
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-white/40 mb-2 block">URGENCY LEVEL</label>
            <div className="grid grid-cols-3 gap-2">
              {URGENCY_OPTS.map(u => (
                <button key={u.id} type="button" onClick={() => setUrgency(u.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${urgency === u.id ? u.active : `bg-canvas border-white/10 text-white/40 ${u.color}`}`}>
                  <div className={`flex items-center gap-1.5 mb-1 text-[12px] font-bold`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${urgency === u.id ? URGENCY_DOT[u.id] : 'bg-white/20'}`} />
                    {u.label}
                  </div>
                  <div className="text-[10px] opacity-60 leading-snug">{u.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px]">{error}</div>}

          <div className="flex gap-3 pt-1">
            <NeoButton type="submit" disabled={loading} className="flex-1">
              {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />Submitting...</span>
                : <span className="flex items-center gap-2 justify-center"><Zap className="w-4 h-4" />Submit Ticket</span>}
            </NeoButton>
            <button type="button" onClick={onClose} className="px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-pistachio/60 text-[13px] hover:border-white/20 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Ticket Detail Modal ───────────────────────────────────────────────────────
function TicketDetailModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass-panel rounded-3xl p-7 w-full max-w-[560px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-5">
          <div className="flex-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${PRIORITY_STYLES[ticket.urgency] || PRIORITY_STYLES.NORMAL} mb-3`}>
              <span className={`w-1.5 h-1.5 rounded-full ${URGENCY_DOT[ticket.urgency] || 'bg-white/30'}`} />
              {ticket.urgency.replace('_', ' ')}
            </span>
            <h2 className="font-display font-black text-pistachio text-[18px] leading-snug">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center ml-4 shrink-0"><X className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'STATUS', value: ticket.status.replace('_', ' '), color: STATUS_COLORS[ticket.status] || 'text-white/40' },
            { label: 'SOURCE', value: ticket.source?.replace('_', ' ') || 'WEB', color: 'text-white/60' },
            { label: 'OPENED', value: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '—', color: 'text-white/40' },
          ].map(m => (
            <div key={m.label} className="p-3 rounded-xl bg-canvas border border-white/10 text-center">
              <div className="text-[9px] font-mono text-white/30 tracking-widest">{m.label}</div>
              <div className={`font-mono font-bold text-[12px] mt-1 ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {ticket.aiSuggestedSolution && (
          <div className="p-4 rounded-2xl bg-lime/5 border border-lime/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-lime" />
              <div className="text-[10px] font-mono text-lime/70 tracking-widest">AI ACTION TAKEN</div>
            </div>
            <p className="text-[13px] text-pistachio/80 leading-relaxed">{ticket.aiSuggestedSolution}</p>
          </div>
        )}

        {ticket.status === 'RESOLVED' && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400 text-[12px] font-mono">
            <CheckCircle2 className="w-4 h-4" /> This ticket has been resolved
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClientTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [detail, setDetail] = useState<Ticket | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    const c = storage.get<any>(LS_KEYS.CLIENT, null);
    setClient(c);
    const cid = new URLSearchParams(location.search).get('id') || c?.id;
    if (!cid) { setLoading(false); return; }
    try {
      const data = await api<Ticket[]>(`/clients/${cid}/tickets`);
      setTickets(Array.isArray(data) ? data : (data as any).data || []);
    } catch {
      setTickets([]); // No mock data
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const createTicket = async (subject: string, urgency: string) => {
    const cid = new URLSearchParams(location.search).get('id') || client?.id || 'demo';
    await api(`/clients/${cid}/tickets`, { method: 'POST', body: JSON.stringify({ subject, urgency, source: 'WEB_DASHBOARD' }) });
    showToast('Ticket submitted — AI is triaging');
    load();
  };

  const openCount = tickets.filter(t => t.status === 'OPEN').length;
  const criticalCount = tickets.filter(t => t.urgency === 'CRITICAL_BLOCKER').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="font-display font-black text-[28px] text-pistachio flex items-center gap-3">
              <MessageSquare className="w-7 h-7 text-lime" /> Ticketing Center
            </h1>
            <p className="text-white/50 text-[14px] mt-1">Cross-channel support matrix · Synced with WhatsApp Webhooks</p>
          </div>
          <NeoButton onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" /> New Ticket
          </NeoButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'TOTAL', value: tickets.length, color: 'text-pistachio', icon: <MessageSquare className="w-5 h-5" /> },
            { label: 'OPEN', value: openCount, color: 'text-amber-400', icon: <Clock className="w-5 h-5" /> },
            { label: 'CRITICAL', value: criticalCount, color: 'text-red-400', icon: <AlertTriangle className="w-5 h-5" /> },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl bg-surface/40 border border-white/10 text-center">
              <div className={`flex justify-center mb-1 ${s.color} opacity-50`}>{s.icon}</div>
              <div className={`font-mono font-black text-[28px] ${s.color}`}>{s.value}</div>
              <div className="text-[10px] font-mono text-white/30 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* WhatsApp Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-pistachio text-[14px]">WhatsApp Integration Active</div>
              <div className="text-[12px] text-white/50 mt-0.5">Text the War Room directly — AI triages automatically</div>
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-canvas border border-white/10 font-mono text-emerald-400 text-[13px] tracking-widest font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            +20 101 999 3801
          </div>
        </div>

        {/* Tickets List */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-24 rounded-2xl bg-white/5" />
            <div className="h-24 rounded-2xl bg-white/5" />
          </div>
        ) : tickets.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="flex justify-center mb-4"><div className="w-16 h-16 rounded-2xl bg-surface border border-white/10 flex items-center justify-center"><Inbox className="w-8 h-8 text-white/20" /></div></div>
            <div className="font-bold text-pistachio text-[18px]">No open tickets</div>
            <p className="text-white/40 text-[13px] mt-2 max-w-[300px] mx-auto">Operations are running smoothly. Open a ticket here or text the WhatsApp number if issues arise.</p>
            <NeoButton onClick={() => setShowModal(true)} variant="glass" className="mt-6"><Plus className="w-4 h-4" /> Open First Ticket</NeoButton>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {tickets.map(t => (
              <GlassCard key={t._id} className="relative overflow-hidden group hover:border-lime/20 transition-colors cursor-pointer" onClick={() => setDetail(t)}>
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${t.urgency === 'CRITICAL_BLOCKER' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : t.urgency === 'URGENT' ? 'bg-amber-500' : 'bg-white/10'}`} />
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start pl-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1.5 ${PRIORITY_STYLES[t.urgency] || PRIORITY_STYLES.NORMAL}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${URGENCY_DOT[t.urgency]}`} /> {t.urgency.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                        {t.source === 'WHATSAPP' ? <><Smartphone className="w-3 h-3" /> WHATSAPP</> : <><Monitor className="w-3 h-3" /> WEB</>}
                      </span>
                      {t.createdAt && <span className="text-[10px] font-mono text-white/20">{new Date(t.createdAt).toLocaleDateString()}</span>}
                    </div>
                    <h3 className="font-bold text-pistachio text-[15px] leading-snug">{t.subject}</h3>
                    {t.aiSuggestedSolution && (
                      <div className="mt-3 p-3 rounded-xl bg-lime/5 border border-lime/20 flex gap-3 items-start">
                        <Zap className="w-4 h-4 text-lime mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-mono text-lime/60 mb-1 tracking-widest">AI ACTION TAKEN</div>
                          <p className="text-[12px] text-pistachio/80 leading-relaxed line-clamp-2">{t.aiSuggestedSolution}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-4">
                    <div className={`text-[12px] font-mono font-bold tracking-widest ${STATUS_COLORS[t.status] || 'text-white/40'}`}>{t.status}</div>
                    <span className="text-[11px] text-lime/60 group-hover:text-lime transition-colors">View Thread →</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {showModal && <NewTicketModal onClose={() => setShowModal(false)} onSubmit={createTicket} />}
      {detail && <TicketDetailModal ticket={detail} onClose={() => setDetail(null)} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-lime/30 bg-canvas text-lime text-[13px] font-bold shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <Zap className="w-4 h-4" /> {toast}
        </div>
      )}
    </DashboardLayout>
  );
}
