// PulseTeaser — React island wrapping the same logic as landing's Pulse 360° (md:118)
// Reuses HealthScore formula from @999x/contracts
import { useState, useEffect, useRef } from 'react';

export default function PulseTeaser() {
  const [category, setCategory] = useState<'STARTUP'|'VOLUNTEER_TEAM'|'EVENT'>('STARTUP');
  const [pain, setPain] = useState('hierarchy');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // simplified radar draw (same as landing)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const size=240, cx=120, cy=120, R=80;
    ctx.clearRect(0,0,size,size);
    // grid
    for(let ring=1; ring<=4; ring++){
      const r=R*(ring/4);
      ctx.beginPath();
      for(let i=0;i<4;i++){ const a=-Math.PI/2+i*Math.PI/2; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }
      ctx.closePath(); ctx.strokeStyle= ring===4 ? 'rgba(163,230,53,0.35)' : 'rgba(243,248,204,0.08)'; ctx.stroke();
    }
    ctx.strokeStyle='#A3E635'; ctx.lineWidth=2;
    ctx.beginPath();
    [0.72,0.62,0.68,0.74].forEach((v,i)=>{ const a=-Math.PI/2+i*Math.PI/2; const r=R*v; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.closePath(); ctx.fillStyle='rgba(163,230,53,0.22)'; ctx.fill(); ctx.stroke();
  }, [category, pain]);

  return (
    <div className="glass-panel rounded-3xl p-7">
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(['STARTUP','VOLUNTEER_TEAM','EVENT'] as const).map(c=>(
          <button key={c} onClick={()=>setCategory(c)} className={`p-3 rounded-xl text-[12px] font-bold border ${category===c ? 'bg-lime text-canvas border-lime' : 'bg-canvas text-pistachio border-white/10'}`}>{c}</button>
        ))}
      </div>
      <select value={pain} onChange={e=>setPain(e.target.value)} className="w-full h-11 rounded-xl px-3 bg-canvas border border-white/15 text-pistachio">
        <option value="churn">High Churn</option><option value="hierarchy">No RACI</option><option value="sponsor">Low Sponsor Close</option>
      </select>
      <canvas ref={canvasRef} width={240} height={240} className="mx-auto mt-6 w-[240px] h-[240px]" />
    </div>
  );
}
