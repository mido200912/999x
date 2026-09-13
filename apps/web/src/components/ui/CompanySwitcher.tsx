import { useState, useEffect } from 'react';
import { Building2, ChevronDown, Check, Plus, Shield, Sparkles } from 'lucide-react';
import { storage, LS_KEYS } from '../../lib/storage';
import { api } from '../../lib/api';

export type CompanyItem = {
  id: string;
  name: string;
  subtitle: string;
  companyType?: string;
  healthScore?: number;
  stage?: string;
};

const DEFAULT_COMPANIES: CompanyItem[] = [];

export function CompanySwitcher() {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [activeCompany, setActiveCompany] = useState<CompanyItem | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Load from local storage or fetch from CRM
    const saved = storage.get<CompanyItem>('999x_active_company', null);
    if (saved) {
      setActiveCompany(saved);
    }

    // Try to load real companies from CRM
    api<any[]>('/admin/crm')
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped: CompanyItem[] = data.map((c) => ({
            id: c._id || c.id,
            name: c.organizationName || c.name,
            subtitle: c.subtitle || 'Company',
            companyType: c.companyType || 'STARTUP',
            healthScore: c.healthScore || 75,
            stage: c.operationalStage || 'DIAGNOSIS',
          }));
          setCompanies(mapped);
          if (!saved) {
            setActiveCompany(mapped[0]);
            storage.set('999x_active_company', mapped[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const selectCompany = (company: CompanyItem) => {
    setActiveCompany(company);
    storage.set('999x_active_company', company);
    // Also update generic client key
    storage.set(LS_KEYS.CLIENT, {
      id: company.id,
      name: company.name,
      subtitle: company.subtitle,
      companyType: company.companyType,
      healthScore: company.healthScore,
    });
    setOpen(false);

    // Notify all open pages/components to refresh their scoped data
    window.dispatchEvent(new CustomEvent('999x:company-changed', { detail: company }));
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);

    try {
      // Call AI Agent action or Client register
      const res = await api<{ success: boolean; data: any }>('/ai/agent-action', {
        method: 'POST',
        body: JSON.stringify({
          explicitTool: 'add_company',
          command: `ضيف شركة جديدة اسمها ${newName}`,
          params: { organizationName: newName, subtitle: newSubtitle }
        })
      });

      const newId = res.data?.details?._id || 'c-' + Date.now();
      const created: CompanyItem = {
        id: newId,
        name: newName,
        subtitle: newSubtitle,
        healthScore: 75,
        stage: 'DIAGNOSIS'
      };

      const updatedList = [created, ...companies];
      setCompanies(updatedList);
      selectCompany(created);
      setShowNewModal(false);
      setNewName('');
    } catch (e: any) {
      alert('Failed to create company: ' + e.message);
    } finally {
      setCreating(false);
    }
  };

  const catBadge = (c: string = '') => {
    if (c === 'EVENT') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (c === 'VOLUNTEER_TEAM') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-lime/10 text-lime border-lime/30';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-lime/30 transition-all text-left group"
        title="Switch Company Profile"
      >
        <div className="w-6 h-6 rounded-lg bg-lime/10 border border-lime/20 flex items-center justify-center text-lime shrink-0">
          <Building2 className="w-3.5 h-3.5" />
        </div>
        <div className="hidden sm:block text-left pr-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-pistachio tracking-tight truncate max-w-[130px]">
              {activeCompany ? activeCompany.name : 'Select Company'}
            </span>
            {activeCompany && activeCompany.companyType && (
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${catBadge(activeCompany.companyType)}`}>
                {activeCompany.companyType}
              </span>
            )}
          </div>
          {activeCompany ? (
            <div className="text-[10px] font-mono text-white/40 flex items-center gap-1">
              <span>Score: {activeCompany.healthScore}%</span>
              <span>•</span>
              <span className="text-lime/70">{activeCompany.stage || 'DIAGNOSIS'}</span>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-white/40">No company selected</div>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? 'rotate-180 text-lime' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-72 glass-panel rounded-2xl p-2 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-lime/20 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Select Organization</span>
              <span className="text-[10px] font-mono text-lime">{companies.length} Active</span>
            </div>

            <div className="max-h-56 overflow-y-auto py-1 space-y-1">
              {companies.map((c) => {
                const isSelected = activeCompany && c.id === activeCompany.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectCompany(c)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-lime/15 border border-lime/30 text-lime'
                        : 'hover:bg-white/5 border border-transparent text-pistachio/80'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-[13px] font-bold text-pistachio flex items-center gap-2">
                        {c.name}
                        {isSelected && <Check className="w-3.5 h-3.5 text-lime shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[9px] font-mono px-1 rounded border ${catBadge(c.companyType)}`}>
                          {c.companyType || c.subtitle.substring(0, 8)}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">Health: {c.healthScore || 70}%</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 mt-1">
              <button
                onClick={() => {
                  setOpen(false);
                  setShowNewModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-lime/10 hover:bg-lime/20 border border-lime/30 text-lime font-bold text-[12px] transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Company Profile</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* New Company Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-panel rounded-2xl p-6 w-full max-w-md border border-lime/30 shadow-[0_0_50px_rgba(163,230,53,0.15)] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-pistachio">Create Organization Profile</h3>
                <p className="text-[12px] text-white/50">Add a new company with isolated operations</p>
              </div>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1.5">ORGANIZATION NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Tech Hub"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3.5 py-2.5 text-[13px] text-pistachio outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1.5">SUBTITLE / FIELD</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fintech Startup"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3.5 py-2.5 text-[13px] text-pistachio outline-none"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-[13px] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-lime hover:bg-lime/90 text-canvas font-bold text-[13px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                >
                  {creating ? 'Creating...' : 'Create & Switch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
