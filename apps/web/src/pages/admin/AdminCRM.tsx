import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { api } from '../../lib/api';
import { Search, Users, Plus, X, Building2, ShieldCheck, Phone, AlignLeft, Briefcase, Edit2, Trash2 } from 'lucide-react';

type Client = {
  _id: string;
  organizationName: string;
  subtitle: string;
  description?: string;
  companyType?: string;
  companyTypeCustom?: string;
  eventDetails?: { expectedDate?: string; budget?: string; attendeesCount?: string };
  customDetails?: Array<{ key: string; value: string }>;
  operationalStage: string;
  healthScore: number;
  primaryContact?: { name: string; phone: string; email?: string };
  tokenBudget?: { tokensUsed: number; monthlyLimit: number };
};

type CreateForm = { orgName: string; subtitle: string; description: string; contactName: string; phone: string };

function RegisterModal({ onClose, onCreate }: { onClose: () => void; onCreate: (f: CreateForm) => Promise<void> }) {
  const [form, setForm] = useState<CreateForm>({ orgName: '', subtitle: '', description: '', contactName: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orgName.trim() || !form.subtitle.trim() || !form.phone.trim()) { setError('Please fill all required fields'); return; }
    setLoading(true); setError('');
    try { await onCreate(form); onClose(); }
    catch (err: any) { setError(err.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div className="glass-panel rounded-3xl p-7 w-full max-w-[500px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-black text-pistachio text-[22px]">Register Client</h2>
            <p className="text-[12px] text-white/40 mt-1">Initialize a new operational matrix</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">ORGANIZATION NAME *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={form.orgName} onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))} autoFocus placeholder="e.g. Acme Corp" className="w-full h-12 pl-10 pr-4 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">SUBTITLE / FIELD *</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} placeholder="e.g. FinTech Startup" className="w-full h-12 pl-10 pr-4 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">CONTACT NAME *</label>
              <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="John Doe" className="w-full h-12 px-3 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all text-[13px]" />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">PHONE NUMBER *</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+201000000000" dir="ltr" className="w-full h-12 px-3 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all text-[13px] font-mono" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono tracking-widest text-white/40 mb-1.5 block">DESCRIPTION</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Company details..." className="w-full p-3 rounded-xl bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 outline-none transition-all text-[13px] resize-y h-20" />
          </div>

          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px]">{error}</div>}

          <div className="flex gap-3 pt-2">
            <NeoButton type="submit" disabled={loading} className="flex-1">
              {loading ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />Saving...</span>
                : <span className="flex items-center gap-2 justify-center"><ShieldCheck className="w-4 h-4" />Register Client</span>}
            </NeoButton>
            <button type="button" onClick={onClose} className="px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-pistachio/60 text-[13px] hover:border-white/20 transition-all">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientDetailModal({ client, onClose, onUpdate, onDelete }: { client: Client; onClose: () => void; onUpdate: (id: string, updates: any) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const healthColor = client.healthScore >= 80 ? 'text-lime' : client.healthScore >= 50 ? 'text-amber-400' : 'text-red-400';
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    organizationName: client.organizationName,
    subtitle: client.subtitle,
    description: client.description || '',
    contactName: client.primaryContact?.name || '',
    phone: client.primaryContact?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const save = async () => {
    setSaving(true);
    await onUpdate(client._id, {
      organizationName: form.organizationName,
      subtitle: form.subtitle,
      description: form.description,
      'primaryContact.name': form.contactName,
      'primaryContact.phone': form.phone,
    });
    setSaving(false);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${client.organizationName}? This action cannot be undone.`)) {
      setDeleting(true);
      await onDelete(client._id);
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="glass-panel rounded-3xl p-7 w-full max-w-[600px] max-h-[90vh] overflow-y-auto shadow-[0_40px_100px_rgba(0,0,0,0.8)]" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1 pr-4">
            {isEditing ? (
              <input value={form.organizationName} onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))} className="w-full bg-canvas border border-white/10 rounded-lg px-3 py-1 font-display font-black text-pistachio text-[20px] mb-2 outline-none focus:border-lime/50" />
            ) : (
              <h2 className="font-display font-black text-pistachio text-[24px]">{client.organizationName}</h2>
            )}
            
            {isEditing ? (
              <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full bg-canvas border border-white/10 rounded-lg px-3 py-1 text-white/50 text-[13px] font-mono outline-none focus:border-lime/50" />
            ) : (
              <p className="text-[13px] text-lime mt-1 font-mono">{client.subtitle} • {client.operationalStage.replace(/_/g, ' ')}</p>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="w-9 h-9 rounded-full bg-white/5 text-pistachio/70 hover:bg-white/10 hover:text-lime transition-all flex items-center justify-center"><Edit2 className="w-4 h-4" /></button>
            )}
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-canvas border border-white/10 text-center">
            <div className="text-[10px] font-mono text-white/30 tracking-widest">HEALTH SCORE</div>
            <div className={`font-mono font-black text-[36px] mt-1 ${healthColor}`}>{client.healthScore}</div>
            <div className="text-[10px] text-white/30">/100</div>
          </div>
          
          <div className="p-4 rounded-2xl bg-canvas border border-white/10">
            <div className="text-[10px] font-mono text-white/30 tracking-widest mb-3 text-center">CONTACT INFO</div>
            {isEditing ? (
              <div className="space-y-2">
                <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="Name" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-pistachio text-[12px] outline-none" />
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" className="w-full bg-surface border border-white/10 rounded px-2 py-1 text-pistachio text-[12px] outline-none font-mono" />
              </div>
            ) : (
              <div className="text-center">
                <div className="font-bold text-pistachio text-[14px]">{client.primaryContact?.name || 'Unknown'}</div>
                <div className="font-mono text-white/50 text-[12px] mt-1">{client.primaryContact?.phone || 'No Phone'}</div>
                {client.primaryContact?.email && <div className="text-white/40 text-[11px] mt-1 truncate">{client.primaryContact.email}</div>}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Fields Section */}
        {(client.companyType === 'EVENT' || client.customDetails?.length) && !isEditing && (
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

        <div className="mb-6">
          <div className="text-[10px] font-mono text-white/30 tracking-widest mb-2 flex items-center gap-2"><AlignLeft className="w-3 h-3" /> COMPANY DETAILS</div>
          {isEditing ? (
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-32 p-3 rounded-xl bg-canvas border border-white/10 text-pistachio text-[13px] outline-none focus:border-lime/50 resize-y" />
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-white/70 text-[13px] leading-relaxed whitespace-pre-wrap">
              {client.description || <span className="italic text-white/30">No details provided.</span>}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button onClick={handleDelete} disabled={deleting} className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-[12px]">
            <Trash2 className="w-4 h-4" /> {deleting ? 'Deleting...' : 'Delete Company'}
          </button>
          
          {isEditing ? (
            <div className="flex gap-3">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg text-white/50 hover:text-white transition-colors text-[13px]">Cancel</button>
              <NeoButton onClick={save} disabled={saving} className="px-6 h-10">
                {saving ? 'Saving...' : 'Save Changes'}
              </NeoButton>
            </div>
          ) : (
            <button onClick={onClose} className="px-5 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors text-[13px]">
              Close Panel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCRM() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [detail, setDetail] = useState<Client | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<Client[]>('/admin/crm');
      setClients(Array.isArray(data) ? data : (data as any).data || []);
    } catch (err) {
      console.error('[AdminCRM] Error loading CRM data:', err);
      setClients([]);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    load();
    const handleRefresh = () => load();
    window.addEventListener('999x:data-updated', handleRefresh);
    window.addEventListener('999x:company-changed', handleRefresh);
    return () => {
      window.removeEventListener('999x:data-updated', handleRefresh);
      window.removeEventListener('999x:company-changed', handleRefresh);
    };
  }, []);

  const filtered = clients.filter(c => {
    return !q || c.organizationName.toLowerCase().includes(q.toLowerCase()) || c.subtitle.toLowerCase().includes(q.toLowerCase());
  });

  const updateClient = async (id: string, updates: any) => {
    try {
      await api(`/admin/crm/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
      showToast('Client updated successfully');
      load();
    } catch (e: any) {
      showToast(e.message || 'Failed to update client');
    }
  };

  const deleteClient = async (id: string) => {
    try {
      await api(`/admin/crm/${id}`, { method: 'DELETE' });
      showToast('Client deleted successfully');
      setDetail(null);
      load();
    } catch (e: any) {
      showToast(e.message || 'Failed to delete client');
    }
  };

  const create = async (form: CreateForm) => {
    await api('/admin/crm', {
      method: 'POST',
      body: JSON.stringify({
        organizationName: form.orgName,
        subtitle: form.subtitle,
        description: form.description,
        primaryContact: { name: form.contactName, phone: form.phone },
      }),
    });
    showToast(`${form.orgName} added successfully`);
    load();
  };

  const healthColor = (score: number) => score >= 80 ? 'text-lime border-lime/30 bg-lime/10' : score >= 50 ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' : 'text-red-400 border-red-500/30 bg-red-500/10';

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-[90vh]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3 text-[10px] font-mono text-white/50 tracking-widest">
              <Users className="w-3 h-3 text-lime" /> CRM LEDGER
            </div>
            <h1 className="font-display font-black text-[28px] text-pistachio tracking-tight">Client Companies</h1>
            <p className="text-[13px] text-white/40 mt-1">Manage and edit all registered companies in the 999x ecosystem.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search companies..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-canvas border border-white/10 text-[13px] text-pistachio focus:border-lime/40 outline-none transition-all placeholder:text-white/20"
              />
            </div>
            <NeoButton onClick={() => setShowCreate(true)} className="h-10 px-4 whitespace-nowrap shadow-[0_0_20px_rgba(163,230,53,0.15)]">
              <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Company</span>
            </NeoButton>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div className="px-4 py-3 rounded-xl bg-lime/10 border border-lime/20 text-lime text-[13px] font-medium shadow-2xl backdrop-blur-md">
              {toast}
            </div>
          </div>
        )}

        {/* Data Grid */}
        <GlassCard className="overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-white/30 font-mono text-[12px] animate-pulse">Loading CRM Data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white/20" />
              </div>
              <h3 className="text-[16px] font-bold text-pistachio mb-1">No Companies Found</h3>
              <p className="text-[13px] text-white/40 mb-6 max-w-[300px] mx-auto">There are no registered companies matching your criteria.</p>
              <NeoButton variant="glass" onClick={() => setShowCreate(true)}>Register First Client</NeoButton>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="px-6 py-4 text-[10px] font-mono text-white/30 tracking-widest font-normal">COMPANY NAME</th>
                    <th className="px-6 py-4 text-[10px] font-mono text-white/30 tracking-widest font-normal">SUBTITLE / FIELD</th>
                    <th className="px-6 py-4 text-[10px] font-mono text-white/30 tracking-widest font-normal">HEALTH</th>
                    <th className="px-6 py-4 text-[10px] font-mono text-white/30 tracking-widest font-normal">STAGE</th>
                    <th className="px-6 py-4 text-[10px] font-mono text-white/30 tracking-widest font-normal">CONTACT</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="text-[13px]">
                  {filtered.map(c => (
                    <tr key={c._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setDetail(c)}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-pistachio flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-white/20" />
                          {c.organizationName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/60 font-mono text-[11px]">{c.companyTypeCustom || c.subtitle}</span>
                        {c.companyType === 'EVENT' && <div className="text-[10px] text-lime mt-1 font-mono">EVENT</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${healthColor(c.healthScore)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span className="font-bold font-mono text-[11px]">{c.healthScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white/40 font-mono text-[10px]">{c.operationalStage?.replace(/_/g, ' ') || 'NEW'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white/70">{c.primaryContact?.name || '—'}</div>
                        <div className="text-white/30 font-mono text-[10px]">{c.primaryContact?.phone || '—'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-lime/0 group-hover:text-lime/70 hover:text-lime transition-all text-[11px] font-mono underline decoration-lime/30 underline-offset-4">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>

      {showCreate && <RegisterModal onClose={() => setShowCreate(false)} onCreate={create} />}
      {detail && <ClientDetailModal client={detail} onClose={() => setDetail(null)} onUpdate={updateClient} onDelete={deleteClient} />}
    </DashboardLayout>
  );
}
