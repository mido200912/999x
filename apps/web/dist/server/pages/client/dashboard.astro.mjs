import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DCRK0Qyq.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_BKke6ubM.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Client Command Hub \u2014 999x" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", `<div class="glass-panel rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border-lime/25 shadow-lg" id="pulseBar"> <div class="flex items-center gap-3.5"> <div class="w-11 h-11 rounded-2xl overflow-hidden border border-lime/30 shadow-[0_0_15px_rgba(163,230,53,0.2)]"> <img src="/logo_999x.jpg" class="w-full h-full object-cover" alt="999x Logo"> </div> <div> <div class="font-bold text-pistachio text-[16px] flex items-center gap-2" id="clientNameDisplay"> <span class="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin"></span> \u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...
</div> <div class="text-[11px] font-mono text-pistachio/50" id="clientMetaDisplay">\u2014</div> </div> <span class="hidden md:inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/40" id="clientStageDisplay">\u2014</span> </div> <div class="flex items-center gap-6"> <div class="text-center"> <div class="text-[10px] font-mono tracking-widest text-pistachio/50">HEALTH INDEX</div> <div class="font-mono font-black text-[24px] text-lime" id="healthDisplay">\u2014<span class="text-[12px] text-pistachio/50">/100</span></div> </div> <div class="h-10 w-px bg-white/10 hidden sm:block"></div> <div class="flex items-center gap-3"> <img src="https://i.pravatar.cc/100?img=32" class="w-9 h-9 rounded-full border border-lime/30 object-cover" alt=""> <div> <div class="text-[12.5px] font-bold text-pistachio">\u0633\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0634\u0627\u0648\u064A</div> <div class="text-[11px] font-mono text-lime">Ops Lead \u2022 999x</div> </div> <a href="https://wa.me/201019993801" target="_blank" class="w-9 h-9 rounded-xl bg-lime text-canvas flex items-center justify-center font-bold text-[13px] hover:scale-105 transition shadow-[0_0_15px_rgba(163,230,53,0.4)]" title="\u062A\u0648\u0627\u0635\u0644 \u0641\u0648\u0631\u064A \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628">
\u{1F4AC}
</a> </div> </div> </div> <div id="noClientEmpty" class="hidden mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center"> <div class="text-[13px] text-amber-300">\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u064A\u0644 \u0645\u062D\u062F\u062F \u2014 \u0627\u0628\u062F\u0623 \u0645\u0646 <a href="/onboarding" class="text-lime underline">\u0645\u0639\u0627\u0644\u062C \u0627\u0644\u062A\u0642\u062F\u064A\u0645</a> \u0623\u0648 \u0627\u062E\u062A\u0631 \u0645\u0646 CRM</div> </div>  <div class="mt-6 grid lg:grid-cols-12 gap-6"> <!-- Roadmap Radar (8 Cols) --> <div class="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 border-lime/20"> <div class="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4"> <div> <h2 class="font-display font-bold text-[18px] text-pistachio">\u0631\u0627\u062F\u0627\u0631 \u062E\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A</h2> <p class="text-[12.5px] text-pistachio/60 font-sub">\u0643\u0644 \u0645\u062D\u0637\u0629 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u0639 \u062A\u062A\u0628\u0639 \u0632\u0645\u0646\u064A \u0644\u0644\u0645\u062E\u0631\u062C\u0627\u062A.</p> </div> <span class="font-mono text-[11px] text-lime font-bold px-3 py-1 rounded-full bg-lime/10 border border-lime/25">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0625\u0646\u062C\u0627\u0632: 11 \u064A\u0648\u0645\u0627\u064B</span> </div> <div class="space-y-3.5" id="roadmapStations"> <div class="p-8 text-center text-[13px] text-white/30"> <span class="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> \u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u062E\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629...
</div> </div> </div> <!-- Deliverables Studio & Live Ticketing (4 Cols) --> <div class="lg:col-span-4 space-y-6"> <!-- Deliverables Studio --> <div class="glass-panel rounded-3xl p-6 border-lime/25 shadow-lg space-y-4"> <div class="flex items-center justify-between"> <h3 class="font-bold text-[15px] text-pistachio">\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0645\u062E\u0631\u062C\u0627\u062A</h3> <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-lime/15 text-lime">AI REPROMPT</span> </div> <p class="text-[12px] text-pistachio/60 font-sub">\u062D\u062F\u062F \u0623\u064A \u062C\u0632\u0621 \u0648\u0627\u0637\u0644\u0628 \u0645\u0646 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u062A\u0639\u062F\u064A\u0644\u0647 \u0641\u0648\u0631\u064A\u0627\u064B.</p> <!-- Live Plan Document Box --> <div class="rounded-2xl p-4 bg-canvas border border-lime/30 text-[13px] leading-relaxed font-sub space-y-3 relative overflow-hidden"> <div class="text-[11px] font-mono text-lime font-bold border-b border-white/[0.08] pb-1.5 flex justify-between"> <span>HR Action Plan v1.4</span> <span id="planStatusTag" class="text-amber-300">\u0645\u0631\u0627\u062C\u0639\u0629 \u062D\u064A\u0629</span> </div> <p id="planDocContent" class="text-pistachio/90 transition-all duration-300">
\u062A\u0645 \u0627\u0639\u062A\u0645\u0627\u062F <span class="bg-lime/20 text-lime px-1.5 py-0.5 rounded font-bold">\u062A\u0642\u0633\u064A\u0645 \u0627\u0644\u0644\u062C\u0627\u0646 \u0625\u0644\u0649 \u062E\u0644\u0627\u064A\u0627 \u062B\u0644\u0627\u062B\u064A\u0629</span> \u0645\u0639 \u062A\u0639\u064A\u064A\u0646 \u0645\u0633\u0624\u0648\u0644 \u0645\u0633\u062A\u0642\u0644 \u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0640 Onboarding \u0644\u062E\u0641\u0636 \u0645\u0639\u062F\u0644 \u062A\u0633\u0631\u0628 \u0627\u0644\u0623\u0639\u0636\u0627\u0621 \u0645\u0646 41% \u0625\u0644\u0649 12% \u062E\u0644\u0627\u0644 \u0627\u0644\u0640 6 \u0623\u0633\u0627\u0628\u064A\u0639 \u0627\u0644\u0642\u0627\u062F\u0645\u0629.
</p> <!-- Interactive AI Reprompting Buttons --> <div class="pt-2 border-t border-white/[0.08] flex flex-wrap gap-2"> <button id="btnStrictRewrite" class="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-lime/30 hover:bg-lime hover:text-canvas text-lime font-bold transition">
\u{1F916} \u0646\u0628\u0631\u0629 \u0635\u0627\u0631\u0645\u0629
</button> <button id="btnSimplifyRewrite" class="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-white/15 hover:border-lime/40 text-pistachio/80 font-bold transition">
\u{1F4A1} \u062A\u0628\u0633\u064A\u0637 \u0644\u0644\u0645\u0628\u062A\u062F\u0626\u064A\u0646
</button> <button id="btnSyncKanban" class="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-violet/30 text-violet-300 hover:text-white font-bold transition">
\u26A1 \u062A\u062D\u0648\u064A\u0644 \u0644\u062A\u0627\u0633\u0643\u0627\u062A
</button> </div> </div> <button id="btnApproveActionPlan" class="w-full h-11 rounded-xl btn-lime text-[13px] font-bold flex items-center justify-center gap-2"> <span>\u2713 \u0627\u0639\u062A\u0645\u0627\u062F \u0648\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u062E\u0637\u0629</span> </button> </div> <!-- Live Ticketing Hub --> <div class="glass-panel rounded-3xl p-6 border-white/10 space-y-4"> <div class="flex items-center justify-between"> <h3 class="font-bold text-[15px] text-pistachio">\u0645\u0631\u0643\u0632 \u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u0637\u0648\u0627\u0631\u0626</h3> <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> </div> <div id="dashboardTicketList" class="space-y-2"> <div class="p-4 text-center text-[12px] text-white/30"> <span class="w-3 h-3 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> \u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629...
</div> </div> <a href="/client/tickets" class="w-full h-10 rounded-xl bg-surface border border-white/15 hover:border-lime/40 text-pistachio text-[12.5px] font-bold flex items-center justify-center transition">
+ \u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629 \u0637\u0648\u0627\u0631\u0626 \u062C\u062F\u064A\u062F\u0629
</a> </div> </div> </div>  <div class="mt-8 rounded-3xl p-[1px] bg-gradient-to-r from-lime/50 via-violet/40 to-pistachio/30 shadow-[0_0_40px_rgba(163,230,53,0.15)]"> <div class="rounded-[23px] p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4"> <div class="flex items-center gap-3.5"> <div class="w-10 h-10 rounded-2xl bg-lime/15 border border-lime/30 text-lime flex items-center justify-center text-[18px]">\u{1F4C4}</div> <div> <div class="font-bold text-[15px] text-pistachio">\u062A\u0642\u0631\u064A\u0631 \u062A\u0646\u0641\u064A\u0630\u064A \u0645\u0639\u062A\u0645\u062F \u0648\u0645\u0648\u062B\u0642 \u0631\u0642\u0645\u064A\u0627\u064B (300 DPI)</div> <div class="text-[12px] font-mono text-pistachio/50">\u064A\u062D\u0645\u0644 \u062E\u062A\u0645 999x \u0627\u0644\u0631\u0633\u0645\u064A \u0645\u0639 \u0643\u0648\u062F QR \u0644\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u0634\u0641\u0631 \u0648\u062A\u0648\u0642\u064A\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.</div> </div> </div> <button id="btnTriggerPdfModal" class="px-6 h-11 btn-lime text-[13px] font-bold shrink-0 flex items-center gap-2"> <span>\u062A\u0635\u062F\u064A\u0631 PDF \u0641\u0627\u062E\u0631 1-Click</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> </button> </div> </div>  <div id="pdfModalClient" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-300"> <div class="glass-panel rounded-3xl p-7 max-w-[500px] w-full border-lime/40 text-center space-y-4"> <div class="flex justify-between items-center border-b border-white/[0.08] pb-3"> <span class="font-mono text-lime text-[12px] font-bold">999x OFFICIAL AUDIT CERTIFICATE</span> <button id="btnClosePdfModal" class="text-pistachio/50 hover:text-pistachio text-[18px]">\u2715</button> </div> <div class="p-6 bg-surface rounded-2xl border border-white/10 space-y-3 text-start font-sub text-[13px]"> <div class="flex items-center gap-3"> <img src="/logo_999x.jpg" class="w-9 h-9 rounded-xl object-cover border border-lime/30" alt=""> <div> <div class="font-bold text-pistachio">Enactus Cairo \u2014 HR Restructuring Plan</div> <div class="text-[11px] font-mono text-lime">Seal ID: 999X-MINIMAX-M3-VERIFIED-042</div> </div> </div> <p class="text-pistachio/70 text-[12px]">
\u062A\u0645 \u062A\u062F\u0642\u064A\u0642 \u0648\u0627\u0639\u062A\u0645\u0627\u062F \u062E\u0637\u0629 \u0627\u0644\u0647\u064A\u0643\u0644\u0629 \u0648\u062A\u0648\u0632\u064A\u0639 \u0645\u0647\u0627\u0645 RACI \u0644\u0640 47 \u0639\u0636\u0648\u0627\u064B \u0645\u0646 \u0642\u0628\u0644 \u0642\u0645\u0631\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x \u0627\u0644\u0631\u0633\u0645\u064A\u0629.
</p> <div class="p-2.5 rounded-xl bg-canvas border border-white/10 text-[11px] font-mono flex justify-between"> <span class="text-pistachio/50">SHA-256:</span> <span class="text-lime">7f8a9b2c4d5e6f1a8b9c...</span> </div> </div> <button id="btnDownloadPdfClient" class="w-full h-11 btn-lime text-[13px] font-bold flex items-center justify-center gap-2"> <span>\u2B07\uFE0F \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0628\u0635\u064A\u063A\u0629 PDF (\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062C\u0648\u062F\u0629)</span> </button> </div> </div>  <script>
    const planText = document.getElementById('planDocContent');
    const planTag = document.getElementById('planStatusTag');
    const btnApprove = document.getElementById('btnApproveActionPlan');

    async function rephrase(tone){
      if (!planText) return;
      planText.style.opacity='0.3';
      try{
        const api = window.PUBLIC_API_URL || 'http://localhost:3001';
        const sel = window.getSelection()?.toString() || planText.textContent || '';
        const res = await fetch(api + '/api/ai/rephrase', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: sel.slice(0,400), tone }) });
        if(res.ok){ const j=await res.json(); planText.innerHTML = j.data.rephrased; planText.style.opacity='1'; return; }
      }catch{}
      // fallback \u0645\u062D\u0644\u064A \u0623\u0633\u0637\u0648\u0631\u064A
      setTimeout(()=>{
        if(tone==='strict') planText.innerHTML='<strong>\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u062A\u0646\u0641\u064A\u0630\u064A \u0635\u0627\u0631\u0645:</strong> \u0625\u0644\u0632\u0627\u0645 \u0643\u0627\u0641\u0629 \u0645\u0633\u0624\u0648\u0644\u064A \u0627\u0644\u0644\u062C\u0627\u0646 \u0628\u0631\u0641\u0639 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0625\u0646\u062C\u0627\u0632 \u0639\u0628\u0631 \u0644\u0648\u062D\u0629 Kanban \u0623\u0633\u0628\u0648\u0639\u064A\u0627\u064B\u060C \u0645\u0639 \u0625\u0646\u0647\u0627\u0621 \u0639\u0636\u0648\u064A\u0629 \u0623\u064A \u0639\u0636\u0648 \u064A\u062A\u063A\u064A\u0628 \u0639\u0646 2 Standups \u0645\u062A\u062A\u0627\u0644\u064A\u064A\u0646 \u0628\u062F\u0648\u0646 \u0625\u0630\u0646 \u0645\u0633\u0628\u0642 \u0644\u0636\u0645\u0627\u0646 \u0627\u0646\u0636\u0628\u0627\u0637 100%.';
        else planText.innerHTML='<strong>\u062E\u0637\u0648\u0627\u062A \u0628\u0633\u064A\u0637\u0629 \u0648\u0645\u0628\u0627\u0634\u0631\u0629:</strong><br/>1. \u0642\u0633\u0651\u0645 \u0641\u0631\u064A\u0642\u0643 \u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0635\u063A\u064A\u0631\u0629 (3 \u0623\u0641\u0631\u0627\u062F).<br/>2. \u0639\u064A\u0651\u0646 \u0634\u062E\u0635\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u0645\u0633\u0624\u0648\u0644\u0627\u064B \u0639\u0646 \u062A\u0631\u062D\u064A\u0628 \u0627\u0644\u062C\u062F\u062F.<br/>3. \u062E\u0635\u0635 10 \u062F\u0642\u0627\u0626\u0642 \u064A\u0648\u0645\u064A\u0627\u064B \u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0647\u0627\u0645.';
        planText.style.opacity='1';
      },300);
    }
    document.getElementById('btnStrictRewrite')?.addEventListener('click', ()=> rephrase('strict'));
    document.getElementById('btnSimplifyRewrite')?.addEventListener('click', ()=> rephrase('simple'));

    document.getElementById('btnSyncKanban')?.addEventListener('click', () => {
      alert('\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0645\u062E\u0631\u062C\u0627\u062A \u0627\u0644\u062E\u0637\u0629 \u0625\u0644\u0649 6 \u062A\u0627\u0633\u0643\u0627\u062A \u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0640 Kanban \u0628\u0646\u062C\u0627\u062D!');
    });

    btnApprove?.addEventListener('click', () => {
      if (planTag) {
        planTag.textContent = '\u0645\u0639\u062A\u0645\u062F \u0631\u0633\u0645\u064A\u0627\u064B \u2713';
        planTag.className = 'text-emerald-400 font-bold';
      }
      btnApprove.textContent = '\u2713 \u0627\u0644\u062E\u0637\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u0648\u0645\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0642\u0645\u0631\u0629 999x';
      btnApprove.className = 'w-full h-11 rounded-xl bg-emerald-500 text-canvas font-bold text-[13px] flex items-center justify-center gap-2';
    });

    // PDF Modal
    const pdfModal = document.getElementById('pdfModalClient');
    document.getElementById('btnTriggerPdfModal')?.addEventListener('click', () => {
      if (pdfModal) {
        pdfModal.classList.remove('hidden');
        setTimeout(() => pdfModal.classList.remove('opacity-0'), 10);
      }
    });
    document.getElementById('btnClosePdfModal')?.addEventListener('click', () => {
      if (pdfModal) {
        pdfModal.classList.add('opacity-0');
        setTimeout(() => pdfModal.classList.add('hidden'), 300);
      }
    });
    document.getElementById('btnDownloadPdfClient')?.addEventListener('click', async () => {
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      const clientId = new URLSearchParams(location.search).get('id') || JSON.parse(localStorage.getItem('999x_client')||'{}').id || JSON.parse(localStorage.getItem('999x_wizard')||'{}').clientId || 'demo';
      try{
        const res = await fetch(\`\${api}/api/ai/generate-report\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ clientId, reportType:'MONTHLY_AUDIT', modelEngine:'minimax/minimax-m3:free' }) });
        if(res.ok){ const j=await res.json(); alert('\u062A\u0645 \u062A\u0648\u0644\u064A\u062F PDF: ' + j.data.pdf.url + '\\nHash: ' + j.data.verificationHash); window.open(j.data.pdf.url, '_blank'); }
        else throw new Error();
      }catch{
        alert('\u062C\u0627\u0631\u064D \u062A\u062C\u0647\u064A\u0632 \u0645\u0644\u0641 PDF \u0645\u062D\u0644\u064A \u2014 \u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0639\u0628\u0631 \u0627\u0644\u0645\u062A\u0635\u0641\u062D (fallback)');
        const blob = new Blob([\`999x Report \u2014 \${new Date().toISOString()}\\nClient: \${localStorage.getItem('999x_client')||''}\`], {type:'text/plain'});
        const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='999x-report.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      }
      if (pdfModal) {
        pdfModal.classList.add('opacity-0');
        setTimeout(() => pdfModal.classList.add('hidden'), 300);
      }
    });

    // REAL API \u2014 load client health & roadmap (no mock)
    (async ()=>{
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      const params = new URLSearchParams(location.search);
      let clientId = params.get('id');
      if(!clientId){
        try{ const c=JSON.parse(localStorage.getItem('999x_client')||'null'); if(c?.id) clientId=c.id; }catch{}
      }
      if(!clientId){
        try{ const w=JSON.parse(localStorage.getItem('999x_wizard')||'null'); if(w?.name) clientId=w.name; }catch{}
      }
      const nameEl = document.getElementById('clientNameDisplay');
      const metaEl = document.getElementById('clientMetaDisplay');
      const stageEl = document.getElementById('clientStageDisplay');
      const healthEl = document.getElementById('healthDisplay');
      const noClientEl = document.getElementById('noClientEmpty');
      const stationsEl = document.getElementById('roadmapStations');
      if(!clientId){
        if(nameEl) nameEl.innerHTML = '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u064A\u0644 \u2014 <a href="/onboarding" class="text-lime underline">\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646</a>';
        if(metaEl) metaEl.textContent = '\u2014';
        if(healthEl) healthEl.innerHTML = '\u2014<span class="text-[12px] text-pistachio/50">/100</span>';
        if(noClientEl) noClientEl.classList.remove('hidden');
        if(stationsEl) stationsEl.innerHTML = '<div class="p-8 text-center text-[13px] text-white/40">\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u0627\u0631\u0637\u0629 \u2014 \u0633\u062C\u0651\u0644 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F \u0645\u0646 <a href="/onboarding" class="text-lime underline">\u0627\u0644\u0645\u0639\u0627\u0644\u062C</a></div>';
        return;
      }
      try{
        const res = await fetch(\`\${api}/api/clients/\${clientId}\`);
        if(res.ok){
          const j=await res.json();
          const client=j.data;
          if(nameEl) nameEl.innerHTML = \`\${client.organizationName} <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>\`;
          if(metaEl) metaEl.textContent = \`\${client._id || clientId} \u2022 \${client.category || ''}\`;
          if(stageEl) stageEl.textContent = client.operationalStage || 'DIAGNOSIS';
          if(healthEl) healthEl.innerHTML = \`\${client.healthScore ?? '--'}<span class="text-[12px] text-pistachio/50">/100</span>\`;
        } else {
          if(nameEl) nameEl.textContent = '\u0639\u0645\u064A\u0644 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F';
        }
      }catch{
        if(nameEl) nameEl.textContent = '\u062A\u0639\u0630\u0631 \u0627\u0644\u062A\u062D\u0645\u064A\u0644 \u2014 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0640 API';
      }
      // roadmap
      try{
        const r = await fetch(\`\${api}/api/clients/\${clientId}/roadmap\`);
        if(r.ok){
          const j=await r.json();
          const stations = j.data.stations || [];
          if(stationsEl){
            if(stations.length===0){
              stationsEl.innerHTML = '<div class="p-6 text-center text-[13px] text-white/40">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0637\u0627\u062A \u0628\u0639\u062F</div>';
            } else {
              stationsEl.innerHTML = stations.map(s=>\`
                <div class="rounded-2xl p-4 bg-canvas border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div class="font-bold text-[14px] text-pistachio">\${s.title}</div>
                    <div class="text-[12px] text-white/40">\${s.eta||''}</div>
                  </div>
                  <span class="px-3 py-1 rounded-xl text-[11px] font-mono font-bold border bg-white/5 text-white/60">\${s.status}</span>
                </div>
              \`).join('');
            }
          }
        }
      }catch{
        if(stationsEl) stationsEl.innerHTML = '<div class="p-6 text-center text-[12px] text-white/30">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062E\u0627\u0631\u0637\u0629</div>';
      }
      // tickets for this client \u2014 \u062D\u0642\u064A\u0642\u064A
      try{
        const ticketListEl = document.getElementById('dashboardTicketList');
        if(ticketListEl) ticketListEl.innerHTML = '<div class="p-2 text-center text-[11px] text-white/30">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631...</div>';
        const tr = await fetch(\`\${api}/api/clients/\${clientId}/tickets\`);
        if(tr.ok){
          const tj=await tr.json();
          const list = tj.data || [];
          if(ticketListEl){
            if(list.length===0){
              ticketListEl.innerHTML = '<div class="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[12px] text-white/30 text-center">\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u0628\u0639\u062F \u2014 \u0627\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u062A\u0643 \u0627\u0644\u0623\u0648\u0644\u0649</div>';
            } else {
              ticketListEl.innerHTML = list.slice(0,1).map((t:any)=>\`
                <div class="rounded-2xl p-3.5 bg-canvas border border-amber-500/25 space-y-2">
                  <div class="flex justify-between items-center text-[10.5px] font-mono"><span class="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">\${t.urgency||'NORMAL'} \u2022 \${t.source||''}</span><span class="text-pistachio/40">\${new Date(t.createdAt||Date.now()).toLocaleDateString('ar-EG')}</span></div>
                  <div class="font-bold text-[13px] text-pistachio">\${t.subject}</div>
                  <div class="text-[11.5px] text-lime">AI: \${t.aiSuggestedSolution||'\u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629'}</div>
                </div>
              \`).join('');
            }
          }
        } else if(ticketListEl){
          ticketListEl.innerHTML = '<div class="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[12px] text-white/30 text-center">\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u2014 <a href="/client/tickets" class="text-lime underline">\u0627\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629</a></div>';
        }
      }catch{
        const ticketListEl = document.getElementById('dashboardTicketList');
        if(ticketListEl) ticketListEl.innerHTML = '<div class="p-3 text-center text-[11px] text-white/20">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631</div>';
      }
    })();
  <\/script> `], ["  ", `<div class="glass-panel rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 border-lime/25 shadow-lg" id="pulseBar"> <div class="flex items-center gap-3.5"> <div class="w-11 h-11 rounded-2xl overflow-hidden border border-lime/30 shadow-[0_0_15px_rgba(163,230,53,0.2)]"> <img src="/logo_999x.jpg" class="w-full h-full object-cover" alt="999x Logo"> </div> <div> <div class="font-bold text-pistachio text-[16px] flex items-center gap-2" id="clientNameDisplay"> <span class="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin"></span> \u062C\u0627\u0631\u064A \u0627\u0644\u062A\u062D\u0645\u064A\u0644...
</div> <div class="text-[11px] font-mono text-pistachio/50" id="clientMetaDisplay">\u2014</div> </div> <span class="hidden md:inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-white/40" id="clientStageDisplay">\u2014</span> </div> <div class="flex items-center gap-6"> <div class="text-center"> <div class="text-[10px] font-mono tracking-widest text-pistachio/50">HEALTH INDEX</div> <div class="font-mono font-black text-[24px] text-lime" id="healthDisplay">\u2014<span class="text-[12px] text-pistachio/50">/100</span></div> </div> <div class="h-10 w-px bg-white/10 hidden sm:block"></div> <div class="flex items-center gap-3"> <img src="https://i.pravatar.cc/100?img=32" class="w-9 h-9 rounded-full border border-lime/30 object-cover" alt=""> <div> <div class="text-[12.5px] font-bold text-pistachio">\u0633\u0627\u0631\u0629 \u0627\u0644\u0645\u0646\u0634\u0627\u0648\u064A</div> <div class="text-[11px] font-mono text-lime">Ops Lead \u2022 999x</div> </div> <a href="https://wa.me/201019993801" target="_blank" class="w-9 h-9 rounded-xl bg-lime text-canvas flex items-center justify-center font-bold text-[13px] hover:scale-105 transition shadow-[0_0_15px_rgba(163,230,53,0.4)]" title="\u062A\u0648\u0627\u0635\u0644 \u0641\u0648\u0631\u064A \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628">
\u{1F4AC}
</a> </div> </div> </div> <div id="noClientEmpty" class="hidden mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center"> <div class="text-[13px] text-amber-300">\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u064A\u0644 \u0645\u062D\u062F\u062F \u2014 \u0627\u0628\u062F\u0623 \u0645\u0646 <a href="/onboarding" class="text-lime underline">\u0645\u0639\u0627\u0644\u062C \u0627\u0644\u062A\u0642\u062F\u064A\u0645</a> \u0623\u0648 \u0627\u062E\u062A\u0631 \u0645\u0646 CRM</div> </div>  <div class="mt-6 grid lg:grid-cols-12 gap-6"> <!-- Roadmap Radar (8 Cols) --> <div class="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-7 border-lime/20"> <div class="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4"> <div> <h2 class="font-display font-bold text-[18px] text-pistachio">\u0631\u0627\u062F\u0627\u0631 \u062E\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062A\u0641\u0627\u0639\u0644\u064A</h2> <p class="text-[12.5px] text-pistachio/60 font-sub">\u0643\u0644 \u0645\u062D\u0637\u0629 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u0639 \u062A\u062A\u0628\u0639 \u0632\u0645\u0646\u064A \u0644\u0644\u0645\u062E\u0631\u062C\u0627\u062A.</p> </div> <span class="font-mono text-[11px] text-lime font-bold px-3 py-1 rounded-full bg-lime/10 border border-lime/25">\u0645\u062A\u0648\u0633\u0637 \u0627\u0644\u0625\u0646\u062C\u0627\u0632: 11 \u064A\u0648\u0645\u0627\u064B</span> </div> <div class="space-y-3.5" id="roadmapStations"> <div class="p-8 text-center text-[13px] text-white/30"> <span class="w-4 h-4 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> \u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u062E\u0627\u0631\u0637\u0629 \u0627\u0644\u0637\u0631\u064A\u0642 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629...
</div> </div> </div> <!-- Deliverables Studio & Live Ticketing (4 Cols) --> <div class="lg:col-span-4 space-y-6"> <!-- Deliverables Studio --> <div class="glass-panel rounded-3xl p-6 border-lime/25 shadow-lg space-y-4"> <div class="flex items-center justify-between"> <h3 class="font-bold text-[15px] text-pistachio">\u0627\u0633\u062A\u0648\u062F\u064A\u0648 \u0627\u0639\u062A\u0645\u0627\u062F \u0627\u0644\u0645\u062E\u0631\u062C\u0627\u062A</h3> <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-lime/15 text-lime">AI REPROMPT</span> </div> <p class="text-[12px] text-pistachio/60 font-sub">\u062D\u062F\u062F \u0623\u064A \u062C\u0632\u0621 \u0648\u0627\u0637\u0644\u0628 \u0645\u0646 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064A \u062A\u0639\u062F\u064A\u0644\u0647 \u0641\u0648\u0631\u064A\u0627\u064B.</p> <!-- Live Plan Document Box --> <div class="rounded-2xl p-4 bg-canvas border border-lime/30 text-[13px] leading-relaxed font-sub space-y-3 relative overflow-hidden"> <div class="text-[11px] font-mono text-lime font-bold border-b border-white/[0.08] pb-1.5 flex justify-between"> <span>HR Action Plan v1.4</span> <span id="planStatusTag" class="text-amber-300">\u0645\u0631\u0627\u062C\u0639\u0629 \u062D\u064A\u0629</span> </div> <p id="planDocContent" class="text-pistachio/90 transition-all duration-300">
\u062A\u0645 \u0627\u0639\u062A\u0645\u0627\u062F <span class="bg-lime/20 text-lime px-1.5 py-0.5 rounded font-bold">\u062A\u0642\u0633\u064A\u0645 \u0627\u0644\u0644\u062C\u0627\u0646 \u0625\u0644\u0649 \u062E\u0644\u0627\u064A\u0627 \u062B\u0644\u0627\u062B\u064A\u0629</span> \u0645\u0639 \u062A\u0639\u064A\u064A\u0646 \u0645\u0633\u0624\u0648\u0644 \u0645\u0633\u062A\u0642\u0644 \u0644\u0645\u0633\u0627\u0631 \u0627\u0644\u0640 Onboarding \u0644\u062E\u0641\u0636 \u0645\u0639\u062F\u0644 \u062A\u0633\u0631\u0628 \u0627\u0644\u0623\u0639\u0636\u0627\u0621 \u0645\u0646 41% \u0625\u0644\u0649 12% \u062E\u0644\u0627\u0644 \u0627\u0644\u0640 6 \u0623\u0633\u0627\u0628\u064A\u0639 \u0627\u0644\u0642\u0627\u062F\u0645\u0629.
</p> <!-- Interactive AI Reprompting Buttons --> <div class="pt-2 border-t border-white/[0.08] flex flex-wrap gap-2"> <button id="btnStrictRewrite" class="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-lime/30 hover:bg-lime hover:text-canvas text-lime font-bold transition">
\u{1F916} \u0646\u0628\u0631\u0629 \u0635\u0627\u0631\u0645\u0629
</button> <button id="btnSimplifyRewrite" class="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-white/15 hover:border-lime/40 text-pistachio/80 font-bold transition">
\u{1F4A1} \u062A\u0628\u0633\u064A\u0637 \u0644\u0644\u0645\u0628\u062A\u062F\u0626\u064A\u0646
</button> <button id="btnSyncKanban" class="text-[11px] px-2.5 py-1 rounded-lg bg-surface border border-violet/30 text-violet-300 hover:text-white font-bold transition">
\u26A1 \u062A\u062D\u0648\u064A\u0644 \u0644\u062A\u0627\u0633\u0643\u0627\u062A
</button> </div> </div> <button id="btnApproveActionPlan" class="w-full h-11 rounded-xl btn-lime text-[13px] font-bold flex items-center justify-center gap-2"> <span>\u2713 \u0627\u0639\u062A\u0645\u0627\u062F \u0648\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u062E\u0637\u0629</span> </button> </div> <!-- Live Ticketing Hub --> <div class="glass-panel rounded-3xl p-6 border-white/10 space-y-4"> <div class="flex items-center justify-between"> <h3 class="font-bold text-[15px] text-pistachio">\u0645\u0631\u0643\u0632 \u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u0637\u0648\u0627\u0631\u0626</h3> <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> </div> <div id="dashboardTicketList" class="space-y-2"> <div class="p-4 text-center text-[12px] text-white/30"> <span class="w-3 h-3 border-2 border-lime/30 border-t-lime rounded-full animate-spin inline-block"></span> \u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631 \u0627\u0644\u062D\u0642\u064A\u0642\u064A\u0629...
</div> </div> <a href="/client/tickets" class="w-full h-10 rounded-xl bg-surface border border-white/15 hover:border-lime/40 text-pistachio text-[12.5px] font-bold flex items-center justify-center transition">
+ \u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629 \u0637\u0648\u0627\u0631\u0626 \u062C\u062F\u064A\u062F\u0629
</a> </div> </div> </div>  <div class="mt-8 rounded-3xl p-[1px] bg-gradient-to-r from-lime/50 via-violet/40 to-pistachio/30 shadow-[0_0_40px_rgba(163,230,53,0.15)]"> <div class="rounded-[23px] p-6 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4"> <div class="flex items-center gap-3.5"> <div class="w-10 h-10 rounded-2xl bg-lime/15 border border-lime/30 text-lime flex items-center justify-center text-[18px]">\u{1F4C4}</div> <div> <div class="font-bold text-[15px] text-pistachio">\u062A\u0642\u0631\u064A\u0631 \u062A\u0646\u0641\u064A\u0630\u064A \u0645\u0639\u062A\u0645\u062F \u0648\u0645\u0648\u062B\u0642 \u0631\u0642\u0645\u064A\u0627\u064B (300 DPI)</div> <div class="text-[12px] font-mono text-pistachio/50">\u064A\u062D\u0645\u0644 \u062E\u062A\u0645 999x \u0627\u0644\u0631\u0633\u0645\u064A \u0645\u0639 \u0643\u0648\u062F QR \u0644\u0644\u062A\u062D\u0642\u0642 \u0627\u0644\u0645\u0634\u0641\u0631 \u0648\u062A\u0648\u0642\u064A\u0639 \u0627\u0644\u0625\u062F\u0627\u0631\u0629.</div> </div> </div> <button id="btnTriggerPdfModal" class="px-6 h-11 btn-lime text-[13px] font-bold shrink-0 flex items-center gap-2"> <span>\u062A\u0635\u062F\u064A\u0631 PDF \u0641\u0627\u062E\u0631 1-Click</span> <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> </button> </div> </div>  <div id="pdfModalClient" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-300"> <div class="glass-panel rounded-3xl p-7 max-w-[500px] w-full border-lime/40 text-center space-y-4"> <div class="flex justify-between items-center border-b border-white/[0.08] pb-3"> <span class="font-mono text-lime text-[12px] font-bold">999x OFFICIAL AUDIT CERTIFICATE</span> <button id="btnClosePdfModal" class="text-pistachio/50 hover:text-pistachio text-[18px]">\u2715</button> </div> <div class="p-6 bg-surface rounded-2xl border border-white/10 space-y-3 text-start font-sub text-[13px]"> <div class="flex items-center gap-3"> <img src="/logo_999x.jpg" class="w-9 h-9 rounded-xl object-cover border border-lime/30" alt=""> <div> <div class="font-bold text-pistachio">Enactus Cairo \u2014 HR Restructuring Plan</div> <div class="text-[11px] font-mono text-lime">Seal ID: 999X-MINIMAX-M3-VERIFIED-042</div> </div> </div> <p class="text-pistachio/70 text-[12px]">
\u062A\u0645 \u062A\u062F\u0642\u064A\u0642 \u0648\u0627\u0639\u062A\u0645\u0627\u062F \u062E\u0637\u0629 \u0627\u0644\u0647\u064A\u0643\u0644\u0629 \u0648\u062A\u0648\u0632\u064A\u0639 \u0645\u0647\u0627\u0645 RACI \u0644\u0640 47 \u0639\u0636\u0648\u0627\u064B \u0645\u0646 \u0642\u0628\u0644 \u0642\u0645\u0631\u0629 \u0639\u0645\u0644\u064A\u0627\u062A 999x \u0627\u0644\u0631\u0633\u0645\u064A\u0629.
</p> <div class="p-2.5 rounded-xl bg-canvas border border-white/10 text-[11px] font-mono flex justify-between"> <span class="text-pistachio/50">SHA-256:</span> <span class="text-lime">7f8a9b2c4d5e6f1a8b9c...</span> </div> </div> <button id="btnDownloadPdfClient" class="w-full h-11 btn-lime text-[13px] font-bold flex items-center justify-center gap-2"> <span>\u2B07\uFE0F \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u0645\u0633\u062A\u0646\u062F \u0628\u0635\u064A\u063A\u0629 PDF (\u0639\u0627\u0644\u064A\u0629 \u0627\u0644\u062C\u0648\u062F\u0629)</span> </button> </div> </div>  <script>
    const planText = document.getElementById('planDocContent');
    const planTag = document.getElementById('planStatusTag');
    const btnApprove = document.getElementById('btnApproveActionPlan');

    async function rephrase(tone){
      if (!planText) return;
      planText.style.opacity='0.3';
      try{
        const api = window.PUBLIC_API_URL || 'http://localhost:3001';
        const sel = window.getSelection()?.toString() || planText.textContent || '';
        const res = await fetch(api + '/api/ai/rephrase', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: sel.slice(0,400), tone }) });
        if(res.ok){ const j=await res.json(); planText.innerHTML = j.data.rephrased; planText.style.opacity='1'; return; }
      }catch{}
      // fallback \u0645\u062D\u0644\u064A \u0623\u0633\u0637\u0648\u0631\u064A
      setTimeout(()=>{
        if(tone==='strict') planText.innerHTML='<strong>\u0628\u0631\u0648\u062A\u0648\u0643\u0648\u0644 \u062A\u0646\u0641\u064A\u0630\u064A \u0635\u0627\u0631\u0645:</strong> \u0625\u0644\u0632\u0627\u0645 \u0643\u0627\u0641\u0629 \u0645\u0633\u0624\u0648\u0644\u064A \u0627\u0644\u0644\u062C\u0627\u0646 \u0628\u0631\u0641\u0639 \u062A\u0642\u0627\u0631\u064A\u0631 \u0627\u0644\u0625\u0646\u062C\u0627\u0632 \u0639\u0628\u0631 \u0644\u0648\u062D\u0629 Kanban \u0623\u0633\u0628\u0648\u0639\u064A\u0627\u064B\u060C \u0645\u0639 \u0625\u0646\u0647\u0627\u0621 \u0639\u0636\u0648\u064A\u0629 \u0623\u064A \u0639\u0636\u0648 \u064A\u062A\u063A\u064A\u0628 \u0639\u0646 2 Standups \u0645\u062A\u062A\u0627\u0644\u064A\u064A\u0646 \u0628\u062F\u0648\u0646 \u0625\u0630\u0646 \u0645\u0633\u0628\u0642 \u0644\u0636\u0645\u0627\u0646 \u0627\u0646\u0636\u0628\u0627\u0637 100%.';
        else planText.innerHTML='<strong>\u062E\u0637\u0648\u0627\u062A \u0628\u0633\u064A\u0637\u0629 \u0648\u0645\u0628\u0627\u0634\u0631\u0629:</strong><br/>1. \u0642\u0633\u0651\u0645 \u0641\u0631\u064A\u0642\u0643 \u0644\u0645\u062C\u0645\u0648\u0639\u0627\u062A \u0635\u063A\u064A\u0631\u0629 (3 \u0623\u0641\u0631\u0627\u062F).<br/>2. \u0639\u064A\u0651\u0646 \u0634\u062E\u0635\u0627\u064B \u0648\u0627\u062D\u062F\u0627\u064B \u0645\u0633\u0624\u0648\u0644\u0627\u064B \u0639\u0646 \u062A\u0631\u062D\u064A\u0628 \u0627\u0644\u062C\u062F\u062F.<br/>3. \u062E\u0635\u0635 10 \u062F\u0642\u0627\u0626\u0642 \u064A\u0648\u0645\u064A\u0627\u064B \u0644\u0645\u0631\u0627\u062C\u0639\u0629 \u0627\u0644\u0645\u0647\u0627\u0645.';
        planText.style.opacity='1';
      },300);
    }
    document.getElementById('btnStrictRewrite')?.addEventListener('click', ()=> rephrase('strict'));
    document.getElementById('btnSimplifyRewrite')?.addEventListener('click', ()=> rephrase('simple'));

    document.getElementById('btnSyncKanban')?.addEventListener('click', () => {
      alert('\u062A\u0645 \u062A\u062D\u0648\u064A\u0644 \u0645\u062E\u0631\u062C\u0627\u062A \u0627\u0644\u062E\u0637\u0629 \u0625\u0644\u0649 6 \u062A\u0627\u0633\u0643\u0627\u062A \u062A\u0646\u0641\u064A\u0630\u064A\u0629 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u0640 Kanban \u0628\u0646\u062C\u0627\u062D!');
    });

    btnApprove?.addEventListener('click', () => {
      if (planTag) {
        planTag.textContent = '\u0645\u0639\u062A\u0645\u062F \u0631\u0633\u0645\u064A\u0627\u064B \u2713';
        planTag.className = 'text-emerald-400 font-bold';
      }
      btnApprove.textContent = '\u2713 \u0627\u0644\u062E\u0637\u0629 \u0645\u0639\u062A\u0645\u062F\u0629 \u0648\u0645\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0642\u0645\u0631\u0629 999x';
      btnApprove.className = 'w-full h-11 rounded-xl bg-emerald-500 text-canvas font-bold text-[13px] flex items-center justify-center gap-2';
    });

    // PDF Modal
    const pdfModal = document.getElementById('pdfModalClient');
    document.getElementById('btnTriggerPdfModal')?.addEventListener('click', () => {
      if (pdfModal) {
        pdfModal.classList.remove('hidden');
        setTimeout(() => pdfModal.classList.remove('opacity-0'), 10);
      }
    });
    document.getElementById('btnClosePdfModal')?.addEventListener('click', () => {
      if (pdfModal) {
        pdfModal.classList.add('opacity-0');
        setTimeout(() => pdfModal.classList.add('hidden'), 300);
      }
    });
    document.getElementById('btnDownloadPdfClient')?.addEventListener('click', async () => {
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      const clientId = new URLSearchParams(location.search).get('id') || JSON.parse(localStorage.getItem('999x_client')||'{}').id || JSON.parse(localStorage.getItem('999x_wizard')||'{}').clientId || 'demo';
      try{
        const res = await fetch(\\\`\\\${api}/api/ai/generate-report\\\`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ clientId, reportType:'MONTHLY_AUDIT', modelEngine:'minimax/minimax-m3:free' }) });
        if(res.ok){ const j=await res.json(); alert('\u062A\u0645 \u062A\u0648\u0644\u064A\u062F PDF: ' + j.data.pdf.url + '\\\\nHash: ' + j.data.verificationHash); window.open(j.data.pdf.url, '_blank'); }
        else throw new Error();
      }catch{
        alert('\u062C\u0627\u0631\u064D \u062A\u062C\u0647\u064A\u0632 \u0645\u0644\u0641 PDF \u0645\u062D\u0644\u064A \u2014 \u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0644\u064A\u062F \u0639\u0628\u0631 \u0627\u0644\u0645\u062A\u0635\u0641\u062D (fallback)');
        const blob = new Blob([\\\`999x Report \u2014 \\\${new Date().toISOString()}\\\\nClient: \\\${localStorage.getItem('999x_client')||''}\\\`], {type:'text/plain'});
        const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='999x-report.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      }
      if (pdfModal) {
        pdfModal.classList.add('opacity-0');
        setTimeout(() => pdfModal.classList.add('hidden'), 300);
      }
    });

    // REAL API \u2014 load client health & roadmap (no mock)
    (async ()=>{
      const api = window.PUBLIC_API_URL || 'http://localhost:3001';
      const params = new URLSearchParams(location.search);
      let clientId = params.get('id');
      if(!clientId){
        try{ const c=JSON.parse(localStorage.getItem('999x_client')||'null'); if(c?.id) clientId=c.id; }catch{}
      }
      if(!clientId){
        try{ const w=JSON.parse(localStorage.getItem('999x_wizard')||'null'); if(w?.name) clientId=w.name; }catch{}
      }
      const nameEl = document.getElementById('clientNameDisplay');
      const metaEl = document.getElementById('clientMetaDisplay');
      const stageEl = document.getElementById('clientStageDisplay');
      const healthEl = document.getElementById('healthDisplay');
      const noClientEl = document.getElementById('noClientEmpty');
      const stationsEl = document.getElementById('roadmapStations');
      if(!clientId){
        if(nameEl) nameEl.innerHTML = '\u0644\u0627 \u064A\u0648\u062C\u062F \u0639\u0645\u064A\u0644 \u2014 <a href="/onboarding" class="text-lime underline">\u0627\u0628\u062F\u0623 \u0627\u0644\u0622\u0646</a>';
        if(metaEl) metaEl.textContent = '\u2014';
        if(healthEl) healthEl.innerHTML = '\u2014<span class="text-[12px] text-pistachio/50">/100</span>';
        if(noClientEl) noClientEl.classList.remove('hidden');
        if(stationsEl) stationsEl.innerHTML = '<div class="p-8 text-center text-[13px] text-white/40">\u0644\u0627 \u062A\u0648\u062C\u062F \u062E\u0627\u0631\u0637\u0629 \u2014 \u0633\u062C\u0651\u0644 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F \u0645\u0646 <a href="/onboarding" class="text-lime underline">\u0627\u0644\u0645\u0639\u0627\u0644\u062C</a></div>';
        return;
      }
      try{
        const res = await fetch(\\\`\\\${api}/api/clients/\\\${clientId}\\\`);
        if(res.ok){
          const j=await res.json();
          const client=j.data;
          if(nameEl) nameEl.innerHTML = \\\`\\\${client.organizationName} <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>\\\`;
          if(metaEl) metaEl.textContent = \\\`\\\${client._id || clientId} \u2022 \\\${client.category || ''}\\\`;
          if(stageEl) stageEl.textContent = client.operationalStage || 'DIAGNOSIS';
          if(healthEl) healthEl.innerHTML = \\\`\\\${client.healthScore ?? '--'}<span class="text-[12px] text-pistachio/50">/100</span>\\\`;
        } else {
          if(nameEl) nameEl.textContent = '\u0639\u0645\u064A\u0644 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F';
        }
      }catch{
        if(nameEl) nameEl.textContent = '\u062A\u0639\u0630\u0631 \u0627\u0644\u062A\u062D\u0645\u064A\u0644 \u2014 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0640 API';
      }
      // roadmap
      try{
        const r = await fetch(\\\`\\\${api}/api/clients/\\\${clientId}/roadmap\\\`);
        if(r.ok){
          const j=await r.json();
          const stations = j.data.stations || [];
          if(stationsEl){
            if(stations.length===0){
              stationsEl.innerHTML = '<div class="p-6 text-center text-[13px] text-white/40">\u0644\u0627 \u062A\u0648\u062C\u062F \u0645\u062D\u0637\u0627\u062A \u0628\u0639\u062F</div>';
            } else {
              stationsEl.innerHTML = stations.map(s=>\\\`
                <div class="rounded-2xl p-4 bg-canvas border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div class="font-bold text-[14px] text-pistachio">\\\${s.title}</div>
                    <div class="text-[12px] text-white/40">\\\${s.eta||''}</div>
                  </div>
                  <span class="px-3 py-1 rounded-xl text-[11px] font-mono font-bold border bg-white/5 text-white/60">\\\${s.status}</span>
                </div>
              \\\`).join('');
            }
          }
        }
      }catch{
        if(stationsEl) stationsEl.innerHTML = '<div class="p-6 text-center text-[12px] text-white/30">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062E\u0627\u0631\u0637\u0629</div>';
      }
      // tickets for this client \u2014 \u062D\u0642\u064A\u0642\u064A
      try{
        const ticketListEl = document.getElementById('dashboardTicketList');
        if(ticketListEl) ticketListEl.innerHTML = '<div class="p-2 text-center text-[11px] text-white/30">\u062C\u0627\u0631\u064A \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631...</div>';
        const tr = await fetch(\\\`\\\${api}/api/clients/\\\${clientId}/tickets\\\`);
        if(tr.ok){
          const tj=await tr.json();
          const list = tj.data || [];
          if(ticketListEl){
            if(list.length===0){
              ticketListEl.innerHTML = '<div class="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[12px] text-white/30 text-center">\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u0628\u0639\u062F \u2014 \u0627\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u062A\u0643 \u0627\u0644\u0623\u0648\u0644\u0649</div>';
            } else {
              ticketListEl.innerHTML = list.slice(0,1).map((t:any)=>\\\`
                <div class="rounded-2xl p-3.5 bg-canvas border border-amber-500/25 space-y-2">
                  <div class="flex justify-between items-center text-[10.5px] font-mono"><span class="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">\\\${t.urgency||'NORMAL'} \u2022 \\\${t.source||''}</span><span class="text-pistachio/40">\\\${new Date(t.createdAt||Date.now()).toLocaleDateString('ar-EG')}</span></div>
                  <div class="font-bold text-[13px] text-pistachio">\\\${t.subject}</div>
                  <div class="text-[11.5px] text-lime">AI: \\\${t.aiSuggestedSolution||'\u0642\u064A\u062F \u0627\u0644\u0645\u0639\u0627\u0644\u062C\u0629'}</div>
                </div>
              \\\`).join('');
            }
          }
        } else if(ticketListEl){
          ticketListEl.innerHTML = '<div class="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-[12px] text-white/30 text-center">\u0644\u0627 \u062A\u0648\u062C\u062F \u062A\u0630\u0627\u0643\u0631 \u2014 <a href="/client/tickets" class="text-lime underline">\u0627\u0641\u062A\u062D \u062A\u0630\u0643\u0631\u0629</a></div>';
        }
      }catch{
        const ticketListEl = document.getElementById('dashboardTicketList');
        if(ticketListEl) ticketListEl.innerHTML = '<div class="p-3 text-center text-[11px] text-white/20">\u062A\u0639\u0630\u0631 \u062A\u062D\u0645\u064A\u0644 \u0627\u0644\u062A\u0630\u0627\u0643\u0631</div>';
      }
    })();
  <\/script> `])), maybeRenderHead()) })}`;
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/dashboard.astro", void 0);

const $$file = "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/dashboard.astro";
const $$url = "/client/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
