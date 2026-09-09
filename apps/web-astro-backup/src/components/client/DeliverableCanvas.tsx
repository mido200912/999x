import { useState } from 'react';

export default function DeliverableCanvas({ initial = "تم اعتماد تقسيم اللجان إلى خلايا ثلاثية وتعيين قائد مسؤول عن الـ Onboarding." }: { initial?: string }){
  const [selected, setSelected] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  const handleSelect = () => {
    const sel = window.getSelection()?.toString();
    if (sel && sel.trim().length > 3) setSelected(sel.trim());
  };

  return (
    <div className="rounded-2xl p-4 bg-canvas border border-lime/20" onMouseUp={handleSelect}>
      <div className="text-[11px] font-mono tracking-widest text-white/30">DELIVERABLE — HR ACTION PLAN v1.4</div>
      <p className="text-[13px] leading-7 text-white/80 mt-2 select-text">{initial}</p>
      {selected && (
        <div className="mt-3 rounded-xl p-3 bg-surface border border-lime/20">
          <div className="text-[11px] font-mono text-lime">محدد: "{selected.slice(0,60)}"</div>
          <div className="flex gap-2 mt-2">
            <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="اكتب تعليقك أو اطلب من AI إعادة الصياغة..." className="flex-1 h-9 rounded-full px-3 bg-canvas border border-white/10 text-[12px] text-pistachio outline-none focus:border-lime" />
            <button onClick={()=>{ if(comment){ setComments([...comments, `${selected}: ${comment}`]); setSelected(''); setComment(''); } }} className="px-4 h-9 rounded-full bg-lime text-canvas font-bold text-[12px]">إرسال</button>
          </div>
          <div className="flex gap-1 mt-2">
            <button onClick={()=>setComment('أعد صياغتها بنبرة أكثر صرامة')} className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:border-lime/30">أكثر صرامة</button>
            <button onClick={()=>setComment('بسّط خطوات التنفيذ للمبتدئين')} className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">بسّط للمبتدئين</button>
          </div>
        </div>
      )}
      {comments.length>0 && <div className="mt-3 space-y-1">{comments.map((c,i)=><div key={i} className="text-[11px] p-2 rounded-xl bg-lime/10 border border-lime/20 text-lime">{c}</div>)}</div>}
      <div className="mt-2 text-[11px] font-mono text-white/30 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Presence: سارة + أنت — live</div>
    </div>
  );
}
