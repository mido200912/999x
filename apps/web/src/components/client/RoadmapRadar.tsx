import { useState } from 'react';

const stations = [
  { id:'DIAGNOSIS', title:'التشخيص والتنظيف', desc:'Pulse 360° + تقرير أولي', eta:'2 أيام', status:'DONE' },
  { id:'RESTRUCTURING', title:'اعتماد الهيكل', desc:'RACI + أوصاف + Onboarding', eta:'3-5 أيام', status:'IN_PROGRESS' },
  { id:'EXECUTION', title:'إطلاق حملة الرعاة', desc:'Pitch Deck + Outreach', eta:'5-7 أيام', status:'PENDING' },
  { id:'COMPLETED', title:'المتابعة والتقييم', desc:'PDF مختوم + QR', eta:'مستمر', status:'PENDING' },
];

export default function RoadmapRadar(){
  const [open, setOpen] = useState<string>('RESTRUCTURING');
  return (
    <div className="space-y-3">
      <div className="hidden lg:block h-px bg-white/10 relative">
        <div className="absolute inset-y-0 left-0 w-[38%] bg-lime h-px shadow-[0_0_10px_rgba(163,230,53,0.6)]" />
      </div>
      <div className="grid lg:grid-cols-4 gap-3">
        {stations.map(s=>(
          <button key={s.id} onClick={()=>setOpen(open===s.id?'':s.id)} className={`text-start rounded-2xl p-4 border text-[13px] transition ${s.status==='DONE' ? 'bg-lime/10 border-lime/30' : s.status==='IN_PROGRESS' ? 'bg-surface border-lime/40 shadow-[0_0_20px_rgba(163,230,53,0.15)]' : 'bg-canvas border-white/10 opacity-80'}`}>
            <div className="font-mono font-bold text-lime text-[12px]">{s.id}</div>
            <div className="font-bold text-pistachio mt-1">{s.title}</div>
            <div className="text-white/50 text-[12px]">{s.desc}</div>
            <div className="text-[11px] font-mono text-white/30 mt-2">{s.eta} • {s.status}</div>
            {open===s.id && <div className="mt-3 rounded-xl p-3 bg-canvas border border-white/10 text-[12px] leading-5 text-white/70">مخرجات: هيكل RACI من 3 مستويات + 4 أوصاف وظيفية + Onboarding Kit. <span className="text-lime">اعتمد أو علّق inline →</span></div>}
          </button>
        ))}
      </div>
    </div>
  );
}
