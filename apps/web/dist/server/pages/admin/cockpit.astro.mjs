import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DCRK0Qyq.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_BKke6ubM.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Cockpit = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Ops War Room \u2014 Matrix Kanban | 999x", "role": "OPS_MEMBER" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="flex flex-wrap items-center justify-between gap-4"> <div> <div class="flex items-center gap-2 mb-1"> <span class="w-2.5 h-2.5 rounded-full bg-lime animate-pulse"></span> <span class="font-mono text-[11px] text-lime uppercase tracking-widest">999x CENTRAL OPS WAR ROOM</span> </div> <h1 class="font-display font-bold text-[22px] sm:text-[28px] text-pistachio">\u0642\u0645\u0631\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0645\u0631\u0643\u0632\u064A\u0629 \u2014 Matrix Kanban</h1> <p class="text-[13px] text-pistachio/60 font-sub">\u0625\u062F\u0627\u0631\u0629 \u0648\u062A\u062A\u0628\u0639 \u0645\u062E\u0631\u062C\u0627\u062A 30 \u0639\u0645\u064A\u0644\u0627\u064B \u0644\u062D\u0638\u064A\u0627\u064B \u0645\u0639 \u0631\u0628\u0637 \u0645\u0628\u0627\u0634\u0631 \u0628\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0648\u0642\u062A.</p> </div> <div class="flex items-center gap-3"> <button id="btnQuickAddTask" class="px-4 h-11 btn-lime text-[13px] font-bold flex items-center gap-2"> <span>+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0645\u0629 \u0633\u0631\u064A\u0639\u0629</span> </button> </div> </div>  <div class="mt-6 p-4 rounded-2xl bg-canvas border border-white/10 flex flex-wrap items-center justify-between gap-4 text-[12px] font-mono"> <div class="flex items-center gap-4"> <span class="text-pistachio/50">\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u062A\u062E\u0635\u0635:</span> <div class="flex gap-1.5" id="filterBtnGroup"> <button class="px-2.5 py-1 rounded-lg bg-lime text-canvas font-bold transition" data-filter="all">\u0627\u0644\u0643\u0644 (22)</button> <button class="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-pistachio/70 hover:border-lime/30 transition" data-filter="hr">HR Engine (10)</button> <button class="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-pistachio/70 hover:border-lime/30 transition" data-filter="sponsor">Sponsors (7)</button> <button class="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-pistachio/70 hover:border-lime/30 transition" data-filter="pr">PR & Pitch (5)</button> </div> </div> <div class="flex items-center gap-4"> <span class="text-emerald-400">\u25CF 100% On-Time SLA</span> <span class="text-pistachio/40">|</span> <span>14ms L2 Cache</span> </div> </div>  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="kanbanGrid"> <div class="rounded-3xl p-8 bg-canvas border border-white/10 flex flex-col items-center justify-center text-center col-span-full"> <span class="w-6 h-6 border-2 border-lime/30 border-t-lime rounded-full animate-spin"></span> <div class="text-[13px] text-white/40 mt-3">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A...</div> </div> </div>  <div class="hidden"> <div id="kanbanColBacklog"></div> <div id="kanbanColProgress"></div> <div id="kanbanColReview"></div> <div id="kanbanColDone"></div> </div>  <div class="mt-8 glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono"> <div class="flex items-center gap-3"> <span class="w-3 h-3 rounded-full bg-lime animate-pulse"></span> <span class="text-pistachio/70">OpenRouter Active Gateway: <strong class="text-lime">Minimax M3</strong> (Fallback: Minimax M3 \u2192 Minimax M3)</span> </div> <div class="flex items-center gap-3"> <span class="text-pistachio/50">Token Quota: 182K / 200K</span> <div class="w-32 h-2 rounded-full bg-white/10 overflow-hidden"> <div class="h-full bg-lime rounded-full" style="width: 91%"></div> </div> </div> </div> <script>
    document.getElementById('btnQuickAddTask')?.addEventListener('click', async () => {
      const taskName = prompt('\u0627\u0633\u0645 \u0627\u0644\u0645\u0647\u0645\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629:', '\u0635\u064A\u0627\u063A\u0629 \u0628\u0627\u0642\u0629 \u0631\u0639\u0627\u064A\u0629 \u0628\u0631\u0648\u0646\u0632\u064A\u0629 \u062C\u062F\u064A\u062F\u0629');
      if (!taskName) return;
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      let created = false;
      try{
        const res = await fetch(\`\${api}/api/admin/tasks\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: taskName, clientId: '000000000000000000000001', priority:'MEDIUM' }) });
        if(res.ok){ const j=await res.json(); console.log('[999x] task created', j.data); created = true; }
      }catch(e){ console.log('task API fallback', e); }
      try{ const arr=JSON.parse(localStorage.getItem('999x_kanban_tasks')||'[]'); arr.unshift({ title: taskName, col:'BACKLOG', ts: Date.now() }); localStorage.setItem('999x_kanban_tasks', JSON.stringify(arr)); }catch{}
      // reload grid to show new task
      const grid = document.getElementById('kanbanGrid');
      if(grid){
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-2xl bg-surface border border-lime/40 space-y-2 animate-fade-in';
        card.innerHTML = \`<div class="flex justify-between items-start"><span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-lime/15 text-lime">NEW</span><span class="text-[10px] font-mono text-pistachio/50">Just Now</span></div><div class="font-bold text-[13px] text-pistachio">\${taskName}</div><div class="flex justify-between text-[11px] font-mono text-pistachio/50 pt-1"><span>Ops Auto-Assigned</span><span class="text-lime">ETA: 12h</span></div>\`;
        // if grid shows empty state, replace it
        if(grid.textContent.includes('\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645')){
          grid.innerHTML = \`<div class="rounded-3xl p-4 bg-canvas border border-white/10"><div class="font-bold text-[13px] text-lime mb-3">BACKLOG \u2022 1</div><div class="space-y-3" id="kanbanColBacklogNew"></div></div>\`;
          document.getElementById('kanbanColBacklogNew')?.appendChild(card);
        } else {
          // try to find first column
          const firstCol = grid.querySelector('.rounded-3xl');
          if(firstCol) firstCol.querySelector('.space-y-3')?.prepend(card);
          else grid.prepend(card);
        }
      }
      alert(created ? '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0647\u0645\u0629 \u0648\u062D\u0641\u0638\u0647\u0627 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D!' : '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0647\u0645\u0629 \u0645\u062D\u0644\u064A\u0627\u064B (\u0633\u064A\u062A\u0645 \u0645\u0632\u0627\u0645\u0646\u062A\u0647\u0627 \u0639\u0646\u062F \u062A\u0648\u0641\u0631 \u0627\u0644\u0640 DB)');
    });

    // Load real kanban on start \u2014 no dummy data
    (async ()=>{
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      const grid = document.getElementById('kanbanGrid');
      try{
        const res = await fetch(\`\${api}/api/admin/cockpit\`);
        if(res.ok){
          const j=await res.json();
          const kanban = j.data?.kanban;
          const clients = j.data?.clients || [];
          const badge = document.querySelector('.bg-lime.text-canvas');
          if(badge) badge.textContent = clients.length + ' \u0639\u0645\u064A\u0644';
          if(grid){
            const cols = ['BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','COMPLETED'];
            const titles = { BACKLOG:'BACKLOG', TODO:'TODO', IN_PROGRESS:'IN PROGRESS', IN_REVIEW:'IN REVIEW', COMPLETED:'COMPLETED \u2713' };
            const hasData = kanban && Object.values(kanban).some((arr:any)=>arr.length>0);
            if(!hasData){
              grid.innerHTML = \`
                <div class="rounded-3xl p-10 bg-canvas border border-dashed border-white/10 flex flex-col items-center justify-center text-center col-span-full">
                  <div class="w-12 h-12 rounded-2xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime text-xl">\u{1F4CB}</div>
                  <div class="font-bold text-pistachio mt-3">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645 \u0628\u0639\u062F</div>
                  <div class="text-[13px] text-white/40 mt-1">\u0627\u0628\u062F\u0623 \u0628\u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0644 \u0645\u0647\u0645\u0629 \u2014 \u0633\u064A\u062A\u0645 \u062D\u0641\u0638\u0647\u0627 \u0641\u064A MongoDB \u0648 LocalStorage</div>
                  <button onclick="document.getElementById('btnQuickAddTask')?.click()" class="mt-4 px-5 h-9 rounded-xl bg-lime text-canvas font-bold text-[12px]">+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0645\u0629</button>
                </div>
              \`;
            } else {
              grid.innerHTML = cols.map(col=>{
                const tasks = (kanban[col]||[]);
                const items = tasks.map((t:any)=>\`
                  <div class="p-3.5 rounded-2xl bg-surface border border-white/10 space-y-2">
                    <div class="flex justify-between items-start"><span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold \${t.priority==='HIGH'?'bg-amber-400/15 text-amber-300':'bg-white/10 text-white/40'}">\${t.priority||'MEDIUM'}</span><span class="text-[10px] font-mono text-pistachio/40">\${String(t.clientId).slice(-4)}</span></div>
                    <div class="font-bold text-[13px] text-pistachio">\${t.title}</div>
                    <div class="text-[11px] font-mono text-white/30">\${new Date(t.deadline).toLocaleDateString('ar-EG')}</div>
                  </div>
                \`).join('') || '<div class="p-6 text-center text-[11px] text-white/20">\u0641\u0627\u0631\u063A \u2014 \u0627\u0633\u062D\u0628 \u0645\u0647\u0627\u0645 \u0644\u0647\u0646\u0627</div>';
                return \`<div class="rounded-3xl p-4 bg-canvas border border-white/10"><div class="flex justify-between items-center pb-3 mb-3 border-b border-white/[0.08]"><span class="font-bold text-[13px] \${col==='IN_PROGRESS'?'text-lime':'text-white/40'}">\${titles[col]}</span><span class="font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded">\${tasks.length}</span></div><div class="space-y-3">\${items}</div></div>\`;
              }).join('');
            }
          }
        }
      }catch{
        if(grid) grid.innerHTML = '<div class="col-span-full p-8 text-center text-[13px] text-white/30">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0647\u0627\u0645 \u2014 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0640 API</div>';
      }
      // also show LS tasks if API empty
      try{
        const lsTasks = JSON.parse(localStorage.getItem('999x_kanban_tasks')||'[]');
        if(lsTasks.length && grid && grid.textContent.includes('\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645')){
          const list = lsTasks.map((t:any)=>\`<div class="p-3 rounded-xl bg-surface border border-lime/20"><div class="font-bold text-[13px] text-pistachio">\${t.title}</div><div class="text-[10px] text-white/30">LocalStorage \u2022 \${new Date(t.ts).toLocaleString('ar-EG')}</div></div>\`).join('');
          grid.innerHTML = \`<div class="rounded-3xl p-4 bg-canvas border border-lime/20 col-span-full"><div class="font-bold text-lime text-[13px] mb-3">\u0645\u0647\u0627\u0645 \u0645\u062D\u0644\u064A\u0629 (LocalStorage)</div><div class="grid sm:grid-cols-2 gap-2">\${list}</div></div>\`;
        }
      }catch{}
    })();
  <\/script> `], [" ", `<div class="flex flex-wrap items-center justify-between gap-4"> <div> <div class="flex items-center gap-2 mb-1"> <span class="w-2.5 h-2.5 rounded-full bg-lime animate-pulse"></span> <span class="font-mono text-[11px] text-lime uppercase tracking-widest">999x CENTRAL OPS WAR ROOM</span> </div> <h1 class="font-display font-bold text-[22px] sm:text-[28px] text-pistachio">\u0642\u0645\u0631\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0627\u0644\u0645\u0631\u0643\u0632\u064A\u0629 \u2014 Matrix Kanban</h1> <p class="text-[13px] text-pistachio/60 font-sub">\u0625\u062F\u0627\u0631\u0629 \u0648\u062A\u062A\u0628\u0639 \u0645\u062E\u0631\u062C\u0627\u062A 30 \u0639\u0645\u064A\u0644\u0627\u064B \u0644\u062D\u0638\u064A\u0627\u064B \u0645\u0639 \u0631\u0628\u0637 \u0645\u0628\u0627\u0634\u0631 \u0628\u0646\u0645\u0627\u0630\u062C \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0648\u0639\u062F\u0627\u062F\u0627\u062A \u0627\u0644\u0648\u0642\u062A.</p> </div> <div class="flex items-center gap-3"> <button id="btnQuickAddTask" class="px-4 h-11 btn-lime text-[13px] font-bold flex items-center gap-2"> <span>+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0645\u0629 \u0633\u0631\u064A\u0639\u0629</span> </button> </div> </div>  <div class="mt-6 p-4 rounded-2xl bg-canvas border border-white/10 flex flex-wrap items-center justify-between gap-4 text-[12px] font-mono"> <div class="flex items-center gap-4"> <span class="text-pistachio/50">\u062A\u0635\u0641\u064A\u0629 \u0627\u0644\u062A\u062E\u0635\u0635:</span> <div class="flex gap-1.5" id="filterBtnGroup"> <button class="px-2.5 py-1 rounded-lg bg-lime text-canvas font-bold transition" data-filter="all">\u0627\u0644\u0643\u0644 (22)</button> <button class="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-pistachio/70 hover:border-lime/30 transition" data-filter="hr">HR Engine (10)</button> <button class="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-pistachio/70 hover:border-lime/30 transition" data-filter="sponsor">Sponsors (7)</button> <button class="px-2.5 py-1 rounded-lg bg-surface border border-white/10 text-pistachio/70 hover:border-lime/30 transition" data-filter="pr">PR & Pitch (5)</button> </div> </div> <div class="flex items-center gap-4"> <span class="text-emerald-400">\u25CF 100% On-Time SLA</span> <span class="text-pistachio/40">|</span> <span>14ms L2 Cache</span> </div> </div>  <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="kanbanGrid"> <div class="rounded-3xl p-8 bg-canvas border border-white/10 flex flex-col items-center justify-center text-center col-span-full"> <span class="w-6 h-6 border-2 border-lime/30 border-t-lime rounded-full animate-spin"></span> <div class="text-[13px] text-white/40 mt-3">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0647\u0627\u0645 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0645\u0646 \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A...</div> </div> </div>  <div class="hidden"> <div id="kanbanColBacklog"></div> <div id="kanbanColProgress"></div> <div id="kanbanColReview"></div> <div id="kanbanColDone"></div> </div>  <div class="mt-8 glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono"> <div class="flex items-center gap-3"> <span class="w-3 h-3 rounded-full bg-lime animate-pulse"></span> <span class="text-pistachio/70">OpenRouter Active Gateway: <strong class="text-lime">Minimax M3</strong> (Fallback: Minimax M3 \u2192 Minimax M3)</span> </div> <div class="flex items-center gap-3"> <span class="text-pistachio/50">Token Quota: 182K / 200K</span> <div class="w-32 h-2 rounded-full bg-white/10 overflow-hidden"> <div class="h-full bg-lime rounded-full" style="width: 91%"></div> </div> </div> </div> <script>
    document.getElementById('btnQuickAddTask')?.addEventListener('click', async () => {
      const taskName = prompt('\u0627\u0633\u0645 \u0627\u0644\u0645\u0647\u0645\u0629 \u0627\u0644\u062C\u062F\u064A\u062F\u0629:', '\u0635\u064A\u0627\u063A\u0629 \u0628\u0627\u0642\u0629 \u0631\u0639\u0627\u064A\u0629 \u0628\u0631\u0648\u0646\u0632\u064A\u0629 \u062C\u062F\u064A\u062F\u0629');
      if (!taskName) return;
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      let created = false;
      try{
        const res = await fetch(\\\`\\\${api}/api/admin/tasks\\\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title: taskName, clientId: '000000000000000000000001', priority:'MEDIUM' }) });
        if(res.ok){ const j=await res.json(); console.log('[999x] task created', j.data); created = true; }
      }catch(e){ console.log('task API fallback', e); }
      try{ const arr=JSON.parse(localStorage.getItem('999x_kanban_tasks')||'[]'); arr.unshift({ title: taskName, col:'BACKLOG', ts: Date.now() }); localStorage.setItem('999x_kanban_tasks', JSON.stringify(arr)); }catch{}
      // reload grid to show new task
      const grid = document.getElementById('kanbanGrid');
      if(grid){
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-2xl bg-surface border border-lime/40 space-y-2 animate-fade-in';
        card.innerHTML = \\\`<div class="flex justify-between items-start"><span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold bg-lime/15 text-lime">NEW</span><span class="text-[10px] font-mono text-pistachio/50">Just Now</span></div><div class="font-bold text-[13px] text-pistachio">\\\${taskName}</div><div class="flex justify-between text-[11px] font-mono text-pistachio/50 pt-1"><span>Ops Auto-Assigned</span><span class="text-lime">ETA: 12h</span></div>\\\`;
        // if grid shows empty state, replace it
        if(grid.textContent.includes('\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645')){
          grid.innerHTML = \\\`<div class="rounded-3xl p-4 bg-canvas border border-white/10"><div class="font-bold text-[13px] text-lime mb-3">BACKLOG \u2022 1</div><div class="space-y-3" id="kanbanColBacklogNew"></div></div>\\\`;
          document.getElementById('kanbanColBacklogNew')?.appendChild(card);
        } else {
          // try to find first column
          const firstCol = grid.querySelector('.rounded-3xl');
          if(firstCol) firstCol.querySelector('.space-y-3')?.prepend(card);
          else grid.prepend(card);
        }
      }
      alert(created ? '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0647\u0645\u0629 \u0648\u062D\u0641\u0638\u0647\u0627 \u0641\u064A \u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0628\u0646\u062C\u0627\u062D!' : '\u062A\u0645\u062A \u0625\u0636\u0627\u0641\u0629 \u0627\u0644\u0645\u0647\u0645\u0629 \u0645\u062D\u0644\u064A\u0627\u064B (\u0633\u064A\u062A\u0645 \u0645\u0632\u0627\u0645\u0646\u062A\u0647\u0627 \u0639\u0646\u062F \u062A\u0648\u0641\u0631 \u0627\u0644\u0640 DB)');
    });

    // Load real kanban on start \u2014 no dummy data
    (async ()=>{
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      const grid = document.getElementById('kanbanGrid');
      try{
        const res = await fetch(\\\`\\\${api}/api/admin/cockpit\\\`);
        if(res.ok){
          const j=await res.json();
          const kanban = j.data?.kanban;
          const clients = j.data?.clients || [];
          const badge = document.querySelector('.bg-lime.text-canvas');
          if(badge) badge.textContent = clients.length + ' \u0639\u0645\u064A\u0644';
          if(grid){
            const cols = ['BACKLOG','TODO','IN_PROGRESS','IN_REVIEW','COMPLETED'];
            const titles = { BACKLOG:'BACKLOG', TODO:'TODO', IN_PROGRESS:'IN PROGRESS', IN_REVIEW:'IN REVIEW', COMPLETED:'COMPLETED \u2713' };
            const hasData = kanban && Object.values(kanban).some((arr:any)=>arr.length>0);
            if(!hasData){
              grid.innerHTML = \\\`
                <div class="rounded-3xl p-10 bg-canvas border border-dashed border-white/10 flex flex-col items-center justify-center text-center col-span-full">
                  <div class="w-12 h-12 rounded-2xl bg-lime/10 border border-lime/20 flex items-center justify-center text-lime text-xl">\u{1F4CB}</div>
                  <div class="font-bold text-pistachio mt-3">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645 \u0628\u0639\u062F</div>
                  <div class="text-[13px] text-white/40 mt-1">\u0627\u0628\u062F\u0623 \u0628\u0625\u0636\u0627\u0641\u0629 \u0623\u0648\u0644 \u0645\u0647\u0645\u0629 \u2014 \u0633\u064A\u062A\u0645 \u062D\u0641\u0638\u0647\u0627 \u0641\u064A MongoDB \u0648 LocalStorage</div>
                  <button onclick="document.getElementById('btnQuickAddTask')?.click()" class="mt-4 px-5 h-9 rounded-xl bg-lime text-canvas font-bold text-[12px]">+ \u0625\u0636\u0627\u0641\u0629 \u0645\u0647\u0645\u0629</button>
                </div>
              \\\`;
            } else {
              grid.innerHTML = cols.map(col=>{
                const tasks = (kanban[col]||[]);
                const items = tasks.map((t:any)=>\\\`
                  <div class="p-3.5 rounded-2xl bg-surface border border-white/10 space-y-2">
                    <div class="flex justify-between items-start"><span class="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold \\\${t.priority==='HIGH'?'bg-amber-400/15 text-amber-300':'bg-white/10 text-white/40'}">\\\${t.priority||'MEDIUM'}</span><span class="text-[10px] font-mono text-pistachio/40">\\\${String(t.clientId).slice(-4)}</span></div>
                    <div class="font-bold text-[13px] text-pistachio">\\\${t.title}</div>
                    <div class="text-[11px] font-mono text-white/30">\\\${new Date(t.deadline).toLocaleDateString('ar-EG')}</div>
                  </div>
                \\\`).join('') || '<div class="p-6 text-center text-[11px] text-white/20">\u0641\u0627\u0631\u063A \u2014 \u0627\u0633\u062D\u0628 \u0645\u0647\u0627\u0645 \u0644\u0647\u0646\u0627</div>';
                return \\\`<div class="rounded-3xl p-4 bg-canvas border border-white/10"><div class="flex justify-between items-center pb-3 mb-3 border-b border-white/[0.08]"><span class="font-bold text-[13px] \\\${col==='IN_PROGRESS'?'text-lime':'text-white/40'}">\\\${titles[col]}</span><span class="font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded">\\\${tasks.length}</span></div><div class="space-y-3">\\\${items}</div></div>\\\`;
              }).join('');
            }
          }
        }
      }catch{
        if(grid) grid.innerHTML = '<div class="col-span-full p-8 text-center text-[13px] text-white/30">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0647\u0627\u0645 \u2014 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u0640 API</div>';
      }
      // also show LS tasks if API empty
      try{
        const lsTasks = JSON.parse(localStorage.getItem('999x_kanban_tasks')||'[]');
        if(lsTasks.length && grid && grid.textContent.includes('\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u0647\u0627\u0645')){
          const list = lsTasks.map((t:any)=>\\\`<div class="p-3 rounded-xl bg-surface border border-lime/20"><div class="font-bold text-[13px] text-pistachio">\\\${t.title}</div><div class="text-[10px] text-white/30">LocalStorage \u2022 \\\${new Date(t.ts).toLocaleString('ar-EG')}</div></div>\\\`).join('');
          grid.innerHTML = \\\`<div class="rounded-3xl p-4 bg-canvas border border-lime/20 col-span-full"><div class="font-bold text-lime text-[13px] mb-3">\u0645\u0647\u0627\u0645 \u0645\u062D\u0644\u064A\u0629 (LocalStorage)</div><div class="grid sm:grid-cols-2 gap-2">\\\${list}</div></div>\\\`;
        }
      }catch{}
    })();
  <\/script> `])), maybeRenderHead()) })}`;
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/cockpit.astro", void 0);

const $$file = "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/cockpit.astro";
const $$url = "/admin/cockpit";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Cockpit,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
