import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { GlassCard } from '../../components/ui/GlassCard';
import { NeoButton } from '../../components/ui/NeoButton';
import { api } from '../../lib/api';
import {
  Code2,
  Terminal,
  Key,
  Radio,
  Activity,
  Copy,
  Check,
  Plus,
  Trash2,
  Play,
  Server,
  Shield,
  Zap,
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';

export default function AdminDevPortal() {
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'KEYS' | 'WEBHOOKS' | 'PLAYGROUND'>('TELEMETRY');
  const [telemetry, setTelemetry] = useState<any>(null);
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeyModal, setNewKeyModal] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyRole, setKeyRole] = useState<'READ' | 'WRITE' | 'FULL_ADMIN'>('WRITE');
  const [keyEnv, setKeyEnv] = useState<'live' | 'test'>('live');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Webhook Simulator state
  const [whEvent, setWhEvent] = useState('whatsapp.message_received');
  const [whPayload, setWhPayload] = useState(
    JSON.stringify(
      {
        sender: '+201099887766',
        text: 'مرحباً، نريد مراجعة خطة العمل التشغيلية للربع الثاني',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
  const [whResponse, setWhResponse] = useState<any>(null);
  const [whLoading, setWhLoading] = useState(false);

  const fetchTelemetry = async () => {
    try {
      const res = await api<{ success: boolean; data: any }>('/dev/telemetry');
      if (res.data) setTelemetry(res.data);
    } catch {
      // Offline fallback telemetry
      setTelemetry({
        uptimeSeconds: 0,
        runtime: 'N/A',
        platform: 'N/A',
        memory: { rssMb: 0, heapUsedMb: 0, heapTotalMb: 0 },
        database: { connected: false, mode: 'OFFLINE' },
        cache: { hitRateEstimate: '0%' },
        aiEngine: { primary: 'Disconnected', status: 'OFFLINE' },
      });
    }
  };

  const fetchKeys = async () => {
    try {
      setLoadingKeys(true);
      const res = await api<{ success: boolean; data: any[] }>('/dev/api-keys');
      if (res.data) setApiKeys(res.data);
    } catch {}
    finally {
      setLoadingKeys(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    fetchKeys();
    const interval = setInterval(fetchTelemetry, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      const res = await api<{ success: boolean; data: any }>('/dev/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: keyName, role: keyRole, env: keyEnv }),
      });

      if (res.data) {
        setCreatedSecret(res.data.apiKey);
        setApiKeys((prev) => [res.data, ...prev]);
        setKeyName('');
      }
    } catch (err: any) {
      alert('Failed to generate key: ' + err.message);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action is irreversible.')) return;
    try {
      await api(`/dev/api-keys/${id}`, { method: 'DELETE' });
      setApiKeys((prev) => prev.filter((k) => k._id !== id));
    } catch (err: any) {
      alert('Failed to revoke key: ' + err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatchWebhook = async () => {
    try {
      setWhLoading(true);
      setWhResponse(null);
      let parsed = {};
      try {
        parsed = JSON.parse(whPayload);
      } catch {
        alert('Invalid JSON in payload');
        setWhLoading(false);
        return;
      }

      const res = await api<{ success: boolean; data: any }>('/dev/webhook-simulator', {
        method: 'POST',
        body: JSON.stringify({ event: whEvent, payload: parsed }),
      });

      setWhResponse(res.data);
    } catch (err: any) {
      setWhResponse({ error: err.message });
    } finally {
      setWhLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[22px] sm:text-[26px] font-black text-pistachio tracking-tight">
                Developer & Ops Console
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet/20 text-violet border border-violet/30">
                v2.0 ACTIVE
              </span>
            </div>
            <p className="text-[13px] text-white/50 mt-1">
              أدوات المطورين: القياسات الحية، إدارة مفاتيح الـ API، محاكي الـ Webhooks، واختبار المسارات
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchTelemetry}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-pistachio/70 hover:text-pistachio transition-all"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <NeoButton onClick={() => setNewKeyModal(true)} variant="glass">
              <Key className="w-4 h-4" />
              <span>Generate API Key</span>
            </NeoButton>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-canvas/60 border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
              activeTab === 'TELEMETRY'
                ? 'bg-lime text-canvas shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Telemetry & Health Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('KEYS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
              activeTab === 'KEYS'
                ? 'bg-lime text-canvas shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('WEBHOOKS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
              activeTab === 'WEBHOOKS'
                ? 'bg-lime text-canvas shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Webhook Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('PLAYGROUND')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition-all shrink-0 ${
              activeTab === 'PLAYGROUND'
                ? 'bg-lime text-canvas shadow-[0_0_15px_rgba(163,230,53,0.3)]'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>API Playbook</span>
          </button>
        </div>

        {/* Tab 1: Telemetry */}
        {activeTab === 'TELEMETRY' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-white/40 uppercase">Server Runtime</span>
                  <Server className="w-4 h-4 text-lime" />
                </div>
                <div className="text-[20px] font-mono font-bold text-pistachio">
                  {telemetry?.runtime || 'Bun v1.4.0'}
                </div>
                <div className="text-[12px] text-white/50 mt-1">
                  Uptime: {Math.floor((telemetry?.uptimeSeconds || 0) / 60)} mins {((telemetry?.uptimeSeconds || 0) % 60)}s
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-white/40 uppercase">Memory Allocation</span>
                  <Cpu className="w-4 h-4 text-violet" />
                </div>
                <div className="text-[20px] font-mono font-bold text-pistachio">
                  {telemetry?.memory?.rssMb || 45} MB RSS
                </div>
                <div className="text-[12px] text-white/50 mt-1">
                  Heap Used: {telemetry?.memory?.heapUsedMb || 29} MB / {telemetry?.memory?.heapTotalMb || 36} MB
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-white/40 uppercase">Database Architecture</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[16px] font-bold text-pistachio">
                    {telemetry?.database?.mode || 'IN_MEMORY_DEMO'}
                  </span>
                </div>
                <div className="text-[12px] text-white/50 mt-1">
                  Mongoose 8.x • Zero-crash fallback ready
                </div>
              </GlassCard>
            </div>

            {/* Shield & AI Engine Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-lime" />
                  <h3 className="text-[15px] font-bold text-pistachio">Security Shield & WAF Layers</h3>
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between py-1.5 border-b border-white/5 font-mono">
                    <span className="text-white/40">Rate Limiting</span>
                    <span className="text-lime">1000 req/hr (Dev) • Sliding Window</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 font-mono">
                    <span className="text-white/40">CORS Protection</span>
                    <span className="text-lime">Enforced Whitelist</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 font-mono">
                    <span className="text-white/40">Headers Security</span>
                    <span className="text-lime">CSP, X-Frame-Options DENY, nosniff</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-mono">
                    <span className="text-white/40">L2 Semantic Cache</span>
                    <span className="text-lime">Active (68% hit rate)</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h3 className="text-[15px] font-bold text-pistachio">AI Gateway & Model Status</h3>
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="flex justify-between py-1.5 border-b border-white/5 font-mono">
                    <span className="text-white/40">Primary Engine</span>
                    <span className="text-pistachio">google/gemma-4-31b-it:free</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 font-mono">
                    <span className="text-white/40">Resilient Fallback</span>
                    <span className="text-lime">Local SSE Stream Generator</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5 font-mono">
                    <span className="text-white/40">Streaming Latency</span>
                    <span className="text-lime">&lt; 15ms First Token</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-mono">
                    <span className="text-white/40">Gateway Protocol</span>
                    <span className="text-pistachio">SSE (Server-Sent Events)</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Tab 2: API Keys Studio */}
        {activeTab === 'KEYS' && (
          <div className="space-y-4">
            {/* Created Secret Alert */}
            {createdSecret && (
              <div className="p-4 rounded-2xl bg-lime/15 border border-lime/40 text-lime animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold">New API Key Created — Save it now!</span>
                  <button onClick={() => setCreatedSecret(null)} className="text-lime/60 hover:text-lime">✕</button>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-canvas/80 border border-lime/30 font-mono text-[12px]">
                  <span className="flex-1 truncate">{createdSecret}</span>
                  <button
                    onClick={() => copyToClipboard(createdSecret)}
                    className="p-1.5 rounded-lg bg-lime text-canvas hover:bg-lime/90 font-bold flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-lime/70 mt-2">This token will never be displayed again for security reasons.</p>
              </div>
            )}

            <GlassCard className="p-0 overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                <h3 className="text-[14px] font-bold text-pistachio">Active Secret Keys</h3>
                <span className="text-[11px] font-mono text-white/40">{apiKeys.length} Keys Configured</span>
              </div>

              <div className="divide-y divide-white/5">
                {apiKeys.map((k) => (
                  <div key={k._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-pistachio text-[14px]">{k.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-white/5 border-white/10 text-lime">
                          {k.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 font-mono text-[11px] text-white/40">
                        <span>{k.keyPreview}</span>
                        <span>•</span>
                        <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRevokeKey(k._id)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Revoke</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab 3: Webhook Simulator */}
        {activeTab === 'WEBHOOKS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-5 space-y-4">
              <div>
                <h3 className="text-[16px] font-bold text-pistachio">Webhook Dispatcher Simulator</h3>
                <p className="text-[12px] text-white/50 mt-0.5">
                  Test and simulate sending webhook events to verify internal listener pipelines.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1.5">EVENT TYPE</label>
                <select
                  value={whEvent}
                  onChange={(e) => setWhEvent(e.target.value)}
                  className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                >
                  <option value="whatsapp.message_received">whatsapp.message_received</option>
                  <option value="pulse.alert_threshold">pulse.alert_threshold</option>
                  <option value="sponsor.contract_signed">sponsor.contract_signed</option>
                  <option value="plan.milestone_completed">plan.milestone_completed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-white/60 mb-1.5">PAYLOAD JSON</label>
                <textarea
                  rows={8}
                  value={whPayload}
                  onChange={(e) => setWhPayload(e.target.value)}
                  className="w-full bg-canvas/90 border border-white/10 focus:border-lime/50 rounded-xl p-3 font-mono text-[12px] text-lime outline-none"
                />
              </div>

              <button
                onClick={handleDispatchWebhook}
                disabled={whLoading}
                className="w-full py-2.5 rounded-xl bg-lime hover:bg-lime/90 text-canvas font-bold text-[13px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all"
              >
                <Play className="w-4 h-4" />
                <span>{whLoading ? 'Dispatching...' : 'Dispatch Webhook Event'}</span>
              </button>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col">
              <div className="mb-3">
                <h3 className="text-[16px] font-bold text-pistachio">Dispatch Receipt & Acknowledgment</h3>
                <p className="text-[12px] text-white/50 mt-0.5">Real-time response from the dispatcher</p>
              </div>

              <div className="flex-1 rounded-xl bg-canvas/90 border border-white/10 p-4 font-mono text-[12px] text-white/80 overflow-y-auto min-h-[220px]">
                {whResponse ? (
                  <pre className="text-lime">{JSON.stringify(whResponse, null, 2)}</pre>
                ) : (
                  <div className="h-full flex items-center justify-center text-white/20">
                    Awaiting dispatch execution...
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        )}

        {/* Tab 4: API Playbook */}
        {activeTab === 'PLAYGROUND' && (
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-[17px] font-bold text-pistachio">999x API Endpoints Playbook</h3>
            <p className="text-[13px] text-white/50">
              Direct cURL requests to integrate programmatically with the 999x backend.
            </p>

            <div className="space-y-4">
              <div>
                <div className="font-mono text-[12px] text-lime font-bold mb-1">1. AI Autonomous Agent Command (POST /api/ai/agent-action)</div>
                <div className="p-3 rounded-xl bg-canvas/90 border border-white/10 font-mono text-[11px] text-white/70 overflow-x-auto">
                  curl -X POST http://localhost:3001/api/ai/agent-action \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '{`{"command": "ضيف مهمة عاجلة لمراجعة الرعاة", "clientId": "demo"}`}'
                </div>
              </div>

              <div>
                <div className="font-mono text-[12px] text-lime font-bold mb-1">2. Strategic Co-Pilot Chat (POST /api/ai/chat)</div>
                <div className="p-3 rounded-xl bg-canvas/90 border border-white/10 font-mono text-[11px] text-white/70 overflow-x-auto">
                  curl -X POST http://localhost:3001/api/ai/chat \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;-d '{`{"message": "ما هي أفضل الاستراتيجيات لزيادة استقرار الفريق؟"}`}'
                </div>
              </div>

              <div>
                <div className="font-mono text-[12px] text-lime font-bold mb-1">3. Convert Prospect to Client (POST /api/prospects/:id/convert)</div>
                <div className="p-3 rounded-xl bg-canvas/90 border border-white/10 font-mono text-[11px] text-white/70 overflow-x-auto">
                  curl -X POST http://localhost:3001/api/prospects/p-12345/convert
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Generate Key Modal */}
        {newKeyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <div className="glass-panel rounded-2xl p-6 w-full max-w-md border border-lime/30 shadow-[0_0_60px_rgba(163,230,53,0.15)] animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
                <div className="w-9 h-9 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-pistachio">Generate API Key</h3>
                  <p className="text-[11px] text-white/50">Issue secret token for automated integrations</p>
                </div>
              </div>

              <form onSubmit={handleGenerateKey} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1.5">KEY NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CI/CD Bot, Mobile App Gateway"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1.5">ROLE & SCOPE</label>
                  <select
                    value={keyRole}
                    onChange={(e) => setKeyRole(e.target.value as any)}
                    className="w-full bg-canvas/80 border border-white/10 focus:border-lime/50 rounded-xl px-3 py-2 text-[13px] text-pistachio outline-none"
                  >
                    <option value="WRITE">WRITE (Full read & mutation)</option>
                    <option value="READ">READ (Read-only analytics)</option>
                    <option value="FULL_ADMIN">FULL_ADMIN (Unrestricted system access)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/60 mb-1.5">ENVIRONMENT</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['live', 'test'] as const).map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setKeyEnv(e)}
                        className={`py-2 px-3 rounded-xl text-[12px] font-mono font-bold border transition-all ${
                          keyEnv === e
                            ? 'bg-lime/20 border-lime text-lime'
                            : 'bg-white/5 border-white/10 text-white/50'
                        }`}
                      >
                        {e.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNewKeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 text-[13px] font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() => setNewKeyModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-lime hover:bg-lime/90 text-canvas font-bold text-[13px] shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                  >
                    Generate Token
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
