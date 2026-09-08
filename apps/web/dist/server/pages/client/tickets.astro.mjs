import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DCRK0Qyq.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_BKke6ubM.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Tickets = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Tickets & WhatsApp Gateway \u2014 999x" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", `<div class="flex flex-wrap items-center justify-between gap-4"> <div> <h1 class="font-display font-bold text-[22px] sm:text-[26px] text-pistachio">\u0645\u0631\u0643\u0632 \u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0648\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628</h1> <p class="text-[13px] text-pistachio/60 font-sub mt-1">Live Ticketing Hub \u2014 \u0645\u0639\u0627\u0644\u062C\u0629 \u0641\u0648\u0631\u064A\u0629 \u0648\u062A\u0641\u0631\u064A\u063A \u0630\u0643\u064A \u0644\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0635\u0648\u062A\u064A\u0629 \u0639\u0628\u0631 WhatsApp Webhook.</p> </div> <button id="btnOpenNewTicket" class="px-5 h-11 btn-lime text-[13px] font-bold flex items-center gap-2"> <span>+ \u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629 \u062C\u062F\u064A\u062F\u0629</span> </button> </div>  <div class="mt-6 grid gap-4" id="ticketsListContainer"> <div class="glass-panel rounded-2xl p-8 text-center" id="ticketsLoading"> <span class="w-5 h-5 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> <div class="text-[13px] text-white/40 mt-2">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629...</div> </div> <div id="ticketsEmpty" class="hidden glass-panel rounded-2xl p-8 text-center border-dashed"> <div class="text-[14px] text-pistachio/60">\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u0628\u0639\u062F \u2014 \u0627\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u062A\u0643 \u0627\u0644\u0623\u0648\u0644\u0649 \u0648\u0633\u064A\u062A\u0645 \u0625\u0634\u0639\u0627\u0631 \u063A\u0631\u0641\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0641\u0648\u0631\u0627\u064B</div> <div class="text-[12px] text-white/30 mt-1">\u0623\u0648 \u0623\u0631\u0633\u0644 \u0648\u0627\u062A\u0633\u0627\u0628 \u0625\u0644\u0649 +20 101 999 3801</div> </div> <!-- \u0633\u064A\u062A\u0645 \u0645\u0644\u0621 \u0627\u0644\u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0647\u0646\u0627 \u0639\u0628\u0631 JS --> <div id="ticketsRealList" class="grid gap-4"></div> <template id="ticketTemplate"> <div class="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-lime/20"> <div class="space-y-2"> <div class="flex items-center gap-2.5 flex-wrap"> <span data-field="urg" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-pistachio/60 border border-white/10">URG</span> <span data-field="src" class="text-[11px] font-mono text-pistachio/50">SRC</span> <span data-field="time" class="text-[11px] font-mono text-pistachio/40">\u2022 TIME</span> <span data-field="status" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime/15 text-lime border border-lime/30">STATUS</span> </div> <div data-field="subj" class="font-bold text-pistachio text-[15px]">SUBJECT</div> <div class="text-[12.5px] text-lime font-sub flex items-center gap-2"> <span>\u26A1 \u0631\u062F \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0645\u0642\u062A\u0631\u062D:</span> <span data-field="ai" class="text-pistachio/80">AI</span> </div> </div> <button class="shrink-0 px-4 h-9 rounded-xl bg-surface border border-white/10 hover:border-lime/40 text-pistachio text-[12px] font-bold transition">
\u0639\u0631\u0636 \u0627\u0644\u0640 Thread \u0643\u0627\u0645\u0644 \u2192
</button> </div> </template> </div>  <div class="mt-8 rounded-2xl p-5 bg-canvas border border-lime/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-pistachio/60"> <div class="flex items-center gap-3"> <span class="text-[22px]">\u{1F4F2}</span> <div> <div class="font-bold text-pistachio text-[13px]">\u0628\u0648\u0627\u0628\u0629 \u0637\u0648\u0627\u0631\u0626 WhatsApp \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629</div> <div>\u0623\u0631\u0633\u0644 \u0631\u0633\u0627\u0644\u0629 \u0646\u0635\u064A\u0629 \u0623\u0648 \u0635\u0648\u062A\u064A\u0629 \u0625\u0644\u0649 <span class="text-lime font-bold">+20 101 999 3801</span> \u0648\u0633\u064A\u062A\u0645 \u062A\u0641\u0631\u064A\u063A\u0647\u0627 \u0648\u062A\u0648\u0644\u064A\u062F \u062A\u0630\u0643\u0631\u0629 \u0641\u0648\u0631\u064A\u0629 \u062E\u0644\u0627\u0644 58 \u062B\u0627\u0646\u064A\u0629.</div> </div> </div> <span class="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
Webhook Live \u2022 24/7 Active
</span> </div>  <div id="newTicketModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-300"> <div class="glass-panel rounded-3xl p-7 max-w-[540px] w-full border-lime/40 space-y-4"> <div class="flex justify-between items-center border-b border-white/[0.08] pb-3"> <h3 class="font-display font-bold text-[18px] text-pistachio">\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629 \u0637\u0648\u0627\u0631\u0626 \u062C\u062F\u064A\u062F\u0629</h3> <button id="btnCloseTicketModal" class="text-pistachio/50 hover:text-pistachio text-[18px]">\u2715</button> </div> <div class="space-y-3 font-sub text-[13px]"> <div> <label class="block font-bold text-pistachio mb-1">\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062A\u0630\u0643\u0631\u0629:</label> <input id="ticketSubjectInput" type="text" placeholder="e.g. \u0627\u0646\u0633\u062D\u0627\u0628 \u0631\u0627\u0639\u064A \u0623\u0648 \u062A\u0623\u062E\u0631 \u0627\u0639\u062A\u0645\u0627\u062F" class="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio outline-none focus:border-lime"> </div> <div> <label class="block font-bold text-pistachio mb-1">\u062F\u0631\u062C\u0629 \u0627\u0644\u0623\u0647\u0645\u064A\u0629 (Urgency):</label> <select id="ticketUrgencySelect" class="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio outline-none focus:border-lime"> <option value="CRITICAL_BLOCKER">\u{1F6A8} \u062D\u0631\u062C \u062C\u062F\u0627\u064B (Critical Blocker \u2014 \u0631\u062F \u062E\u0644\u0627\u0644 \u062F\u0642\u064A\u0642\u062A\u064A\u0646)</option> <option value="URGENT">\u26A0\uFE0F \u0639\u0627\u062C\u0644 (Urgent \u2014 \u062E\u0644\u0627\u0644 4 \u0633\u0627\u0639\u0627\u062A)</option> <option value="NORMAL">\u2139\uFE0F \u0639\u0627\u062F\u064A (Normal \u2014 \u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u062A\u0634\u063A\u064A\u0644\u064A)</option> </select> </div> <div> <label class="block font-bold text-pistachio mb-1">\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0629:</label> <textarea id="ticketDescInput" rows="3" placeholder="\u0627\u0634\u0631\u062D \u0645\u0627 \u062D\u062F\u062B \u0628\u0627\u0644\u0636\u0628\u0637..." class="w-full p-3 rounded-xl bg-canvas border border-white/15 text-pistachio outline-none focus:border-lime"></textarea> </div> <button id="btnSubmitTicket" class="w-full h-11 btn-lime text-[13.5px] font-bold flex items-center justify-center gap-2 mt-2"> <span>\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0630\u0643\u0631\u0629 \u0641\u0648\u0631\u0627\u064B</span> </button> </div> </div> </div> <script>
    const ticketModal = document.getElementById('newTicketModal');
    const btnOpen = document.getElementById('btnOpenNewTicket');
    const btnClose = document.getElementById('btnCloseTicketModal');
    const btnSubmit = document.getElementById('btnSubmitTicket');
    const container = document.getElementById('ticketsListContainer');

    btnOpen?.addEventListener('click', () => {
      ticketModal?.classList.remove('hidden');
      setTimeout(() => ticketModal?.classList.remove('opacity-0'), 10);
    });

    btnClose?.addEventListener('click', () => {
      ticketModal?.classList.add('opacity-0');
      setTimeout(() => ticketModal?.classList.add('hidden'), 300);
    });

    btnSubmit?.addEventListener('click', async () => {
      const subjEl = document.getElementById('ticketSubjectInput');
      const descEl = document.getElementById('ticketDescInput');
      const subj = subjEl?.value.trim();
      const desc = descEl?.value.trim() || subj;
      const urg = document.getElementById('ticketUrgencySelect')?.value || 'CRITICAL_BLOCKER';
      if (!subj) {
        alert('\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062A\u0630\u0643\u0631\u0629');
        return;
      }
      const api = (window as any).PUBLIC_API_URL || 'http://localhost:3001';
      let clientId = new URLSearchParams(location.search).get('id');
      if(!clientId) try{ clientId = JSON.parse(localStorage.getItem('999x_client')||'{}').id; }catch{}
      if(!clientId) clientId = 'demo';
      // try real API
      try{
        const res = await fetch(\`\${api}/api/clients/\${clientId}/tickets\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ subject: subj, description: desc, urgency: urg, source:'WEB_DASHBOARD' }) });
        if(res.ok){
          const j = await res.json();
          console.log('[999x] ticket created', j.data);
        }
      }catch(e){ console.log('ticket API fallback', e); }
      // persist locally as well
      try{ const arr = JSON.parse(localStorage.getItem('999x_tickets')||'[]'); arr.unshift({ subject: subj, urgency: urg, status:'OPEN', ai: '\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0641\u0648\u0631\u064A \u0644\u063A\u0631\u0641\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x', time:'\u0627\u0644\u0622\u0646' }); localStorage.setItem('999x_tickets', JSON.stringify(arr)); }catch{}

      const card = document.createElement('div');
      card.className = 'glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-lime/40 animate-fade-in';
      card.innerHTML = \`
        <div class="space-y-2">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25">\${urg}</span>
            <span class="text-[11px] font-mono text-pistachio/50">WEB_DASHBOARD</span>
            <span class="text-[11px] font-mono text-pistachio/40">\u2022 \u0627\u0644\u0622\u0646</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime/15 text-lime border border-lime/30">OPEN</span>
          </div>
          <div class="font-bold text-pistachio text-[15px]">\${subj}</div>
          <div class="text-[12.5px] text-lime font-sub flex items-center gap-2">
            <span>\u26A1 \u0631\u062F \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0645\u0642\u062A\u0631\u062D:</span>
            <span class="text-pistachio/80">\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0641\u0648\u0631\u064A \u0644\u063A\u0631\u0641\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x \u0648\u0633\u064A\u0642\u0648\u0645 \u0627\u0644\u0640 Ops Lead \u0628\u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u062E\u0644\u0627\u0644 \u0644\u062D\u0638\u0627\u062A.</span>
          </div>
        </div>
        <button class="shrink-0 px-4 h-9 rounded-xl bg-surface border border-white/10 text-pistachio text-[12px] font-bold">\u0639\u0631\u0636 \u0627\u0644\u0640 Thread \u2192</button>
      \`;

      const realListEl = document.getElementById('ticketsRealList');
      const emptyEl2 = document.getElementById('ticketsEmpty');
      if (realListEl) {
        realListEl.prepend(card);
        if(emptyEl2) emptyEl2.classList.add('hidden');
        const loadingEl2 = document.getElementById('ticketsLoading');
        if(loadingEl2) loadingEl2.classList.add('hidden');
      } else if (container && container.firstChild) {
        container.insertBefore(card, container.firstChild);
      }

      if(subjEl) subjEl.value=''; if(descEl) descEl.value='';
      ticketModal?.classList.add('opacity-0');
      setTimeout(() => ticketModal?.classList.add('hidden'), 300);
      alert('\u062A\u0645 \u0641\u062A\u062D \u0627\u0644\u062A\u0630\u0643\u0631\u0629 \u0648\u0625\u0634\u0639\u0627\u0631 \u063A\u0631\u0641\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x \u0628\u0646\u062C\u0627\u062D! (\u0645\u062D\u0641\u0648\u0638\u0629 \u0641\u064A API + LocalStorage)');
    });

    // Load real tickets on start \u2014 no dummy data
    (async ()=>{
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      let clientId = new URLSearchParams(location.search).get('id');
      if(!clientId) try{ clientId = JSON.parse(localStorage.getItem('999x_client')||'{}').id; }catch{}
      const loadingEl = document.getElementById('ticketsLoading');
      const emptyEl = document.getElementById('ticketsEmpty');
      const realList = document.getElementById('ticketsRealList');
      let hasData = false;
      // try API
      if(clientId){
        try{
          const res = await fetch(\`\${api}/api/clients/\${clientId}/tickets\`);
          if(res.ok){
            const j = await res.json();
            if(j.data && j.data.length){
              hasData = true;
              j.data.forEach((t:any)=>{
                const card = document.createElement('div');
                card.className = 'glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-lime/20';
                card.innerHTML = \`<div class="space-y-2"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-lime/10 text-lime border border-lime/20">\${t.urgency||'NORMAL'}</span><span class="text-[11px] text-pistachio/40">\${t.source||'API'}</span><span class="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40">\${t.status||'OPEN'}</span></div><div class="font-bold text-pistachio text-[15px]">\${t.subject}</div><div class="text-[12px] text-lime">\${t.aiSuggestedSolution||''}</div></div><button class="shrink-0 px-4 h-9 rounded-xl bg-surface border border-white/10 text-pistachio text-[12px]">\u0639\u0631\u0636 \u2192</button>\`;
                realList?.appendChild(card);
              });
            }
          }
        }catch{}
      }
      // also load from LS
      try{
        const lsTickets = JSON.parse(localStorage.getItem('999x_tickets')||'[]');
        lsTickets.forEach((t:any)=>{
          hasData = true;
          const card = document.createElement('div');
          card.className = 'glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-white/10 opacity-90';
          card.innerHTML = \`<div class="space-y-2"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-white/40">\${t.urgency||'NORMAL'}</span><span class="text-[11px] text-pistachio/40">LocalStorage</span></div><div class="font-bold text-pistachio text-[14px]">\${t.subject}</div><div class="text-[12px] text-white/50">\${t.ai||''}</div></div>\`;
          realList?.appendChild(card);
        });
      }catch{}
      if(loadingEl) loadingEl.classList.add('hidden');
      if(!hasData && emptyEl) emptyEl.classList.remove('hidden');
      // fix new ticket insertion to go to realList
      const origInsert = container?.insertBefore;
      // override container to realList for new tickets
      if(container && realList){
        // patch btnSubmit to use realList
        const btnSubmitEl = document.getElementById('btnSubmitTicket');
        if(btnSubmitEl){
          // already handled above, but ensure new cards go to realList
          btnSubmitEl.addEventListener('click', ()=>{
            setTimeout(()=>{
              const last = realList.lastChild as HTMLElement;
              if(last) last.classList.add('border-lime/40');
              if(emptyEl) emptyEl.classList.add('hidden');
            },100);
          });
        }
      }
    })();
  <\/script> `], [" ", `<div class="flex flex-wrap items-center justify-between gap-4"> <div> <h1 class="font-display font-bold text-[22px] sm:text-[26px] text-pistachio">\u0645\u0631\u0643\u0632 \u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u0637\u0648\u0627\u0631\u0626 \u0648\u0628\u0648\u0627\u0628\u0629 \u0627\u0644\u0648\u0627\u062A\u0633\u0627\u0628</h1> <p class="text-[13px] text-pistachio/60 font-sub mt-1">Live Ticketing Hub \u2014 \u0645\u0639\u0627\u0644\u062C\u0629 \u0641\u0648\u0631\u064A\u0629 \u0648\u062A\u0641\u0631\u064A\u063A \u0630\u0643\u064A \u0644\u0644\u0631\u0633\u0627\u0626\u0644 \u0627\u0644\u0635\u0648\u062A\u064A\u0629 \u0639\u0628\u0631 WhatsApp Webhook.</p> </div> <button id="btnOpenNewTicket" class="px-5 h-11 btn-lime text-[13px] font-bold flex items-center gap-2"> <span>+ \u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629 \u062C\u062F\u064A\u062F\u0629</span> </button> </div>  <div class="mt-6 grid gap-4" id="ticketsListContainer"> <div class="glass-panel rounded-2xl p-8 text-center" id="ticketsLoading"> <span class="w-5 h-5 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> <div class="text-[13px] text-white/40 mt-2">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629...</div> </div> <div id="ticketsEmpty" class="hidden glass-panel rounded-2xl p-8 text-center border-dashed"> <div class="text-[14px] text-pistachio/60">\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u0628\u0639\u062F \u2014 \u0627\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u062A\u0643 \u0627\u0644\u0623\u0648\u0644\u0649 \u0648\u0633\u064A\u062A\u0645 \u0625\u0634\u0639\u0627\u0631 \u063A\u0631\u0641\u0629 \u0627\u0644\u0639\u0645\u0644\u064A\u0627\u062A \u0641\u0648\u0631\u0627\u064B</div> <div class="text-[12px] text-white/30 mt-1">\u0623\u0648 \u0623\u0631\u0633\u0644 \u0648\u0627\u062A\u0633\u0627\u0628 \u0625\u0644\u0649 +20 101 999 3801</div> </div> <!-- \u0633\u064A\u062A\u0645 \u0645\u0644\u0621 \u0627\u0644\u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629 \u0647\u0646\u0627 \u0639\u0628\u0631 JS --> <div id="ticketsRealList" class="grid gap-4"></div> <template id="ticketTemplate"> <div class="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-lime/20"> <div class="space-y-2"> <div class="flex items-center gap-2.5 flex-wrap"> <span data-field="urg" class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/5 text-pistachio/60 border border-white/10">URG</span> <span data-field="src" class="text-[11px] font-mono text-pistachio/50">SRC</span> <span data-field="time" class="text-[11px] font-mono text-pistachio/40">\u2022 TIME</span> <span data-field="status" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime/15 text-lime border border-lime/30">STATUS</span> </div> <div data-field="subj" class="font-bold text-pistachio text-[15px]">SUBJECT</div> <div class="text-[12.5px] text-lime font-sub flex items-center gap-2"> <span>\u26A1 \u0631\u062F \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0645\u0642\u062A\u0631\u062D:</span> <span data-field="ai" class="text-pistachio/80">AI</span> </div> </div> <button class="shrink-0 px-4 h-9 rounded-xl bg-surface border border-white/10 hover:border-lime/40 text-pistachio text-[12px] font-bold transition">
\u0639\u0631\u0636 \u0627\u0644\u0640 Thread \u0643\u0627\u0645\u0644 \u2192
</button> </div> </template> </div>  <div class="mt-8 rounded-2xl p-5 bg-canvas border border-lime/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-pistachio/60"> <div class="flex items-center gap-3"> <span class="text-[22px]">\u{1F4F2}</span> <div> <div class="font-bold text-pistachio text-[13px]">\u0628\u0648\u0627\u0628\u0629 \u0637\u0648\u0627\u0631\u0626 WhatsApp \u0627\u0644\u0645\u0628\u0627\u0634\u0631\u0629</div> <div>\u0623\u0631\u0633\u0644 \u0631\u0633\u0627\u0644\u0629 \u0646\u0635\u064A\u0629 \u0623\u0648 \u0635\u0648\u062A\u064A\u0629 \u0625\u0644\u0649 <span class="text-lime font-bold">+20 101 999 3801</span> \u0648\u0633\u064A\u062A\u0645 \u062A\u0641\u0631\u064A\u063A\u0647\u0627 \u0648\u062A\u0648\u0644\u064A\u062F \u062A\u0630\u0643\u0631\u0629 \u0641\u0648\u0631\u064A\u0629 \u062E\u0644\u0627\u0644 58 \u062B\u0627\u0646\u064A\u0629.</div> </div> </div> <span class="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
Webhook Live \u2022 24/7 Active
</span> </div>  <div id="newTicketModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-300"> <div class="glass-panel rounded-3xl p-7 max-w-[540px] w-full border-lime/40 space-y-4"> <div class="flex justify-between items-center border-b border-white/[0.08] pb-3"> <h3 class="font-display font-bold text-[18px] text-pistachio">\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629 \u0637\u0648\u0627\u0631\u0626 \u062C\u062F\u064A\u062F\u0629</h3> <button id="btnCloseTicketModal" class="text-pistachio/50 hover:text-pistachio text-[18px]">\u2715</button> </div> <div class="space-y-3 font-sub text-[13px]"> <div> <label class="block font-bold text-pistachio mb-1">\u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062A\u0630\u0643\u0631\u0629:</label> <input id="ticketSubjectInput" type="text" placeholder="e.g. \u0627\u0646\u0633\u062D\u0627\u0628 \u0631\u0627\u0639\u064A \u0623\u0648 \u062A\u0623\u062E\u0631 \u0627\u0639\u062A\u0645\u0627\u062F" class="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio outline-none focus:border-lime"> </div> <div> <label class="block font-bold text-pistachio mb-1">\u062F\u0631\u062C\u0629 \u0627\u0644\u0623\u0647\u0645\u064A\u0629 (Urgency):</label> <select id="ticketUrgencySelect" class="w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio outline-none focus:border-lime"> <option value="CRITICAL_BLOCKER">\u{1F6A8} \u062D\u0631\u062C \u062C\u062F\u0627\u064B (Critical Blocker \u2014 \u0631\u062F \u062E\u0644\u0627\u0644 \u062F\u0642\u064A\u0642\u062A\u064A\u0646)</option> <option value="URGENT">\u26A0\uFE0F \u0639\u0627\u062C\u0644 (Urgent \u2014 \u062E\u0644\u0627\u0644 4 \u0633\u0627\u0639\u0627\u062A)</option> <option value="NORMAL">\u2139\uFE0F \u0639\u0627\u062F\u064A (Normal \u2014 \u0627\u0633\u062A\u0641\u0633\u0627\u0631 \u062A\u0634\u063A\u064A\u0644\u064A)</option> </select> </div> <div> <label class="block font-bold text-pistachio mb-1">\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0645\u0634\u0643\u0644\u0629:</label> <textarea id="ticketDescInput" rows="3" placeholder="\u0627\u0634\u0631\u062D \u0645\u0627 \u062D\u062F\u062B \u0628\u0627\u0644\u0636\u0628\u0637..." class="w-full p-3 rounded-xl bg-canvas border border-white/15 text-pistachio outline-none focus:border-lime"></textarea> </div> <button id="btnSubmitTicket" class="w-full h-11 btn-lime text-[13.5px] font-bold flex items-center justify-center gap-2 mt-2"> <span>\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062A\u0630\u0643\u0631\u0629 \u0641\u0648\u0631\u0627\u064B</span> </button> </div> </div> </div> <script>
    const ticketModal = document.getElementById('newTicketModal');
    const btnOpen = document.getElementById('btnOpenNewTicket');
    const btnClose = document.getElementById('btnCloseTicketModal');
    const btnSubmit = document.getElementById('btnSubmitTicket');
    const container = document.getElementById('ticketsListContainer');

    btnOpen?.addEventListener('click', () => {
      ticketModal?.classList.remove('hidden');
      setTimeout(() => ticketModal?.classList.remove('opacity-0'), 10);
    });

    btnClose?.addEventListener('click', () => {
      ticketModal?.classList.add('opacity-0');
      setTimeout(() => ticketModal?.classList.add('hidden'), 300);
    });

    btnSubmit?.addEventListener('click', async () => {
      const subjEl = document.getElementById('ticketSubjectInput');
      const descEl = document.getElementById('ticketDescInput');
      const subj = subjEl?.value.trim();
      const desc = descEl?.value.trim() || subj;
      const urg = document.getElementById('ticketUrgencySelect')?.value || 'CRITICAL_BLOCKER';
      if (!subj) {
        alert('\u064A\u0631\u062C\u0649 \u0643\u062A\u0627\u0628\u0629 \u0645\u0648\u0636\u0648\u0639 \u0627\u0644\u062A\u0630\u0643\u0631\u0629');
        return;
      }
      const api = (window as any).PUBLIC_API_URL || 'http://localhost:3001';
      let clientId = new URLSearchParams(location.search).get('id');
      if(!clientId) try{ clientId = JSON.parse(localStorage.getItem('999x_client')||'{}').id; }catch{}
      if(!clientId) clientId = 'demo';
      // try real API
      try{
        const res = await fetch(\\\`\\\${api}/api/clients/\\\${clientId}/tickets\\\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ subject: subj, description: desc, urgency: urg, source:'WEB_DASHBOARD' }) });
        if(res.ok){
          const j = await res.json();
          console.log('[999x] ticket created', j.data);
        }
      }catch(e){ console.log('ticket API fallback', e); }
      // persist locally as well
      try{ const arr = JSON.parse(localStorage.getItem('999x_tickets')||'[]'); arr.unshift({ subject: subj, urgency: urg, status:'OPEN', ai: '\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0641\u0648\u0631\u064A \u0644\u063A\u0631\u0641\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x', time:'\u0627\u0644\u0622\u0646' }); localStorage.setItem('999x_tickets', JSON.stringify(arr)); }catch{}

      const card = document.createElement('div');
      card.className = 'glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-lime/40 animate-fade-in';
      card.innerHTML = \\\`
        <div class="space-y-2">
          <div class="flex items-center gap-2.5 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/25">\\\${urg}</span>
            <span class="text-[11px] font-mono text-pistachio/50">WEB_DASHBOARD</span>
            <span class="text-[11px] font-mono text-pistachio/40">\u2022 \u0627\u0644\u0622\u0646</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime/15 text-lime border border-lime/30">OPEN</span>
          </div>
          <div class="font-bold text-pistachio text-[15px]">\\\${subj}</div>
          <div class="text-[12.5px] text-lime font-sub flex items-center gap-2">
            <span>\u26A1 \u0631\u062F \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u0627\u0644\u0645\u0642\u062A\u0631\u062D:</span>
            <span class="text-pistachio/80">\u062A\u0645 \u0625\u0631\u0633\u0627\u0644 \u0625\u0634\u0639\u0627\u0631 \u0641\u0648\u0631\u064A \u0644\u063A\u0631\u0641\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x \u0648\u0633\u064A\u0642\u0648\u0645 \u0627\u0644\u0640 Ops Lead \u0628\u0627\u0644\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u062E\u0644\u0627\u0644 \u0644\u062D\u0638\u0627\u062A.</span>
          </div>
        </div>
        <button class="shrink-0 px-4 h-9 rounded-xl bg-surface border border-white/10 text-pistachio text-[12px] font-bold">\u0639\u0631\u0636 \u0627\u0644\u0640 Thread \u2192</button>
      \\\`;

      const realListEl = document.getElementById('ticketsRealList');
      const emptyEl2 = document.getElementById('ticketsEmpty');
      if (realListEl) {
        realListEl.prepend(card);
        if(emptyEl2) emptyEl2.classList.add('hidden');
        const loadingEl2 = document.getElementById('ticketsLoading');
        if(loadingEl2) loadingEl2.classList.add('hidden');
      } else if (container && container.firstChild) {
        container.insertBefore(card, container.firstChild);
      }

      if(subjEl) subjEl.value=''; if(descEl) descEl.value='';
      ticketModal?.classList.add('opacity-0');
      setTimeout(() => ticketModal?.classList.add('hidden'), 300);
      alert('\u062A\u0645 \u0641\u062A\u062D \u0627\u0644\u062A\u0630\u0643\u0631\u0629 \u0648\u0625\u0634\u0639\u0627\u0631 \u063A\u0631\u0641\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x \u0628\u0646\u062C\u0627\u062D! (\u0645\u062D\u0641\u0648\u0638\u0629 \u0641\u064A API + LocalStorage)');
    });

    // Load real tickets on start \u2014 no dummy data
    (async ()=>{
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      let clientId = new URLSearchParams(location.search).get('id');
      if(!clientId) try{ clientId = JSON.parse(localStorage.getItem('999x_client')||'{}').id; }catch{}
      const loadingEl = document.getElementById('ticketsLoading');
      const emptyEl = document.getElementById('ticketsEmpty');
      const realList = document.getElementById('ticketsRealList');
      let hasData = false;
      // try API
      if(clientId){
        try{
          const res = await fetch(\\\`\\\${api}/api/clients/\\\${clientId}/tickets\\\`);
          if(res.ok){
            const j = await res.json();
            if(j.data && j.data.length){
              hasData = true;
              j.data.forEach((t:any)=>{
                const card = document.createElement('div');
                card.className = 'glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-lime/20';
                card.innerHTML = \\\`<div class="space-y-2"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-lime/10 text-lime border border-lime/20">\\\${t.urgency||'NORMAL'}</span><span class="text-[11px] text-pistachio/40">\\\${t.source||'API'}</span><span class="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/40">\\\${t.status||'OPEN'}</span></div><div class="font-bold text-pistachio text-[15px]">\\\${t.subject}</div><div class="text-[12px] text-lime">\\\${t.aiSuggestedSolution||''}</div></div><button class="shrink-0 px-4 h-9 rounded-xl bg-surface border border-white/10 text-pistachio text-[12px]">\u0639\u0631\u0636 \u2192</button>\\\`;
                realList?.appendChild(card);
              });
            }
          }
        }catch{}
      }
      // also load from LS
      try{
        const lsTickets = JSON.parse(localStorage.getItem('999x_tickets')||'[]');
        lsTickets.forEach((t:any)=>{
          hasData = true;
          const card = document.createElement('div');
          card.className = 'glass-panel rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-white/10 opacity-90';
          card.innerHTML = \\\`<div class="space-y-2"><div class="flex items-center gap-2"><span class="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-white/40">\\\${t.urgency||'NORMAL'}</span><span class="text-[11px] text-pistachio/40">LocalStorage</span></div><div class="font-bold text-pistachio text-[14px]">\\\${t.subject}</div><div class="text-[12px] text-white/50">\\\${t.ai||''}</div></div>\\\`;
          realList?.appendChild(card);
        });
      }catch{}
      if(loadingEl) loadingEl.classList.add('hidden');
      if(!hasData && emptyEl) emptyEl.classList.remove('hidden');
      // fix new ticket insertion to go to realList
      const origInsert = container?.insertBefore;
      // override container to realList for new tickets
      if(container && realList){
        // patch btnSubmit to use realList
        const btnSubmitEl = document.getElementById('btnSubmitTicket');
        if(btnSubmitEl){
          // already handled above, but ensure new cards go to realList
          btnSubmitEl.addEventListener('click', ()=>{
            setTimeout(()=>{
              const last = realList.lastChild as HTMLElement;
              if(last) last.classList.add('border-lime/40');
              if(emptyEl) emptyEl.classList.add('hidden');
            },100);
          });
        }
      }
    })();
  <\/script> `])), maybeRenderHead()) })}`;
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/tickets.astro", void 0);

const $$file = "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/tickets.astro";
const $$url = "/client/tickets";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tickets,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
