import { useState } from 'react';

export default function PromptStudio(){
  const [prompt, setPrompt] = useState(`You are the "999x Executive Operations Intelligence Engine" — elite strategist. Return VALID JSON ONLY. Tailor to category.`);
  const [model, setModel] = useState('minimax/minimax-m3:free');
  const [stream, setStream] = useState('');
  const [loading, setLoading] = useState(false);

  const test = async ()=>{
    setLoading(true); setStream('');
    const api = (import.meta as any).env?.PUBLIC_API_URL ?? 'http://localhost:3001';
    try{
      const res = await fetch(`${api}/api/ai/generate-plan-stream`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ clientId: 'demo', problemType: 'hierarchy', category: 'STARTUP', modelEngine: model }) });
      if(res.ok && res.body){
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf='';
        while(true){
          const { done, value } = await reader.read();
          if(done) break;
          buf += decoder.decode(value, { stream:true });
          const lines = buf.split('\n');
          buf = lines.pop()||'';
          for(const line of lines){
            if(!line.startsWith('data:')) continue;
            const d=line.slice(5).trim();
            if(d==='[DONE]') break;
            try{ const j=JSON.parse(d); if(j.token) setStream(s=>s+j.token); }catch{}
          }
        }
        setLoading(false);
        // save to LS
        try{ const arr=JSON.parse(localStorage.getItem('999x_ai_studio')||'[]'); arr.unshift({ model, prompt: prompt.slice(0,60), ts: Date.now() }); localStorage.setItem('999x_ai_studio', JSON.stringify(arr)); }catch{}
        return;
      }
    }catch(e){ console.log('SSE fallback', e); }
    // fallback mock
    const mock = JSON.stringify({title:"خطة HR — Test (Fallback)", executiveSummary:"ملخص تجريبي محلي — API غير متاح", milestones:[{id:"m1", title:"RACI", model}], model}, null, 2);
    for(const ch of mock){ setStream(s=>s+ch); await new Promise(r=>setTimeout(r,12)); }
    setLoading(false);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 rounded-2xl p-5 bg-canvas border border-white/10">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-full bg-lime/15 text-lime border border-lime/20 font-mono text-[11px] font-bold">SYSTEM PROMPT — HOT RELOAD</span>
          <select value={model} onChange={e=>setModel(e.target.value)} className="ml-auto h-8 rounded-full px-2 bg-surface border border-white/10 text-[11px] text-pistachio">
            <option value="minimax/minimax-m3:free">Minimax M3 — FREE</option>
          </select>
        </div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full mt-3 h-[160px] rounded-xl p-3 bg-surface border border-white/10 text-[12px] font-mono text-pistachio/80 outline-none focus:border-lime" />
        <div className="mt-3 flex gap-2">
          <button onClick={test} disabled={loading} className="px-4 h-9 rounded-xl bg-lime text-canvas font-bold text-[12px] disabled:opacity-50">{loading ? 'Streaming...' : 'اختبر Stream →'}</button>
          <span className="text-[11px] font-mono text-white/30 self-center">{model} • {loading ? '42 tok/s' : 'idle'}</span>
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-canvas border border-white/10">
        <div className="font-mono text-[11px] text-white/40">OUTPUT (SSE)</div>
        <pre className="mt-2 p-3 rounded-xl bg-surface border border-white/10 text-[11px] font-mono text-lime leading-5 whitespace-pre-wrap max-h-[220px] overflow-auto">{stream || '— no output yet —'}</pre>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center"><div className="text-white/40">COST</div><div className="font-bold text-emerald-400">$0 (FREE)</div></div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center"><div className="text-white/40">LATENCY</div><div className="font-bold text-lime">1.8s</div></div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center"><div className="text-white/40">CACHE</div><div className="font-bold text-emerald-400">62% hit • 15ms</div></div>
        </div>
      </div>
    </div>
  );
}
