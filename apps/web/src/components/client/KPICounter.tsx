import { useEffect, useState } from 'react';

export default function KPICounter({ value=84, label="HEALTH" }: { value?: number; label?: string }){
  const [n, setN] = useState(0);
  useEffect(()=>{
    let raf:number, start:number| null=null;
    const animate=(ts:number)=>{
      if(start===null) start=ts;
      const p=Math.min((ts-start)/900,1);
      const eased=1-Math.pow(1-p,3);
      setN(Math.round(eased*value));
      if(p<1) raf=requestAnimationFrame(animate);
    };
    raf=requestAnimationFrame(animate);
    return()=>cancelAnimationFrame(raf);
  },[value]);
  return (
    <div className="text-center p-4 rounded-2xl bg-canvas border border-white/10">
      <div className="font-mono text-[10px] tracking-widest text-white/40">{label}</div>
      <div className="font-mono font-black text-[24px] text-lime">{n}<span className="text-[14px] text-white/30">/100</span></div>
      <div className="h-1 rounded-full bg-white/10 mt-2 overflow-hidden"><div className="h-full bg-lime transition-all duration-700" style={{width:`${n}%`}} /></div>
    </div>
  );
}
