/**
 * pages/AdminCockpit.tsx — Ops War Room (Kanban Matrix)
 * HTML5 native DnD • Task detail modal • Create task modal • Priority colors • Client filter
 */
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useEffect, useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { InlineEdit } from '../../components/ui/InlineEdit';
import { api } from '../../lib/api';
import { ClipboardList, Calendar, Trash2, X, Plus, GripVertical } from 'lucide-react';

type Task = {
  _id: string; title: string; details?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  columnStatus: string; clientId: string; deadline: string;
  timeTrackedMinutes?: number;
  assignedOpsMember?: string;
};

const COLS = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED'] as const;
const COL_LABELS: Record<string, string> = {
  BACKLOG: 'Backlog', TODO: 'To Do', IN_PROGRESS: 'In Progress', IN_REVIEW: 'In Review', COMPLETED: 'Done'
};
const COL_ACCENT: Record<string, string> = {
  BACKLOG: 'border-white/10 bg-surface/20',
  TODO: 'border-white/10 bg-surface/20',
  IN_PROGRESS: 'border-lime/20 bg-lime/[0.03]',
  IN_REVIEW: 'border-violet/20 bg-violet/[0.03]',
  COMPLETED: 'border-emerald-500/20 bg-emerald-500/[0.03]',
};
const COL_LABEL_COLOR: Record<string, string> = {
  BACKLOG: 'text-white/40', TODO: 'text-white/50', IN_PROGRESS: 'text-lime', IN_REVIEW: 'text-violet', COMPLETED: 'text-emerald-400',
};
const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'border-white/20 text-white/40',
  MEDIUM: 'border-lime/30 text-lime',
  HIGH: 'border-amber-400/40 text-amber-400',
  CRITICAL: 'border-red-400/50 text-red-400',
};
const PRIORITY_BG: Record<string, string> = {
  LOW: '', MEDIUM: '', HIGH: 'bg-amber-400/5', CRITICAL: 'bg-red-500/5',
};

/**
 * Create Task Modal
 * Handles the creation of a new task, including its initial title, details,
 * priority, column placement, and deadline.
 */
type CreateModalProps = {
  onClose: () => void;
  onCreate: (task: { title: string; details: string; priority: string; columnStatus: string; deadline: string }) => Promise<void>;
};

