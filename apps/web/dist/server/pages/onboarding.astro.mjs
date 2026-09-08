import { c as createComponent, d as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_DCRK0Qyq.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQSybyu5.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function IntakeWizard() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("STARTUP");
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [branchData, setBranchData] = useState({
    teamSize: "25-50",
    primaryFriction: "churn",
    specificGoal: "هيكلة RACI وتخفيض التسرب",
    budgetOrAttendees: "$50K - $150K"
  });
  const progress = (step - 1) / 3 * 100;
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map((f) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const handleStartGeneration = async () => {
    setIsGenerating(true);
    try {
      const api = Object.assign(__vite_import_meta_env__, { OS: process.env.OS, PUBLIC: process.env.PUBLIC })?.PUBLIC_API_URL ?? "http://localhost:3001";
      const reg = await fetch(`${api}/api/clients/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationName: orgName || "Demo Team", category, primaryContact: { name: contactName || "Demo Lead", email: `${(orgName || "demo").replace(/\s+/g, "").toLowerCase()}@team.com`, phone: phone || "+201000000000" } })
      });
      let clientId = "";
      if (reg.ok) {
        const j = await reg.json();
        clientId = j.data?.id ?? "";
        if (clientId) localStorage.setItem("999x_clientId", clientId);
      }
      await fetch(`${api}/api/ai/diagnose-pulse`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category, pains: [branchData.primaryFriction], teamSize: 25 }) }).catch(() => {
      });
      await new Promise((r) => setTimeout(r, 900));
    } catch {
    }
    setIsGenerating(false);
    setGenerationDone(true);
  };
  return /* @__PURE__ */ jsxs("div", { className: "glass-panel rounded-3xl p-6 sm:p-9 border-lime/30 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6 text-[12px] font-mono", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-lime animate-pulse shadow-[0_0_10px_#A3E635]" }),
        /* @__PURE__ */ jsx("span", { className: "text-lime font-bold", children: "999x COCKPIT WIZARD" }),
        /* @__PURE__ */ jsx("span", { className: "text-pistachio/40 hidden sm:inline", children: "• Multi-Tenant Isolation" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-pistachio", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          "المرحلة ",
          step,
          " من 4"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "px-2 py-0.5 rounded-full bg-lime/15 text-lime text-[11px] font-mono", children: category })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-1.5 rounded-full bg-white/10 overflow-hidden mb-8", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full bg-gradient-to-r from-lime via-emerald-400 to-lime transition-all duration-500 shadow-[0_0_12px_rgba(163,230,53,0.8)]",
        style: { width: `${Math.max(10, progress)}%` }
      }
    ) }),
    step === 1 && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display font-bold text-[22px] text-pistachio", children: "ما هو تصنيف منظمتك؟" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-pistachio/70 font-sub mt-1", children: "يُكيّف المعالج خوارزميات التشخيص ونماذج الذكاء الاصطناعي بناءً على طبيعة فريقك (Startup / Volunteer / Event)." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setCategory("STARTUP");
              setBranchData({ ...branchData, specificGoal: "استقرار التوظيف وفترات التجربة والـ PR للتمويل", budgetOrAttendees: "Seed / Series A" });
            },
            className: `p-5 rounded-2xl border text-start transition relative overflow-hidden group ${category === "STARTUP" ? "bg-surface border-lime shadow-[0_0_25px_rgba(163,230,53,0.2)]" : "bg-canvas border-white/10 hover:border-lime/40"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-[24px] mb-2", children: "🚀" }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-[15px] text-pistachio", children: "شركة ناشئة (Startup)" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-pistachio/60 font-sub mt-1", children: "تركيز على استقرار التوظيف، فترات التجربة، بطاقات الوظائف، والـ PR لجولات التمويل." }),
              category === "STARTUP" && /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 text-lime font-mono text-[12px] font-bold", children: "✓ نشط" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setCategory("VOLUNTEER_TEAM");
              setBranchData({ ...branchData, specificGoal: "الحفاظ على الشغف وتقليل انسحاب الأعضاء بنسبة 65%", budgetOrAttendees: "40-100 عضو" });
            },
            className: `p-5 rounded-2xl border text-start transition relative overflow-hidden group ${category === "VOLUNTEER_TEAM" ? "bg-surface border-lime shadow-[0_0_25px_rgba(163,230,53,0.2)]" : "bg-canvas border-white/10 hover:border-lime/40"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-[24px] mb-2", children: "🤝" }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-[15px] text-pistachio", children: "تيم تطوعي أو طلابي" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-pistachio/60 font-sub mt-1", children: "تركيز على تقليل انسحاب الأعضاء (Churn)، الهيكل اللامركزي، والرعايات العينية والتجارية." }),
              category === "VOLUNTEER_TEAM" && /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 text-lime font-mono text-[12px] font-bold", children: "✓ نشط" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setCategory("EVENT");
              setBranchData({ ...branchData, specificGoal: "إغلاق رعاة المؤتمر وتأمين بدائل المتحدثين", budgetOrAttendees: "800-2,500 حضور" });
            },
            className: `p-5 rounded-2xl border text-start transition relative overflow-hidden group ${category === "EVENT" ? "bg-surface border-lime shadow-[0_0_25px_rgba(163,230,53,0.2)]" : "bg-canvas border-white/10 hover:border-lime/40"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: "text-[24px] mb-2", children: "🎪" }),
              /* @__PURE__ */ jsx("div", { className: "font-bold text-[15px] text-pistachio", children: "مؤتمر أو إيفينت كبير" }),
              /* @__PURE__ */ jsx("div", { className: "text-[12px] text-pistachio/60 font-sub mt-1", children: "تركيز على اللوجستيات الحرجة، قائمة المتحدثين، واستوديو الرعاة السريع." }),
              category === "EVENT" && /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 text-lime font-mono text-[12px] font-bold", children: "✓ نشط" })
            ]
          }
        )
      ] })
    ] }),
    step === 2 && /* @__PURE__ */ jsxs("div", { className: "space-y-5 font-sub", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display font-bold text-[22px] text-pistachio", children: "هوية الفريق وبيانات التواصل" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-pistachio/70 mt-1", children: "أدخل الاسم الرسمي وارفع أي ملفات حالية (شيتات لجان، ملف تعريفي، أو باقة رعاة سابقة) لتحليلها فورياً." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[12.5px] font-bold text-pistachio block mb-1.5", children: "اسم المنظمة أو الفريق:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: orgName,
              onChange: (e) => setOrgName(e.target.value),
              placeholder: "e.g. Enactus Cairo / AUC V-Lab",
              className: "w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime transition"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[12.5px] font-bold text-pistachio block mb-1.5", children: "اسم الشخص المسؤول (Ops Lead):" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: contactName,
              onChange: (e) => setContactName(e.target.value),
              placeholder: "e.g. سارة المنشاوي",
              className: "w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime transition"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[12.5px] font-bold text-pistachio block mb-1.5", children: "رقم واتساب المباشر لبوابة الطوارئ:" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            placeholder: "+20 100 000 0000",
            dir: "ltr",
            className: "w-full h-11 rounded-xl px-3.5 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime transition"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "text-[12.5px] font-bold text-pistachio block mb-1.5", children: "مستندات العمل (سحب وإفلات — حتى 25MB):" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            onDragOver: (e) => e.preventDefault(),
            onDrop: handleDrop,
            className: "rounded-2xl p-7 text-center border-2 border-dashed border-lime/30 bg-canvas hover:border-lime transition cursor-pointer",
            onClick: () => {
              const sampleName = category === "STARTUP" ? "PitchDeck_v3.pdf" : category === "VOLUNTEER_TEAM" ? "Committees_RACI_2026.xlsx" : "Event_Sponsor_Pack.pdf";
              setFiles((prev) => [...prev, { name: sampleName, size: "2.4 MB" }]);
            },
            children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-lime/15 text-lime mx-auto flex items-center justify-center text-[18px] mb-2 font-mono", children: "📁" }),
              /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold text-pistachio", children: "اسحب وأفلت الملفات هنا، أو انقر للاختيار من جهازك" }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-mono text-pistachio/50 mt-1", children: "يدعم PDF / XLSX / DOCX / CSV — تشفير AES-256 محلي" }),
              files.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 flex flex-wrap gap-2 justify-center", children: files.map((f, i) => /* @__PURE__ */ jsxs("span", { className: "px-3 py-1 rounded-lg bg-surface border border-lime/40 text-[11.5px] font-mono text-lime flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "✓ ",
                  f.name
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-pistachio/40", children: [
                  "(",
                  f.size,
                  ")"
                ] })
              ] }, i)) })
            ]
          }
        )
      ] })
    ] }),
    step === 3 && /* @__PURE__ */ jsxs("div", { className: "space-y-5 font-sub", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-lime font-mono text-[11px] mb-1", children: [
          /* @__PURE__ */ jsx("span", { children: "● SMART BRANCHING ACTIVATED" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "— ",
            category
          ] })
        ] }),
        /* @__PURE__ */ jsx("h3", { className: "font-display font-bold text-[22px] text-pistachio", children: "تشخيص المعضلة التشغيلية المتخصصة" }),
        /* @__PURE__ */ jsxs("p", { className: "text-[13.5px] text-pistachio/70 mt-1", children: [
          "الأسئلة تتشعب ديناميكياً لتشخيص الفجوات الحرجة في هيكل ",
          category === "STARTUP" ? "الشركة الناشئة" : category === "VOLUNTEER_TEAM" ? "التيم الطلابي" : "المؤتمر",
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[12.5px] font-bold text-pistachio block mb-1.5", children: category === "STARTUP" ? "حجم الفريق وحالة التوظيف:" : category === "VOLUNTEER_TEAM" ? "عدد الأعضاء في اللجان:" : "عدد الحضور المتوقع:" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: branchData.budgetOrAttendees,
              onChange: (e) => setBranchData({ ...branchData, budgetOrAttendees: e.target.value }),
              className: "w-full h-11 rounded-xl px-3 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime",
              children: category === "STARTUP" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("option", { children: "5 - 15 فرداً (Bootstrapped / Pre-Seed)" }),
                /* @__PURE__ */ jsx("option", { children: "15 - 40 فرداً (Seed Stage — سريع النمو)" }),
                /* @__PURE__ */ jsx("option", { children: "40+ فرداً (Series A+)" })
              ] }) : category === "VOLUNTEER_TEAM" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("option", { children: "20 - 45 عضواً (لجان مركزية)" }),
                /* @__PURE__ */ jsx("option", { children: "45 - 90 عضواً (توسع على مستوى الجامعة)" }),
                /* @__PURE__ */ jsx("option", { children: "100+ عضو (فروع متعددة بالمحافظات)" })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("option", { children: "200 - 600 حضور (مؤتمر متوسط)" }),
                /* @__PURE__ */ jsx("option", { children: "600 - 1500 حضور (مؤتمر كبير)" }),
                /* @__PURE__ */ jsx("option", { children: "1500+ حضور (قمة كبرى)" })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[12.5px] font-bold text-pistachio block mb-1.5", children: "أخطر نقطة اختناق تواجهها الآن:" }),
          /* @__PURE__ */ jsx(
            "select",
            {
              value: branchData.primaryFriction,
              onChange: (e) => setBranchData({ ...branchData, primaryFriction: e.target.value }),
              className: "w-full h-11 rounded-xl px-3 bg-canvas border border-white/15 text-pistachio text-[13.5px] outline-none focus:border-lime",
              children: category === "STARTUP" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("option", { value: "churn", children: "فوضى في توصيف الوظائف وتداخل الصلاحيات (No RACI)" }),
                /* @__PURE__ */ jsx("option", { value: "delivery", children: "تأخر الـ Sprint وعدم التزام المطورين بالمواعيد" }),
                /* @__PURE__ */ jsx("option", { value: "pr", children: "ضعف الظهور الإعلامي في الصحف المتخصصة بالتمويل" })
              ] }) : category === "VOLUNTEER_TEAM" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("option", { value: "churn", children: "نزف الأعضاء بعد أول شهر (High Churn Rate - 45%)" }),
                /* @__PURE__ */ jsx("option", { value: "sponsor", children: "صعوبة التواصل مع شركات رعاية بمقابل حقيقي" }),
                /* @__PURE__ */ jsx("option", { value: "hierarchy", children: "فوضى اللجان وغياب قائد متابعة واضح للـ Onboarding" })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx("option", { value: "sponsor", children: "تأخر إغلاق باقات الرعاة الكبرى (Gold/Silver Tiers)" }),
                /* @__PURE__ */ jsx("option", { value: "speaker", children: "مخاطر اعتذار متحدثين رئيسيين في اللحظة الأخيرة" }),
                /* @__PURE__ */ jsx("option", { value: "delivery", children: "تشتت فريق التنظيم في الـ Logistics يوم الحدث" })
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-canvas border border-lime/20 text-[12.5px] font-sub leading-relaxed", children: [
        /* @__PURE__ */ jsx("span", { className: "text-lime font-bold block mb-1", children: "💡 التوجيه الهندسي المقترح لتيم 999x:" }),
        category === "STARTUP" && "سيقوم محرك OpenRouter بتوليد هيكل RACI شجري مع بطاقات مهام OKRs وحزمة PR للإطلاق الإعلامي.",
        category === "VOLUNTEER_TEAM" && "سيتم بناء بروتوكول Onboarding من 3 محطات + تقسيم اللجان لخلايا ثلاثية لتخفيض التسرب فورياً.",
        category === "EVENT" && "سيتم توليد مصفوفة استوديو الرعاة متضمنة 3 قطاعات متطابقة (Fintech/EdTech/FMCG) مع مسودات بريد باردة."
      ] })
    ] }),
    step === 4 && /* @__PURE__ */ jsx("div", { className: "space-y-6", children: !generationDone ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-2xl bg-lime/15 border-2 border-lime text-lime mx-auto flex items-center justify-center text-[26px] font-mono animate-bounce", children: "⚡" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-display font-bold text-[22px] text-pistachio", children: isGenerating ? "جارٍ التشخيص وتوليد خطة العمل..." : "جاهز لإطلاق محرك التشخيص اللحظي" }),
        /* @__PURE__ */ jsx("p", { className: "text-[13.5px] text-pistachio/70 font-sub max-w-[480px] mx-auto mt-1", children: isGenerating ? "فحص دلالي عبر OpenRouter (Minimax M3) • مطابقة RACI • حساب مؤشر الصحة" : `اكتملت بيانات ${orgName || "منظمتك"}. اضغط الزر بالأسفل لتوليد التقرير التنفيذي في 90 ثانية.` })
      ] }),
      !isGenerating && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleStartGeneration,
          className: "btn-lime px-8 h-12 text-[14px] font-bold inline-flex items-center gap-2.5 mx-auto",
          children: [
            /* @__PURE__ */ jsx("span", { children: "⚡ إطلاق التوليد بالذكاء الاصطناعي" }),
            /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", children: [
              /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
              /* @__PURE__ */ jsx("path", { d: "M12 5l7 7-7 7" })
            ] })
          ]
        }
      ),
      isGenerating && /* @__PURE__ */ jsxs("div", { className: "max-w-[320px] mx-auto space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-white/10 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-lime rounded-full animate-pulse", style: { width: "85%" } }) }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-mono text-lime", children: "Streaming tokens at 48 tok/s..." })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-5 font-sub animate-fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "w-8 h-8 rounded-full bg-emerald-400 text-canvas flex items-center justify-center font-bold text-[14px]", children: "✓" }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-bold text-pistachio text-[14px]", children: "تم توليد خطة العمل التشغيلية بنجاح!" }),
            /* @__PURE__ */ jsxs("div", { className: "text-[11.5px] font-mono text-emerald-300", children: [
              "Hash: SHA256-999X-INIT-",
              Math.floor(Math.random() * 9e3 + 1e3)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "font-mono font-black text-lime text-[22px]", children: "88/100" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl bg-canvas border border-lime/20 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-white/[0.08] pb-2.5 text-[12px] font-mono", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lime font-bold", children: "999x EXECUTIVE BRIEF v1.0" }),
          /* @__PURE__ */ jsxs("span", { className: "text-pistachio/50", children: [
            orgName || "Enactus Cairo",
            " • ",
            category
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-[13px] leading-relaxed text-pistachio/85", children: [
          /* @__PURE__ */ jsx("strong", { children: "التشخيص الأولي:" }),
          " تم رصد فجوة هيكلية في توزيع المسؤوليات تُسبب نزف الأعضاء بنسبة تقديرية 38%. تم إنشاء مصفوفة RACI من 3 مستويات مع اعتماد خلايا تشغيلية ثلاثية وتحديد حزمة رعاة أولية بقيمة 55,000 ج.م."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2.5 text-center text-[11px] font-mono pt-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-2 rounded-xl bg-surface border border-white/10", children: [
            /* @__PURE__ */ jsx("div", { className: "text-pistachio/50", children: "HR STABILITY" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-lime text-[14px] mt-0.5", children: "78%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-2 rounded-xl bg-surface border border-white/10", children: [
            /* @__PURE__ */ jsx("div", { className: "text-pistachio/50", children: "CHURN RISK" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-amber-300 text-[14px] mt-0.5", children: "14%" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-2 rounded-xl bg-surface border border-white/10", children: [
            /* @__PURE__ */ jsx("div", { className: "text-pistachio/50", children: "SPONSORS" }),
            /* @__PURE__ */ jsx("div", { className: "font-bold text-violet-300 text-[14px] mt-0.5", children: "85%" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-2 flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/client/dashboard",
            className: "flex-1 h-12 btn-lime text-[13.5px] font-bold flex items-center justify-center gap-2",
            children: [
              /* @__PURE__ */ jsx("span", { children: "🚀 الدخول للوحة تحكم العميل الحية" }),
              /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", children: [
                /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
                /* @__PURE__ */ jsx("path", { d: "M12 5l7 7-7 7" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/client/roadmap",
            className: "px-5 h-12 rounded-xl bg-surface border border-white/15 hover:border-lime/40 text-pistachio font-bold text-[13px] flex items-center justify-center transition",
            children: "عرض خريطة الطريق"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-white/[0.08] pt-6 mt-8", children: [
      step > 1 && !generationDone ? /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setStep((s) => s - 1),
          className: "px-5 h-11 rounded-xl bg-canvas hover:bg-surface border border-white/15 text-pistachio text-[13px] font-bold transition",
          children: "← السابق"
        }
      ) : /* @__PURE__ */ jsx("div", {}),
      step < 4 && /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("[999x] wizard next", step, "->", step + 1);
            setStep((s) => Math.min(s + 1, 4));
          },
          className: "mr-auto btn-lime px-7 h-11 text-[13.5px] font-bold flex items-center gap-2 cursor-pointer relative z-10",
          children: [
            /* @__PURE__ */ jsx("span", { children: "التالي" }),
            /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.2", children: [
              /* @__PURE__ */ jsx("path", { d: "M5 12h14" }),
              /* @__PURE__ */ jsx("path", { d: "M12 5l7 7-7 7" })
            ] })
          ]
        }
      )
    ] })
  ] });
}

const $$Onboarding = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Onboarding \u2014 999x Intake Wizard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-[900px] mx-auto px-5 sm:px-8 py-10"> <div class="mb-6"> <a href="/" class="text-[12px] font-mono text-white/40 hover:text-lime">← العودة للاندينج</a> <h1 class="font-display font-black text-[28px] sm:text-[36px] text-pistachio mt-2">معالج التقديم الذكي المتشعب</h1> <p class="text-[13.5px] text-white/60 mt-1">Adaptive Dynamic Intake Wizard — cockpit layout مع شريط تقدم ليموني وتشعب حسب الفئة.</p> </div> ${renderComponent($$result2, "IntakeWizard", IntakeWizard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Elmodather/Downloads/999x/apps/web/src/components/wizard/IntakeWizard.tsx", "client:component-export": "default" })} <div class="mt-6 rounded-2xl p-4 bg-canvas border border-white/10 text-[11px] font-mono text-white/40">
Smart Branching: Startup → توظيف و PR للتمويل | Volunteer → شغف وهيكل لامركزي | Event → لوجستيات ومتحدثين
</div> </div> ` })}`;
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/onboarding.astro", void 0);

const $$file = "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/onboarding.astro";
const $$url = "/onboarding";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Onboarding,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
