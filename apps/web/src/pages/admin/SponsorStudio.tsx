import { DashboardLayout } from '../../components/layout/DashboardLayout';
/**
 * pages/SponsorStudio.tsx — Event Ops Studio
 * AI-generated event package tiers • Copy proposal • Animated package cards
 * 999x organizes conferences, summits, and events FOR these companies.
 */
import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { api } from '../../lib/api';
import { storage, LS_KEYS } from '../../lib/storage';
import { Calendar, Zap, Loader2, CheckCircle, ClipboardCopy, Target, BarChart3, Plus, X, Trash2 } from 'lucide-react';

type Tier = {
  name: string;
  price: string;
  perks: string[];
  email: string;
  color: string;
  glow: string;
};

const DEFAULT_TIERS: Tier[] = [
  {
    name: 'Full Execution Package',
    price: '$12,000',
    color: 'from-amber-400/30 to-amber-600/10',
    glow: 'shadow-[0_0_40px_rgba(251,191,36,0.25)] border-amber-400/40',
    perks: [
      'End-to-end event planning & logistics',
      'Venue sourcing + floor plan design',
      'Full speaker & agenda management',
      'Marketing campaign (digital + print)',
      'On-site ops team (day-of execution)',
      'Post-event analytics report',
    ],
    email: 'Dear [Client Name],\n\nWe are thrilled to propose 999x as your Full Execution Partner for [EVENT NAME].\n\nThis comprehensive package covers every aspect of your event — from venue coordination to post-event reporting — ensuring a flawless experience for your attendees.\n\nInvestment: $12,000\n\nWarm regards,\n[Account Manager]\n999x Operations Hub — Powered by AI',
  },
  {
    name: 'Marketing & PR Package',
    price: '$5,500',
    color: 'from-violet/20 to-violet/10',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)] border-violet/30',
    perks: [
      'Brand identity & event visual design',
      'Social media campaign (pre/during/post)',
      'Press release + media outreach',
      'Sponsorship pitch deck creation',
      'Email marketing to 5K+ audience',
      'Event highlight reel (video edit)',
    ],
    email: 'Dear [Client Name],\n\nWe propose the 999x Marketing & PR Package for [EVENT NAME].\n\nFrom social media buzz to press coverage, we handle all your event communications to maximize reach and attendee turnout.\n\nInvestment: $5,500\n\nBest,\n[Account Manager]\n999x Operations Hub — Powered by AI',
  },
  {
    name: 'Event Planning Package',
    price: '$2,800',
    color: 'from-emerald-600/20 to-emerald-900/10',
    glow: 'shadow-[0_0_25px_rgba(52,211,153,0.12)] border-emerald-600/30',
    perks: [
      'Strategic event roadmap & timeline',
      'Vendor sourcing & coordination',
      'Volunteer team RACI setup',
      'Budget planning & tracking',
      'Run-of-show document',
    ],
    email: 'Dear [Client Name],\n\nWe\'d love to support [EVENT NAME] with the 999x Event Planning Package.\n\nOur team will architect the full operational blueprint — timeline, vendors, team structure — giving you a ready-to-execute event plan.\n\nInvestment: $2,800\n\nThank you,\n[Account Manager]\n999x Operations Hub — Powered by AI',
  },
];

type Lead = { _id?: string; name: string; company: string; status: string };