function CreateTaskModal({ onClose, onCreate }: CreateModalProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [col, setCol] = useState('BACKLOG');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Task title is required'); return; }
    setLoading(true); setError('');
    try {
      await onCreate({ title: title.trim(), details, priority, columnStatus: col, deadline });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally { setLoading(false); }
  };

  const PRIORITY_OPTIONS = [
    { v: 'LOW', label: 'Low', color: 'text-white/50', dot: 'bg-white/30' },
    { v: 'MEDIUM', label: 'Medium', color: 'text-lime', dot: 'bg-lime' },
    { v: 'HIGH', label: 'High', color: 'text-amber-400', dot: 'bg-amber-400' },
    { v: 'CRITICAL', label: 'Critical', color: 'text-red-400', dot: 'bg-red-400' },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog" aria-modal="true" aria-label="Create new task"
    >
      <div
        className="glass-panel rounded-3xl p-7 w-full max-w-[560px] shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_60px_rgba(138,154,91,0.06)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-display font-black text-pistachio text-[22px]">New Task</h2>
            <p className="text-white/40 text-[12px] mt-0.5">Add to your Ops War Room Kanban</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-[10px] font-mono text-white/40 mb-1.5 block tracking-widest">TASK TITLE *</label>
            <input
              id="new-task-title"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Redesign sponsor deck for Q4..."
              className="w-full h-12 rounded-xl px-4 bg-canvas border border-white/10 text-pistachio placeholder-white/20 focus:border-lime/50 focus:shadow-[0_0_0_3px_rgba(138,154,91,0.1)] outline-none transition-all text-[14px]"
            />
          </div>

          {/* Details */}
          <div>
            <label className="text-[10px] font-mono text-white/40 mb-1.5 block tracking-widest">DETAILS (OPTIONAL)</label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Add context, acceptance criteria, or links..."
              rows={3}
              className="w-full rounded-xl px-4 py-3 bg-canvas border border-white/10 text-pistachio text-[13px] placeholder-white/20 focus:border-lime/50 focus:shadow-[0_0_0_3px_rgba(138,154,91,0.1)] outline-none resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Priority + Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-white/40 mb-1.5 block tracking-widest">PRIORITY</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRIORITY_OPTIONS.map(p => (
                  <button
                    key={p.v}
                    type="button"
                    onClick={() => setPriority(p.v)}
                    className={`h-9 rounded-xl border text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 ${
                      priority === p.v
                        ? `${PRIORITY_COLORS[p.v]} bg-white/5`
                        : 'border-white/10 text-white/30 hover:border-white/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${priority === p.v ? p.dot : 'bg-white/20'}`} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-white/40 mb-1.5 block tracking-widest">COLUMN</label>
              <select
                value={col}
                onChange={e => setCol(e.target.value)}
                className="w-full h-12 rounded-xl px-3 bg-canvas border border-white/10 text-pistachio text-[13px] outline-none focus:border-lime/50 transition-all"
              >
                {COLS.map(c => <option key={c} value={c}>{COL_LABELS[c]}</option>)}
              </select>

              <label className="text-[10px] font-mono text-white/40 mt-3 mb-1.5 block tracking-widest">DEADLINE</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full h-12 rounded-xl px-3 bg-canvas border border-white/10 text-pistachio text-[13px] outline-none focus:border-lime/50 transition-all"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] font-mono">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <NeoButton type="submit" disabled={loading} className="flex-1" id="create-task-submit">
              {loading
                ? <span className="flex items-center gap-2 justify-center"><span className="w-4 h-4 rounded-full border-2 border-lime/30 border-t-lime animate-spin" />Creating...</span>
                : <span className="flex items-center gap-2 justify-center"><Plus className="w-4 h-4" />Create Task</span>
              }
            </NeoButton>
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-xl bg-white/5 border border-white/10 text-pistachio/60 text-[13px] hover:border-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Main AdminCockpit Component
 * Serves as the Ops War Room Kanban board, providing a visual matrix for task progression.
 * Supports HTML5 native Drag-and-Drop, inline task editing, and priority/assignee filtering.
 */
export default function AdminCockpit() {
  const [grouped, setGrouped] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);
  const [modal, setModal] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState('MEDIUM');
  const [editDetails, setEditDetails] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await api<{ kanban: Record<string, Task[]> }>('/admin/cockpit');
      setGrouped((data as any).kanban || {});
    } catch (err) {
      console.error('[AdminCockpit] Error loading kanban data:', err);
      setGrouped({});
    }
    finally { setLoading(false); }
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

  const createTask = async (payload: { title: string; details: string; priority: string; columnStatus: string; deadline: string }) => {
    // Attach active clientId for proper tenant isolation
    let clientId: string | undefined;
    try {
      const raw = localStorage.getItem('999x_active_company') || localStorage.getItem('999x_client');
      if (raw) { const parsed = JSON.parse(raw); clientId = parsed?.id || parsed?._id; }
    } catch {}
    const res = await api<Task>('/admin/tasks', {
      method: 'POST',
      body: JSON.stringify({ ...payload, clientId }),
    });
    // Optimistic: inject into kanban
    setGrouped(prev => ({
      ...prev,
      [payload.columnStatus]: [...(prev[payload.columnStatus] || []), res],
    }));
    showToast(`"${payload.title}" added to ${COL_LABELS[payload.columnStatus]}`);
  };

  const move = async (id: string, col: string) => {
    setGrouped(prev => {
      const next = JSON.parse(JSON.stringify(prev)) as Record<string, Task[]>;
      let task: Task | undefined;
      for (const c of Object.keys(next)) {
        const idx = next[c].findIndex(t => t._id === id);
        if (idx !== -1) { [task] = next[c].splice(idx, 1); break; }
      }
      if (task) next[col] = [...(next[col] || []), { ...task, columnStatus: col }];
      return next;
    });
    try { await api(`/admin/tasks/${id}/move`, { method: 'PATCH', body: JSON.stringify({ columnStatus: col }) }); }
    catch { load(); }
  };

  const saveModal = async () => {
    if (!modal) return;
    setSaveLoading(true);
    try {
      await api(`/admin/tasks/${modal._id}`, { method: 'PATCH', body: JSON.stringify({ title: editTitle, priority: editPriority, details: editDetails }) });
      setModal(null); load();
      showToast('Task updated');
    } catch (e: any) { showToast(e.message, 'err'); }
    finally { setSaveLoading(false); }
  };

  const deleteTask = async (id: string) => {
    try { await api(`/admin/tasks/${id}`, { method: 'DELETE' }); setModal(null); load(); showToast('Task deleted'); }
    catch (e: any) { showToast(e.message, 'err'); }
  };

  const openModal = (t: Task) => { setModal(t); setEditTitle(t.title); setEditPriority(t.priority); setEditDetails(t.details ?? ''); };

  const filteredGrouped = Object.fromEntries(
    Object.entries(grouped).map(([k, v]) => [
      k, 
      v.filter(t => (filterPriority === 'all' || t.priority === filterPriority) && (filterAssignee === 'all' || t.assignedOpsMember === filterAssignee))
    ])
  );

  const allTasks = Object.values(grouped).flat();
  const assignees = Array.from(new Set(allTasks.map(t => t.assignedOpsMember).filter(Boolean))) as string[];

  const allEmpty = Object.values(grouped).every(arr => arr.length === 0);
  const totalTasks = Object.values(grouped).reduce((a, b) => a + b.length, 0);

  if (loading) return (
    <DashboardLayout>
      <div className="space-y-4 animate-pulse">
        <div className="h-10 rounded-2xl bg-white/5 w-64" />
        <div className="grid lg:grid-cols-5 gap-4">{COLS.map(c => <div key={c} className="h-48 rounded-2xl bg-white/5" />)}</div>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="font-display font-black text-[26px] text-pistachio">Ops War Room</h1>
            <p className="text-white/40 text-[13px]">
              {totalTasks} tasks • Drag between columns • Tap to edit
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-10 px-3 rounded-xl bg-canvas border border-white/10 text-pistachio text-[12px] outline-none hover:border-lime/30 transition-all">
              <option value="all">All Priorities</option>
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {assignees.length > 0 && (
              <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className="h-10 px-3 rounded-xl bg-canvas border border-white/10 text-pistachio text-[12px] outline-none hover:border-lime/30 transition-all">
                <option value="all">All Assignees</option>
                {assignees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            )}
            <NeoButton onClick={() => setCreateOpen(true)} id="open-create-task">
              <Plus className="w-4 h-4" /> New Task
            </NeoButton>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-2">
          {COLS.map(col => (
            <div key={col} className={`p-3 rounded-xl border text-center transition-all ${COL_ACCENT[col]}`}>
              <div className={`font-mono text-[10px] ${COL_LABEL_COLOR[col]}`}>{COL_LABELS[col].toUpperCase()}</div>
              <div className={`font-mono font-black text-[22px] mt-0.5 ${col === 'IN_PROGRESS' ? 'text-lime' : col === 'COMPLETED' ? 'text-emerald-400' : 'text-pistachio'}`}>
                {(grouped[col] || []).length}
              </div>
            </div>
          ))}
        </div>

        {/* Board */}
        {allEmpty ? (
          <GlassCard>
            <div className="p-16 text-center">
              <div className="flex justify-center mb-5">
                <div className="w-20 h-20 rounded-3xl bg-surface border border-white/10 flex items-center justify-center">
                  <ClipboardList className="w-10 h-10 text-white/20" />
                </div>
              </div>
              <div className="font-bold text-pistachio text-xl">War Room is clear</div>
              <p className="text-white/40 text-[13px] mt-2 max-w-xs mx-auto">No active tasks. Create your first task to get the ops team moving.</p>
              <NeoButton onClick={() => setCreateOpen(true)} className="mt-6">
                <Plus className="w-4 h-4" /> Create First Task
              </NeoButton>
            </div>
          </GlassCard>
        ) : (
          <div className="grid lg:grid-cols-5 gap-3">
            {COLS.map(col => (
              <div
                key={col}
                onDragOver={e => { e.preventDefault(); setOverCol(col); }}
                onDragLeave={() => setOverCol(null)}
                onDrop={e => {
                  e.preventDefault();
                  if (dragId) move(dragId, col);
                  setDragId(null); setOverCol(null);
                }}
                className={`rounded-2xl p-3 min-h-[260px] border transition-all duration-200 ${
                  overCol === col ? 'border-lime/50 bg-lime/5 scale-[1.01]' : COL_ACCENT[col]
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`font-mono text-[11px] font-bold ${COL_LABEL_COLOR[col]}`}>{COL_LABELS[col]}</div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      col === 'IN_PROGRESS' ? 'bg-lime/20 text-lime' : col === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'
                    }`}>
                      {(filteredGrouped[col] || []).length}
                    </span>
                    <button
                      title={`Add task to ${COL_LABELS[col]}`}
                      onClick={() => setCreateOpen(true)}
                      className="w-6 h-6 rounded-full bg-white/5 hover:bg-lime/20 text-white/30 hover:text-lime transition-all flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {(filteredGrouped[col] || []).length === 0 && (
                  <div className={`p-4 rounded-xl border border-dashed text-center text-[11px] text-white/20 ${overCol === col ? 'border-lime/40 text-lime/40' : 'border-white/10'}`}>
                    {overCol === col ? '↓ Drop here' : 'Empty'}
                  </div>
                )}

                <div className="space-y-2">
                  {(filteredGrouped[col] || []).map(t => (
                    <div
                      key={t._id}
                      draggable
                      onDragStart={e => { setDragId(t._id); e.dataTransfer.effectAllowed = 'move'; }}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }}
                      onClick={() => openModal(t)}
                      className={`p-3 rounded-xl border cursor-grab active:cursor-grabbing hover:border-lime/30 transition-all group ${PRIORITY_BG[t.priority]} ${dragId === t._id ? 'opacity-30 scale-95' : ''} border-white/10 bg-canvas`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 mt-0.5 shrink-0 transition-colors" />
                        <div className="flex-1 min-w-0" onClick={e => e.stopPropagation()}>
                          <div className="font-bold text-pistachio text-[12px] leading-snug line-clamp-2">
                            <InlineEdit 
                              value={t.title} 
                              onSave={async (v) => {
                                try {
                                  await api(`/admin/cockpit/${t._id}`, { method: 'PATCH', body: JSON.stringify({ title: v }) });
                                  load(); // Refresh to show new title
                                } catch (e: any) {
                                  showToast(e.message, 'err');
                                }
                              }} 
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                            <div className="flex gap-2 items-center">
                              {t.assignedOpsMember && <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-white/40">User: {t.assignedOpsMember.slice(-4)}</span>}
                              {t.deadline && (
                                <span className="text-[10px] text-white/25 font-mono">
                                  {new Date(t.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Task Modal */}
        {modal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50" onClick={() => setModal(null)}>
            <div className="glass-panel rounded-3xl p-7 w-full max-w-[520px] shadow-[0_30px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-display font-bold text-pistachio text-[18px]">Edit Task</h3>
                <button onClick={() => setModal(null)} className="w-8 h-8 rounded-full bg-white/10 text-white/50 hover:bg-white/20 transition-all flex items-center justify-center"><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-white/40 mb-1 block tracking-widest">TITLE</label>
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full h-11 rounded-xl px-3 bg-canvas border border-white/10 text-pistachio focus:border-lime/50 outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/40 mb-1 block tracking-widest">DETAILS</label>
                  <textarea value={editDetails} onChange={e => setEditDetails(e.target.value)} className="w-full rounded-xl px-3 py-2 bg-canvas border border-white/10 text-pistachio text-[13px] h-20 focus:border-lime/50 outline-none resize-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-white/40 mb-1 block tracking-widest">PRIORITY</label>
                    <select value={editPriority} onChange={e => setEditPriority(e.target.value)} className="w-full h-11 rounded-xl px-3 bg-canvas border border-white/10 text-pistachio outline-none focus:border-lime/50">
                      {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-white/40 mb-1 block tracking-widest">STATUS</label>
                    <div className="h-11 flex items-center px-3 rounded-xl bg-white/5 border border-white/10 text-[12px] font-mono text-pistachio/60">{modal.columnStatus}</div>
                  </div>
                </div>
                {modal.deadline && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[12px] font-mono text-white/50 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/30" /> {new Date(modal.deadline).toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <NeoButton onClick={saveModal} disabled={saveLoading} className="flex-1">
                  {saveLoading ? <span className="w-4 h-4 rounded-full border-2 border-lime/30 border-t-lime animate-spin inline-block" /> : 'Save Changes'}
                </NeoButton>
                <button onClick={() => deleteTask(modal._id)} className="px-4 h-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {createOpen && (
        <CreateTaskModal
          onClose={() => setCreateOpen(false)}
          onCreate={createTask}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border text-[13px] font-bold shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all animate-[fadeInUp_0.2s_ease] ${
          toast.type === 'ok'
            ? 'bg-canvas border-lime/30 text-lime'
            : 'bg-canvas border-red-400/30 text-red-400'
        }`}>
          {toast.type === 'ok' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </DashboardLayout>
  );
}
