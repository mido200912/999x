import { useState, useEffect } from 'react';

type Column = 'BACKLOG'|'TODO'|'IN_PROGRESS'|'IN_REVIEW'|'COMPLETED';
type Task = { id:string; client:string; title:string; priority:'LOW'|'MEDIUM'|'HIGH'|'CRITICAL'; col:Column; minutes:number; deadline:string; };

const initial: Task[] = [];

const cols: Column[] = ['BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','COMPLETED'];

export default function KanbanMatrix(){
  const [tasks, setTasks] = useState<Task[]>(initial);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    (async()=>{
      const api = (import.meta as any).env?.PUBLIC_API_URL ?? 'http://localhost:3001';
      try{
        const res = await fetch(`${api}/api/admin/cockpit`);
        if(res.ok){
          const j = await res.json();
          const grouped = j.data?.kanban;
          if(grouped){
            const all: Task[] = [];
            Object.entries(grouped).forEach(([col, arr]: any)=>{
              (arr as any[]).forEach((t:any)=> all.push({ id: String(t._id), client: String(t.clientId).slice(-4), title: t.title, priority: t.priority, col: col as Column, minutes: t.timeTrackedMinutes||0, deadline: new Date(t.deadline).toLocaleDateString('ar-EG') }));
            });
            if(all.length) setTasks(all);
          }
        }
      }catch{} finally{ setLoading(false); }
    })();
  },[]);
  const move = async (id:string, dir:number)=>{
    const cur = tasks.find(t=>t.id===id);
    if(!cur) return;
    const idx = cols.indexOf(cur.col);
    const next = cols[Math.min(Math.max(idx+dir,0), cols.length-1)];
    setTasks(tasks.map(t=> t.id===id ? {...t, col: next} : t));
    // persist to API
    const api = (import.meta as any).env?.PUBLIC_API_URL ?? 'http://localhost:3001';
    try{ await fetch(`${api}/api/admin/tasks/${id}/move`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ columnStatus: next }) }); }catch{}
  };
  if(loading) return <div class="p-8 text-center text-[13px] text-white/40"><span class="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> جاري تحميل المهام الحقيقية...</div>;
  return (
    <div className="grid lg:grid-cols-5 gap-3">
      {cols.map(col=>{
        const colTasks = tasks.filter(t=>t.col===col);
        return (
        <div key={col} className={`rounded-2xl p-3 border ${col==='IN_PROGRESS' ? 'bg-canvas border-lime/30' : 'bg-canvas border-white/10'}`}>
          <div className={`font-mono text-[11px] font-bold tracking-widest ${col==='IN_PROGRESS' ? 'text-lime' : 'text-white/40'}`}>{col} • {colTasks.length}</div>
          <div className="mt-3 space-y-2">
            {colTasks.length===0 ? <div class="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[11px] text-white/20 text-center">لا توجد مهام — أضف واحدة</div> : colTasks.map(t=>(
              <div key={t.id} className="rounded-xl p-3 bg-surface border border-white/10">
                <div className="text-[11px] font-mono text-white/40">{t.client}</div>
                <div className="font-bold text-pistachio text-[12px] leading-5">{t.title}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.priority==='HIGH' ? 'bg-amber-500/15 text-amber-300' : 'bg-white/5 text-white/40'}`}>{t.priority}</span>
                  <span className="font-mono text-[10px] text-white/30">{t.deadline} • {t.minutes}m</span>
                </div>
                <div className="flex gap-1 mt-2">
                  <button onClick={()=>move(t.id,-1)} className="flex-1 h-7 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60">←</button>
                  <button onClick={()=>move(t.id,1)} className="flex-1 h-7 rounded-full bg-lime/15 border border-lime/20 text-[11px] text-lime">→</button>
                </div>
              </div>
            ))}
            <button onClick={async ()=>{
              const title=prompt('عنوان التاسك');
              if(!title) return;
              const api=(import.meta as any).env?.PUBLIC_API_URL ?? 'http://localhost:3001';
              try{
                const res=await fetch(`${api}/api/admin/tasks`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, columnStatus: col }) });
                if(res.ok){ const j=await res.json(); setTasks([...tasks, { id: String(j.data._id), client: String(j.data.clientId).slice(-4), title: j.data.title, priority: j.data.priority, col: j.data.columnStatus as Column, minutes:0, deadline:'جديد' }]); return; }
              }catch{}
              setTasks([...tasks, {id: String(Date.now()), client:'Local', title, priority:'MEDIUM', col, minutes:0, deadline:'جديد'}]);
            }} className="w-full h-8 rounded-xl border border-dashed border-white/10 text-[11px] text-white/30 hover:border-lime/30 hover:text-lime">+ إضافة تاسك</button>
          </div>
        </div>
      )})}
    </div>
  );
}
