import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { InlineEdit } from '../../components/ui/InlineEdit';
import { api } from '../../lib/api';
import {
  Users,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Phone,
  Mail,
  Building,
  Trash2,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export type Prospect = {
  _id: string;
  organizationName: string;
  category: 'STARTUP' | 'VOLUNTEER_TEAM' | 'EVENT' | 'ENTERPRISE';
  contactPerson: string;
  email: string;
  phone: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  pitchAngle?: string;
  estimatedBudget?: string;
  notes?: string;
  convertedClientId?: string;
  createdAt: string;
};

export default function AdminProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    organizationName: '',
    category: 'STARTUP' as const,
    contactPerson: '',
    email: '',
    phone: '',
    pitchAngle: '',
    estimatedBudget: '',
    notes: '',
  });

  const loadProspects = async () => {
    try {
      setLoading(true);
      const res = await api<{ success: boolean; data: Prospect[] }>('/prospects');
      if (res.data) {
        setProspects(res.data);
      }
    } catch (err) {
      console.error('[AdminProspects] Error loading prospects:', err);
      setProspects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProspects();
    const handleRefresh = () => loadProspects();
    window.addEventListener('999x:data-updated', handleRefresh);
    return () => {
      window.removeEventListener('999x:data-updated', handleRefresh);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.contactPerson || !formData.email) return;

    try {
      const res = await api<{ success: boolean; data: Prospect }>('/prospects', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.data) {
        setProspects((prev) => [res.data, ...prev]);
        setShowModal(false);
        setFormData({
          organizationName: '',
          category: 'STARTUP',
          contactPerson: '',
          email: '',
          phone: '',
          pitchAngle: '',
          estimatedBudget: '',
          notes: '',
        });
        showToast(`تم تسجيل العميل المحتمل "${formData.organizationName}" بنجاح!`);
      }
    } catch (err: any) {
      showToast('تعذر تسجيل العميل المحتمل: ' + err.message, 'error');
    }
  };

  const updateStatus = async (id: string, newStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED') => {
    try {
      await api(`/prospects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      setProspects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      showToast(`تم تغيير الحالة إلى ${newStatus}`);
    } catch (err: any) {
      showToast('تعذر تحديث الحالة: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api(`/prospects/${id}`, { method: 'DELETE' });
      setProspects((prev) => prev.filter((p) => p._id !== id));
      showToast('تم حذف السجل بنجاح');
    } catch (err: any) {
      showToast('تعذر الحذف: ' + err.message, 'error');
    }
  };

  const handleConvert = async (prospect: Prospect) => {
    try {
      setConvertingId(prospect._id);
      const res = await api<{ success: boolean; message: string; data: any }>(
        `/prospects/${prospect._id}/convert`,
        { method: 'POST' }
      );

      if (res.success) {
        setProspects((prev) =>
          prev.map((p) =>
            p._id === prospect._id ? { ...p, status: 'ACCEPTED', convertedClientId: res.data?.clientId } : p
          )
        );
        showToast(`🎉 مبروك! تم تحويل "${prospect.organizationName}" إلى عميل نشط ببروفايل مستقل.`);
        window.dispatchEvent(new CustomEvent('999x:company-changed'));
      }
    } catch (err: any) {
      showToast('فشل التحويل لعميل: ' + err.message, 'error');
    } finally {
      setConvertingId(null);
    }
  };

  const filtered = prospects.filter((p) => {
    const matchSearch =
      p.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      p.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'ALL') return matchSearch;
    return matchSearch && p.status === activeTab;
  });

  const counts = {
    all: prospects.length,
    pending: prospects.filter((p) => p.status === 'PENDING').length,
    accepted: prospects.filter((p) => p.status === 'ACCEPTED').length,
    rejected: prospects.filter((p) => p.status === 'REJECTED').length,
  };

  const conversionRate = counts.all > 0 ? Math.round((counts.accepted / counts.all) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl text-[13px] font-bold border shadow-2xl animate-in slide-in-from-top-4 duration-200 flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-red-500/20 border-red-500/40 text-red-200'
                : 'bg-lime/20 border-lime/40 text-lime'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] sm:text-[26px] font-black text-pistachio tracking-tight">
                PR & Prospects CRM
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-lime/10 text-lime border border-lime/20">
                PIPELINE
              </span>
            </div>
            <p className="text-[13px] text-white/50 mt-1">
              إدارة خط أنابيب العملاء المحتملين والعلاقات العامة وتحويلهم لعملاء دائمين
            </p>
          </div>

          <NeoButton onClick={() => setShowModal(true)} variant="lime" className="shrink-0">
            <Plus className="w-4 h-4" />
            <span>إضافة عميل محتمل</span>
          </NeoButton>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-pistachio shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase">Total Leads</div>
              <div className="text-[20px] font-black text-pistachio mt-0.5">{counts.all}</div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-4 border-amber-500/20">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase">Pending (قيد الدراسة)</div>
              <div className="text-[20px] font-black text-amber-300 mt-0.5">{counts.pending}</div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-4 border-lime/20">
            <div className="w-11 h-11 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase">Accepted (مقبول)</div>
              <div className="text-[20px] font-black text-lime mt-0.5">{counts.accepted}</div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex items-center gap-4 border-violet/20">
            <div className="w-11 h-11 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center text-violet shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-white/40 uppercase">Conversion Rate</div>
              <div className="text-[20px] font-black text-violet mt-0.5">{conversionRate}%</div>
            </div>
          </GlassCard>
        </div>

        {/* Controls Bar: Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-canvas/60 border border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto p-1">
            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
                  activeTab === tab
                    ? 'bg-lime text-canvas shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab === 'ALL'
                  ? `الكل (${counts.all})`
                  : tab === 'PENDING'
                  ? `قيد الدراسة (${counts.pending})`
                  : tab === 'ACCEPTED'
                  ? `مقبول (${counts.accepted})`
                  : `مرفوض (${counts.rejected})`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="بحث بالاسم أو المسؤول..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface/70 border border-white/10 focus:border-lime/50 text-[12px] text-pistachio outline-none"
            />
          </div>
        </div>

        {/* Prospects Grid / Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <GlassCard className="text-center py-16">
            <Building className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <div className="text-[16px] font-bold text-pistachio">لا توجد سجلات تطابق الفلتر</div>
            <p className="text-[12px] text-white/40 mt-1 max-w-sm mx-auto">
              يمكنك إضافة عميل محتمل جديد أو استخدام الـ AI Co-Pilot لتسجيله تلقائياً.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => {
              const isAccepted = p.status === 'ACCEPTED';
              const isPending = p.status === 'PENDING';
              const isRejected = p.status === 'REJECTED';

              return (
                <GlassCard
                  key={p._id}
                  className="p-5 flex flex-col justify-between relative overflow-hidden group hover:border-lime/30 transition-all"
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${
                      isAccepted ? 'bg-lime' : isPending ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                  />

                  <div>
                    {/* Top Row: Category + Status Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-white/5 border-white/10 text-white/60">
                        {p.category}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                            isAccepted
                              ? 'bg-lime/10 text-lime border-lime/30'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-red-500/10 text-red-400 border-red-500/30'
                          }`}
                        >
                          {isAccepted ? (
                            <>
                              <CheckCircle className="w-3 h-3" /> مقبول
                            </>
                          ) : isPending ? (
                            <>
                              <Clock className="w-3 h-3" /> قيد الدراسة
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> مرفوض
                            </>
                          )}
                        </span>

                        <button
                          onClick={() => handleDelete(p._id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-white/30 hover:text-red-400 transition-opacity"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Organization & Contact — inline-editable */}
                    <h3 className="text-[17px] font-bold text-pistachio leading-snug">
                      <InlineEdit
                        value={p.organizationName}
                        onSave={async (v) => {
                          await api(`/prospects/${p._id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ organizationName: v }),
                          });
                          setProspects(prev =>
                            prev.map(x => x._id === p._id ? { ...x, organizationName: v } : x)
                          );
                        }}
                        placeholder="اسم المؤسسة..."
                      />
                    </h3>
                    <div className="text-[12px] font-medium text-lime/80 mt-1 flex items-center gap-1.5">
                      <InlineEdit
                        value={p.contactPerson}
                        onSave={async (v) => {
                          await api(`/prospects/${p._id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ contactPerson: v }),
                          });
                          setProspects(prev =>
                            prev.map(x => x._id === p._id ? { ...x, contactPerson: v } : x)
                          );
                        }}
                        placeholder="اسم المسؤول..."
                        className="text-lime/80"
                      />
                    </div>

                    {/* Pitch Angle & Budget */}
                    {p.pitchAngle && (
                      <p className="text-[12px] text-white/60 mt-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 line-clamp-2">
                        {p.pitchAngle}
                      </p>
                    )}

                    <div className="mt-3 space-y-1 text-[11px] font-mono text-white/40">
                      {p.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-white/30" />
                          <span className="truncate">{p.email}</span>
                        </div>
                      )}
                      {p.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-white/30" />
                          <span>{p.phone}</span>
                        </div>
                      )}
                      {p.estimatedBudget && (
                        <div className="flex items-center gap-2 text-lime/70 font-bold">
                          <DollarSign className="w-3 h-3" />
                          <span>الميزانية: {p.estimatedBudget}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-2">
                    {/* Status change actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateStatus(p._id, 'ACCEPTED')}
                          disabled={isAccepted}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            isAccepted
                              ? 'opacity-40 border-transparent text-white/20'
                              : 'bg-lime/10 hover:bg-lime/20 border-lime/30 text-lime'
                          }`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(p._id, 'PENDING')}
                          disabled={isPending}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            isPending
                              ? 'opacity-40 border-transparent text-white/20'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          Pending
                        </button>
                        <button
                          onClick={() => updateStatus(p._id, 'REJECTED')}
                          disabled={isRejected}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            isRejected
                              ? 'opacity-40 border-transparent text-white/20'
                              : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-300'
                          }`}
                        >
                          Reject
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-white/30">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Convert to Client Button (if accepted) */}
                    {isAccepted && (
                      <button
                        onClick={() => handleConvert(p)}
                        disabled={convertingId === p._id || Boolean(p.convertedClientId)}
                        className={`w-full py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
                          p.convertedClientId
                            ? 'bg-white/5 border border-white/10 text-white/40 cursor-default'
                            : 'bg-gradient-to-r from-lime to-emerald-400 text-canvas shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-[1.02]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {p.convertedClientId
                            ? '✓ تم التحويل لعميل دائم'
                            : convertingId === p._id
                            ? 'جاري التحويل وتجهيز البروفايل...'
                            : 'تحويل لعميل دائم (Active Client)'}
                        </span>
                      </button>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* New Prospect Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="glass-panel rounded-2xl p-6 w-full max-w-lg border border-lime/30 shadow-[0_0_60px_rgba(163,230,53,0.15)] animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-bold text-pistachio">إضافة عميل محتمل جديد</h3>
                    <p className="text-[11px] text-white/50">تسجيل ليد جديد في خط أنابيب العلاقات العامة</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">اسم المؤسسة / الفعالية *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nile AI Summit"
                      value={formData.organizationName}
                      onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                      className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">القطاع</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                    >
                      <option value="STARTUP">STARTUP</option>
                      <option value="EVENT">EVENT</option>
                      <option value="VOLUNTEER_TEAM">VOLUNTEER_TEAM</option>
                      <option value="ENTERPRISE">ENTERPRISE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">اسم المسؤول *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. م. أحمد حسام"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      required
                      placeholder="ahmed@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">رقم الهاتف / الواتساب</label>
                    <input
                      type="tel"
                      placeholder="+2010xxxxxxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/60 mb-1">الميزانية المتوقعة</label>
                    <input
                      type="text"
                      placeholder="e.g. 50,000 EGP"
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                      className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1">زاوية العرض والاهتمام (Pitch Angle)</label>
                  <input
                    type="text"
                    placeholder="e.g. إعادة هيكلة الفريق وتوفير رعاة رئيسيين"
                    value={formData.pitchAngle}
                    onChange={(e) => setFormData({ ...formData, pitchAngle: e.target.value })}
                    className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1">ملاحظات داخلية</label>
                  <textarea
                    rows={2}
                    placeholder="أي ملاحظات حول التواصل الأول وموعد المتابعة..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none resize-none"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-[13px] font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-lime hover:bg-lime/90 text-canvas font-bold text-[13px] shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    حفظ في الـ Pipeline
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
