/**
 * lib/api.ts — عميل HTTP الموحد للـ Frontend
 * كل الصفحات تستخدم هذه الدالة للتواصل مع Hono API
 * يتعامل مع base URL تلقائياً (proxy في dev، env في prod)
 */

// base URL: في dev نستخدم proxy (/api → localhost:3001)، في prod من env
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * دالة fetch عامة — ترجع data أو ترمي خطأ
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('/api') ? path : `/api${path}`;
  const fullUrl = `${API_BASE}${url}`;

  console.log('[999x API] ➡️ REQUEST:', init?.method || 'GET', fullUrl, init?.body ? JSON.parse(init.body as string) : '');

  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init?.headers as any || {}) };
  
  // Attach active client ID if available
  try {
    const clientStr = localStorage.getItem('999x_client');
    if (clientStr) {
      const client = JSON.parse(clientStr);
      if (client?.id) headers['x-client-id'] = client.id;
    }
  } catch {}

  const res = await fetch(fullUrl, {
    ...init,
    headers,
    credentials: 'include',
  });

  const json = await res.json().catch((e) => {
    console.error('[999x API] ❌ JSON parse failed:', e);
    return {};
  });

  console.log('[999x API] ⬅️ RESPONSE:', res.status, res.headers.get('content-type'), json);

  if (!res.ok) throw new Error(json.error?.message || `API ${res.status}`);
  return (json.data ?? json) as T;
}


/**
 * تسجيل عميل جديد — يُستخدم في Onboarding Wizard
 */
export function registerClient(data: {
  organizationName: string;
  subtitle: string;
  description?: string;
  companyType?: string;
  companyTypeCustom?: string;
  eventDetails?: { expectedDate?: string; budget?: string; attendeesCount?: string };
  customDetails?: Array<{ key: string; value: string }>;
  brandColor?: string;
  logoUrl?: string;
  primaryContact: { name: string; email?: string; phone: string; whatsappPhone?: string };
}) {
  return api<{ id: string; healthScore: number }>('/clients/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * تشخيص Pulse 360° — يُستخدم في اللاندينج
 */
export function diagnosePulse(data: {
  category: string;
  pains: string[];
  teamSize: number;
}) {
  return api<{ hr: number; churn: number; sponsor: number; exec: number; health: number; brief: string }>('/ai/diagnose-pulse', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ستريم توليد الخطة — SSE
 * يستدعي /api/ai/generate-plan-stream ويستقبل التوكنز لحظياً
 */
export async function streamPlan(
  clientId: string,
  problemType: string,
  onToken: (token: string) => void,
  category = 'STARTUP'
) {
  const res = await fetch(`${API_BASE}/api/ai/generate-plan-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, problemType, category }),
    credentials: 'include',
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error((j.error && j.error.message) || ('AI Error: ' + res.status));
  }
  if (!res.body) throw new Error('No stream body received from server');
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const d = line.slice(5).trim();
      if (d === '[DONE]') return;
      try {
        const j = JSON.parse(d);
        if (j.error) throw new Error('AI Error: ' + j.error);
        if (j.token) onToken(j.token);
      } catch (e: any) {
        if (e && e.message && e.message.startsWith('AI Error')) throw e;
      }
    }
  }
}

