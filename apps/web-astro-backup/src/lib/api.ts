// Typed fetch client for 999x API (Hono)
const API = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3001';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? `API ${res.status}`);
  return json.data as T;
}

export async function streamPlan(clientId: string, problemType: string, onToken: (t: string) => void): Promise<void> {
  const res = await fetch(`${API}/api/ai/generate-plan-stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId, problemType, category: 'STARTUP' }),
    credentials: 'include',
  });
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const d = line.slice(5).trim();
      if (d === '[DONE]') return;
      try { const j = JSON.parse(d); if (j.token) onToken(j.token); } catch {}
    }
  }
}
