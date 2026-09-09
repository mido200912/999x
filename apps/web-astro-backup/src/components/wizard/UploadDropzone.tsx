import { useState, useRef } from 'react';

export default function UploadDropzone({ onFiles }: { onFiles?: (files: File[])=>void }){
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (list: FileList | File[])=>{
    const arr = Array.from(list as any as File[]);
    const valid = arr.filter(f=> ['application/pdf','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/png','image/jpeg'].includes(f.type) || f.name.endsWith('.pdf') || f.name.endsWith('.xlsx'));
    if(valid.length !== arr.length) alert('بعض الملفات غير مدعومة — مسموح PDF/XLSX/DOCX/PNG/JPG فقط');
    const sized = valid.filter(f=> f.size <= 25*1024*1024);
    if(sized.length !== valid.length) alert('ملف يتجاوز 25MB تم تجاهله');
    const next = [...files, ...sized].slice(0,10);
    setFiles(next);
    onFiles?.(next);
  };

  return (
    <div>
      <div
        onDragOver={e=>{e.preventDefault(); setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={e=>{e.preventDefault(); setDrag(false); if(e.dataTransfer.files) add(e.dataTransfer.files);}}
        onClick={()=>inputRef.current?.click()}
        className={`rounded-2xl p-8 text-center border-2 border-dashed cursor-pointer transition ${drag ? 'border-lime bg-lime/5' : 'border-lime/25 bg-canvas hover:border-lime/40'}`}
      >
        <div className="w-10 h-10 rounded-xl bg-lime/15 border border-lime/20 text-lime flex items-center justify-center mx-auto">⇧</div>
        <p className="text-[13px] text-pistachio font-bold mt-2">اسحب الملفات هنا أو اضغط للاختيار</p>
        <p className="text-[11px] text-white/30 mt-1">PDF / XLSX / DOCX — حتى 25MB — تحقق فوري بدون Reload</p>
        <input ref={inputRef} type="file" multiple accept=".pdf,.xlsx,.docx,.png,.jpg" className="hidden" onChange={e=> e.target.files && add(e.target.files)} />
      </div>
      {files.length>0 && (
        <div className="mt-3 space-y-1">
          {files.map(f=>(
            <div key={f.name} className="flex items-center justify-between p-2 rounded-xl bg-surface border border-white/10 text-[12px]">
              <span className="text-pistachio truncate">{f.name}</span>
              <span className="font-mono text-[11px] text-white/40">{(f.size/1024).toFixed(0)} KB</span>
            </div>
          ))}
          <button onClick={()=>setFiles([])} className="text-[11px] text-white/40 hover:text-red-300">مسح الكل</button>
        </div>
      )}
    </div>
  );
}
