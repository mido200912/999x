import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_DCRK0Qyq.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_BKke6ubM.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function PromptStudio() {
  const [prompt, setPrompt] = useState(`You are the "999x Executive Operations Intelligence Engine" — elite strategist. Return VALID JSON ONLY. Tailor to category.`);
  const [model, setModel] = useState("minimax/minimax-m3:free");
  const [stream, setStream] = useState("");
  const [loading, setLoading] = useState(false);
  const test = async () => {
    setLoading(true);
    setStream("");
    const api = Object.assign(__vite_import_meta_env__, { OS: process.env.OS, PROMPT: process.env.PROMPT, PUBLIC: process.env.PUBLIC })?.PUBLIC_API_URL ?? "http://localhost:3001";
    try {
      const res = await fetch(`${api}/api/ai/generate-plan-stream`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId: "demo", problemType: "hierarchy", category: "STARTUP", modelEngine: model }) });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const d = line.slice(5).trim();
            if (d === "[DONE]") break;
            try {
              const j = JSON.parse(d);
              if (j.token) setStream((s) => s + j.token);
            } catch {
            }
          }
        }
        setLoading(false);
        try {
          const arr = JSON.parse(localStorage.getItem("999x_ai_studio") || "[]");
          arr.unshift({ model, prompt: prompt.slice(0, 60), ts: Date.now() });
          localStorage.setItem("999x_ai_studio", JSON.stringify(arr));
        } catch {
        }
        return;
      }
    } catch (e) {
      console.log("SSE fallback", e);
    }
    const mock = JSON.stringify({ title: "خطة HR — Test (Fallback)", executiveSummary: "ملخص تجريبي محلي — API غير متاح", milestones: [{ id: "m1", title: "RACI", model }], model }, null, 2);
    for (const ch of mock) {
      setStream((s) => s + ch);
      await new Promise((r) => setTimeout(r, 12));
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-2xl p-5 bg-canvas border border-white/10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "px-2 py-1 rounded-full bg-lime/15 text-lime border border-lime/20 font-mono text-[11px] font-bold", children: "SYSTEM PROMPT — HOT RELOAD" }),
        /* @__PURE__ */ jsx("select", { value: model, onChange: (e) => setModel(e.target.value), className: "ml-auto h-8 rounded-full px-2 bg-surface border border-white/10 text-[11px] text-pistachio", children: /* @__PURE__ */ jsx("option", { value: "minimax/minimax-m3:free", children: "Minimax M3 — FREE" }) })
      ] }),
      /* @__PURE__ */ jsx("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), className: "w-full mt-3 h-[160px] rounded-xl p-3 bg-surface border border-white/10 text-[12px] font-mono text-pistachio/80 outline-none focus:border-lime" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsx("button", { onClick: test, disabled: loading, className: "px-4 h-9 rounded-xl bg-lime text-canvas font-bold text-[12px] disabled:opacity-50", children: loading ? "Streaming..." : "اختبر Stream →" }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-mono text-white/30 self-center", children: [
          model,
          " • ",
          loading ? "42 tok/s" : "idle"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl p-4 bg-canvas border border-white/10", children: [
      /* @__PURE__ */ jsx("div", { className: "font-mono text-[11px] text-white/40", children: "OUTPUT (SSE)" }),
      /* @__PURE__ */ jsx("pre", { className: "mt-2 p-3 rounded-xl bg-surface border border-white/10 text-[11px] font-mono text-lime leading-5 whitespace-pre-wrap max-h-[220px] overflow-auto", children: stream || "— no output yet —" }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-2 rounded-xl bg-white/5 border border-white/10 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-white/40", children: "COST" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-emerald-400", children: "$0 (FREE)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-2 rounded-xl bg-white/5 border border-white/10 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-white/40", children: "LATENCY" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-lime", children: "1.8s" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-2 rounded-xl bg-white/5 border border-white/10 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-white/40", children: "CACHE" }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-emerald-400", children: "62% hit • 15ms" })
        ] })
      ] })
    ] })
  ] });
}

const $$AiStudio = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "AI Studio \u2014 999x", "role": "OPS_MEMBER" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="font-display font-bold text-[22px] text-pistachio">استوديو نماذج الذكاء الاصطناعي</h1> <p class="text-[13px] text-white/50">Minimax M3 Prompt Studio — Hot-Reload بدون إعادة نشر</p> <div class="mt-6"> ${renderComponent($$result2, "PromptStudio", PromptStudio, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Elmodather/Downloads/999x/apps/web/src/components/admin/PromptStudio.tsx", "client:component-export": "default" })} </div> <div class="mt-6 grid lg:grid-cols-3 gap-4"> <div class="rounded-2xl p-4 bg-canvas border border-lime/30"> <div class="font-mono font-bold text-pistachio text-[13px]">Minimax M3</div> <div class="text-[11px] text-white/50">كتابة خطط HR</div> <div class="flex justify-between mt-2 text-[11px] font-mono"><span class="text-white/40">$0 (FREE)</span><span class="text-lime">1.8s</span></div> </div> <div class="rounded-2xl p-4 bg-canvas border border-white/10"> <div class="font-mono font-bold text-pistachio text-[13px]">Minimax M3 — Fast</div> <div class="text-[11px] text-white/50">تلخيص سريع</div> <div class="flex justify-between mt-2 text-[11px] font-mono"><span class="text-white/40">$0 (FREE)</span><span class="text-lime">1.2s</span></div> </div> <div class="rounded-2xl p-4 bg-canvas border border-white/10"> <div class="font-mono font-bold text-pistachio text-[13px]">Minimax M3 — Reasoning</div> <div class="text-[11px] text-white/50">تفكير معقد</div> <div class="flex justify-between mt-2 text-[11px] font-mono"><span class="text-white/40">$0 (FREE)</span><span class="text-lime">1.8s</span></div> </div> </div> ` })}`;
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/ai-studio.astro", void 0);

const $$file = "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/ai-studio.astro";
const $$url = "/admin/ai-studio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiStudio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
