import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { api } from '../../lib/api';
import { 
  Inbox, 
  Building2, 
  Check, 
  X, 
  AlignLeft,
  Clock,
  Briefcase
} from 'lucide-react';

type PendingClient = {
  _id: string;
  organizationName: string;
  subtitle: string;
  description?: string;
  companyType?: string;
  companyTypeCustom?: string;
  eventDetails?: { expectedDate?: string; budget?: string; attendeesCount?: string };
  customDetails?: Array<{ key: string; value: string }>;
  primaryContact?: { name: string; phone: string; email?: string };
  createdAt: string;
};

function ApprovalModal({ client, onClose, onAction }: { client: PendingClient; onClose: () => void; onAction: (id: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void> }) {
  const [processing, setProcessing] = useState(false);

  const handle = async (status: 'ACCEPTED' | 'REJECTED') => {
    setProcessing(true);
    await onAction(client._id, status);
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass-panel rounded-3xl p-7 w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-lime/20" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono tracking-widest uppercase">Pending Approval</span>
            </div>
            <h2 className="font-display font-black text-pistachio text-[24px]">{client.organizationName}</h2>
            <p className="text-[13px] text-lime mt-1 font-mono">{client.companyTypeCustom || client.subtitle} {client.companyType === 'EVENT' ? '• EVENT' : ''}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-4 rounded-2xl bg-canvas border border-white/10 mb-6">
          <div className="text-[10px] font-mono text-white/30 tracking-widest mb-3 text-center">CONTACT INFO</div>
          <div className="text-center">
            <div className="font-bold text-pistachio text-[14px]">{client.primaryContact?.name || 'Unknown'}</div>
            <div className="font-mono text-white/50 text-[12px] mt-1">{client.primaryContact?.phone || 'No Phone'}</div>
            {client.primaryContact?.email && <div className="text-white/40 text-[11px] mt-1 truncate">{client.primaryContact.email}</div>}
          </div>
        </div>

        {/* Dynamic Fields Section */}
        {(client.companyType === 'EVENT' || (client.customDetails && client.customDetails.length > 0)) && (
          <div className="mb-6 grid sm:grid-cols-2 gap-3">
            {client.companyType === 'EVENT' && client.eventDetails && (
              <div className="sm:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-[10px] text-white/30 font-mono tracking-widest mb-1">DATE</div>
                  <div className="text-[12px] text-pistachio">{client.eventDetails.expectedDate || '—'}</div>
                </div>
                <div className="border-l border-white/10">
                  <div className="text-[10px] text-white/30 font-mono tracking-widest mb-1">BUDGET</div>
                  <div className="text-[12px] text-pistachio">{client.eventDetails.budget || '—'}</div>
                </div>
                <div className="border-l border-white/10">
                  <div className="text-[10px] text-white/30 font-mono tracking-widest mb-1">ATTENDEES</div>
                  <div className="text-[12px] text-pistachio">{client.eventDetails.attendeesCount || '—'}</div>
                </div>
              </div>
            )}

            {client.customDetails && client.customDetails.map((cd, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[10px] font-mono text-lime/70 uppercase tracking-widest mb-1">{cd.key}</div>
                <div className="text-[13px] text-pistachio">{cd.value}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mb-8">
          <div className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> COMPANY DETAILS</div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/70 text-[13px] leading-relaxed whitespace-pre-wrap">
            {client.description || <span className="italic text-white/30">No details provided.</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button 
            onClick={() => handle('REJECTED')} 
            disabled={processing}
            className="flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-[13px] transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Reject & Delete
          </button>
          
          <NeoButton 
            onClick={() => handle('ACCEPTED')} 
            disabled={processing} 
            className="flex-1 h-12"
          >
            {processing ? 'Processing...' : <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Accept Registration</span>}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}

export default function AdminApprovals() {
  const [pending, setPending] = useState<PendingClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PendingClient | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<PendingClient[]>('/admin/crm/pending');
      setPending(Array.isArray(data) ? data : (data as any).data || []);
    } catch (err) {
      console.error('[AdminApprovals] Error loading:', err);
      setPending([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api(`/admin/crm/${id}/status`, { 
        method: 'PATCH', 
        body: JSON.stringify({ status }) 
      });
      showToast(`Registration ${status.toLowerCase()} successfully`);
      setSelected(null);
      load();
    } catch (e: any) {
      showToast(e.message || 'Failed to process action');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-[90vh]">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3 text-[10px] font-mono text-amber-400 tracking-widest">
            <Inbox className="w-3 h-3" /> INBOX / APPROVALS
          </div>
          <h1 className="font-display font-black text-[28px] text-pistachio tracking-tight">Pending Registrations</h1>
          <p className="text-[13px] text-white/40 mt-1">Review new companies that registered via the Onboarding form.</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div className="px-4 py-3 rounded-xl bg-lime/10 border border-lime/20 text-lime text-[13px] font-medium shadow-2xl backdrop-blur-md">
              {toast}
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : pending.length === 0 ? (
          <GlassCard className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-lime/30" />
            </div>
            <h3 className="text-[16px] font-bold text-pistachio mb-1">Inbox Zero</h3>
            <p className="text-[13px] text-white/40">No pending registrations to review right now.</p>
          </GlassCard>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map(c => (
              <GlassCard 
                key={c._id} 
                className="p-5 cursor-pointer hover:border-lime/30 transition-all group relative overflow-hidden"
                onClick={() => setSelected(c)}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500/50" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-lime transition-colors">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 truncate">
                    <h3 className="text-[15px] font-bold text-pistachio truncate">{c.organizationName}</h3>
                    <p className="text-[11px] text-white/50 font-mono truncate">{c.companyTypeCustom || c.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-[12px] text-white/70 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-white/30" />
                    <span className="truncate">{c.primaryContact?.name || 'No Contact'}</span>
                  </div>
                  <div className="text-[11px] text-white/40 font-mono">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-right">
                  <span className="text-[11px] font-bold text-lime/70 group-hover:text-lime transition-colors">
                    Review Details →
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {selected && <ApprovalModal client={selected} onClose={() => setSelected(null)} onAction={handleAction} />}
    </DashboardLayout>
  );
}