export default function SponsorStudio() {
  const client = storage.get<any>(LS_KEYS.CLIENT, null);
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  /**
   * Pipeline State
   * Stores event partner leads fetched from the backend.
   * `addLeadOpen` controls the Add Partner modal visibility.
   */
  const [pipeline, setPipeline] = useState<Lead[]>([]);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [pipelineLoading, setPipelineLoading] = useState(false);

  /**
   * Load Event Partner Leads from Backend
   * Fetches the persistent event partners pipeline from /admin/sponsor-leads.
   * Falls back to empty state if the DB is not connected.
   */
  const loadLeads = async () => {
    setPipelineLoading(true);
    try {
      const data = await api<Lead[]>('/admin/sponsor-leads');
      if (Array.isArray(data)) setPipeline(data);
    } catch (err) {
      console.error('[Event Ops Studio] Error loading event partners:', err);
      setPipeline([]);
    } finally { setPipelineLoading(false); }
  };

  useEffect(() => { loadLeads(); }, []);

  /**
   * Package Tier Generation
   * Calls the AI backend to regenerate event package tiers based on the client's
   * category and event type. Keeps defaults on failure.
   */
  const generate = async () => {
    setLoading(true);
    try {
      const data = await api<{ tiers: Tier[] }>('/ai/generate-sponsor-pitch', {
        method: 'POST',
        body: JSON.stringify({ category: client?.category || 'EVENT', clientName: client?.name || 'Demo Org' }),
      });
      if ((data as any).tiers?.length) setTiers((data as any).tiers);
    } catch (err) {
      console.error('[Event Ops Studio] AI Package Generation failed:', err);
      // Keep defaults if AI is not connected
    } finally { setLoading(false); }
  };

  /**
   * Proposal Copy Feature
   * Copies the pre-generated event proposal template for a given package to the clipboard.
   */
  const copy = (idx: number) => {
    navigator.clipboard.writeText(tiers[idx].email).then(() => {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  };

  /**
   * Add Event Partner to Pipeline
   * Creates a new event partner lead in the backend and updates local state.
   */
  const addLead = async () => {
    if (!leadName.trim() || !leadCompany.trim()) return;
    try {
      const res = await api<Lead>('/admin/sponsor-leads', {
        method: 'POST',
        body: JSON.stringify({
          clientId: client?._id || 'demo',
          name: leadName.trim(),
          company: leadCompany.trim(),
          status: 'INTERESTED'
        })
      });
      setPipeline(p => [...p, res]);
    } catch (err) {
      console.error('[Event Ops Studio] Failed to add event partner:', err);
    }
    setLeadName(''); setLeadCompany(''); setAddLeadOpen(false);
  };

  /**
   * Update Partner Status
   * Syncs status changes to the backend in real-time.
   */
  const updateStatus = async (lead: Lead, newStatus: string) => {
    setPipeline(p => p.map(l => l._id === lead._id ? { ...l, status: newStatus } : l));
    if (lead._id) {
      await api(`/admin/sponsor-leads/${lead._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      }).catch((err) => console.error('[Event Ops Studio] Status update failed:', err));
    }
  };

  /**
   * Delete Event Partner
   * Removes an event partner from both the UI and backend.
   */
  const deleteLead = async (lead: Lead, idx: number) => {
    setPipeline(p => p.filter((_, j) => j !== idx));
    if (lead._id) {
      await api(`/admin/sponsor-leads/${lead._id}`, { method: 'DELETE' }).catch((err) => console.error('[Event Ops Studio] Delete failed:', err));
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    INTERESTED: 'bg-blue-500/15 text-blue-400 border-blue-400/30',
    NEGOTIATING: 'bg-amber-500/15 text-amber-400 border-amber-400/30',
    CLOSED_WON: 'bg-lime/15 text-lime border-lime/30',
    CLOSED_LOST: 'bg-red-500/10 text-red-400 border-red-400/20',
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="font-display font-black text-[28px] text-pistachio flex items-center gap-3">
              <Calendar className="w-7 h-7 text-lime" /> Event Ops Studio
              <span className="text-[12px] font-mono px-2.5 py-0.5 rounded-full bg-lime/10 text-lime border border-lime/20 tracking-widest">إدارة المؤتمرات</span>
            </h1>
            <p className="text-white/50 text-[14px] mt-1">AI-generated event packages • Proposal copy • Live partners pipeline</p>
          </div>
          <NeoButton onClick={generate} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Zap className="w-4 h-4" /> AI Generate Event Package</>}
          </NeoButton>
        </div>

        {/* Package cards */}
        <div className="grid lg:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`glass-panel rounded-3xl p-6 border transition-all duration-300 cursor-pointer ${tier.glow} ${expanded === i ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {/* Tier header */}
              <div className={`inline-flex items-center px-4 py-2 rounded-2xl bg-gradient-to-r ${tier.color} mb-4`}>
                <span className="font-mono font-black text-[13px] text-pistachio">{tier.name}</span>
              </div>
              <div className="font-display font-black text-[32px] text-pistachio">{tier.price}</div>
              <div className="text-[12px] text-white/30 font-mono mb-4">PER EVENT</div>

              {/* Deliverables */}
              <ul className="space-y-2">
                {tier.perks.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-[13px] text-pistachio/70">
                    <CheckCircle className="w-3.5 h-3.5 text-lime mt-0.5 shrink-0" /> {p}
                  </li>
                ))}
              </ul>

              {/* Expanded proposal */}
              {expanded === i && (
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="text-[10px] font-mono text-white/30 mb-2 tracking-widest">EVENT PROPOSAL TEMPLATE</div>
                  <pre className="text-[11px] text-pistachio/60 whitespace-pre-wrap leading-relaxed font-mono bg-canvas rounded-xl p-3 max-h-40 overflow-auto">
                    {tier.email}
                  </pre>
                  <button
                    onClick={e => { e.stopPropagation(); copy(i); }}
                    className={`w-full mt-3 h-10 rounded-xl border text-[12px] font-bold transition-all flex items-center justify-center gap-2 ${
                      copiedIdx === i
                        ? 'bg-lime/20 border-lime/40 text-lime'
                        : 'bg-white/5 border-white/10 text-pistachio/60 hover:border-lime/30'
                    }`}
                  >
                    {copiedIdx === i ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><ClipboardCopy className="w-4 h-4" /> Copy Proposal Template</>}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* AI Sector Recommendations */}
        <GlassCard>
          <h3 className="font-bold text-pistachio text-[16px] mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-lime" /> Recommended Sectors for Event Partnerships
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { sector: 'Government & Ministries', match: '96%', companies: 'ITIDA, MCIT, Smart Egypt', tip: 'Emphasize official documentation, media coverage & national reach' },
              { sector: 'Universities & Research', match: '91%', companies: 'AUC, GUC, Cairo University', tip: 'Student engagement + academic credibility positioning' },
              { sector: 'Tech & VC', match: '84%', companies: 'Sawari, A15, Flat6Labs', tip: 'Startup pitch stages + investor networking sessions' },
              { sector: 'Media & Broadcasting', match: '78%', companies: 'MBC, Al-Arabiya, ONTV', tip: 'Live coverage + post-event highlight packages' },
            ].map((rec, i) => (
              <div key={i} className="p-4 rounded-2xl border border-white/10 bg-canvas/50 hover:border-lime/20 transition-all">
                <div className="font-bold text-pistachio text-[13px]">{rec.sector}</div>
                <div className="font-mono text-lime font-black text-[20px] my-1">{rec.match}</div>
                <div className="text-[11px] text-white/40 mb-2">Match Score</div>
                <div className="text-[11px] text-white/50">{rec.companies}</div>
                <div className="mt-2 text-[11px] text-lime/70 italic">{rec.tip}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Event Partners Pipeline */}
        <GlassCard>
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-pistachio text-[16px] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-lime" /> Event Partners Pipeline
            </h3>
            <button
              onClick={() => setAddLeadOpen(true)}
              className="px-4 h-9 rounded-xl bg-lime/10 border border-lime/20 text-lime text-[12px] font-bold hover:bg-lime/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Partner
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[10px] font-mono text-white/30">
                <tr className="border-b border-white/10">
                  <th className="py-2 text-left">CONTACT</th>
                  <th className="py-2 text-left">ORGANIZATION</th>
                  <th className="py-2 text-left">STATUS</th>
                  <th className="py-2 text-left">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pipelineLoading ? (
                  <tr><td colSpan={4} className="py-6 text-center text-[12px] text-white/30 font-mono">LOADING PARTNERS...</td></tr>
                ) : pipeline.map((lead, i) => (
                  <tr key={lead._id || i} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-bold text-pistachio">{lead.name}</td>
                    <td className="py-3 text-white/60">{lead.company}</td>
                    <td className="py-3">
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead, e.target.value)}
                        className={`px-2 py-1 rounded-full border text-[11px] font-mono font-bold bg-transparent outline-none cursor-pointer ${STATUS_COLORS[lead.status] || 'bg-white/5 text-white/40 border-white/10'}`}
                      >
                        <option value="INTERESTED">INTERESTED</option>
                        <option value="NEGOTIATING">NEGOTIATING</option>
                        <option value="CLOSED_WON">CLOSED_WON</option>
                        <option value="CLOSED_LOST">CLOSED_LOST</option>
                      </select>
                    </td>
                    <td className="py-3">
                      <button onClick={() => deleteLead(lead, i)} className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!pipelineLoading && pipeline.length === 0 && (
                  <tr><td colSpan={4} className="py-10 text-center text-[12px] text-white/30">
                    <Plus className="w-6 h-6 mx-auto mb-2 opacity-30" />
                    No event partners yet — add your first partner
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Add Event Partner Modal */}
      {addLeadOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={() => setAddLeadOpen(false)}>
          <div className="glass-panel rounded-3xl p-7 w-full max-w-[440px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-display font-black text-pistachio text-[20px]">Add Event Partner</h2>
                <p className="text-[12px] text-white/40 mt-1">Track a new organization in your event partners pipeline</p>
              </div>
              <button onClick={() => setAddLeadOpen(false)} className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">CONTACT NAME *</label>
                <input
                  autoFocus
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLead()}
                  placeholder="e.g. Ahmed Kamal"
                  className="w-full h-11 px-4 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">ORGANIZATION *</label>
                <input
                  value={leadCompany}
                  onChange={e => setLeadCompany(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLead()}
                  placeholder="e.g. Ministry of Communications"
                  className="w-full h-11 px-4 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <NeoButton onClick={addLead} className="flex-1">
                <Plus className="w-4 h-4" /> Add to Pipeline
              </NeoButton>
              <button onClick={() => setAddLeadOpen(false)} className="px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-pistachio/60 text-[13px] hover:border-white/20 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
