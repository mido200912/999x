import { c as createComponent, r as renderTemplate, e as renderSlot, f as renderHead, g as defineScriptVars, a as addAttribute, b as createAstro } from './astro/server_DCRK0Qyq.mjs';
/* empty css                             */

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const { title = "999x Operations & Client Hub — منظومة التشغيل والذكاء المؤسسي", description = "منصة 999x: تشغيل فائق الذكاء، موارد بشرية منضبطة، ووصول لا نهائي للرعاة." } = Astro2.props;
  return renderTemplate(_a || (_a = __template(['<html lang="ar" dir="rtl" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><meta name="description"', '><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800;900&family=JetBrains+Mono:ital,wght@0,400;0,600;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Readex+Pro:wght@500;600;700;800&family=Syne:wght@700;800&family=Unbounded:wght@400;600;700;800;900&display=swap" rel="stylesheet">', "<script>(function(){", "\n    window.PUBLIC_API_URL = apiUrl;\n  })();</script>", '</head> <body class="relative selection:bg-lime selection:text-canvas"> <div id="scrollProgress" style="position:fixed;top:0;left:0;height:2px;width:0%;z-index:9999;background:linear-gradient(90deg,#A3E635,#8B5CF6);box-shadow:0 0 10px rgba(163,230,53,0.6)"></div> <div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden z-0"> <div class="absolute -top-[250px] -right-[150px] w-[800px] h-[800px] rounded-full opacity-[0.22] blur-[140px]" style="background: radial-gradient(circle, #8B5CF6 0%, transparent 70%)"></div> <div class="absolute top-[35%] -left-[220px] w-[750px] h-[750px] rounded-full opacity-[0.16] blur-[130px]" style="background: radial-gradient(circle, #A3E635 0%, transparent 70%)"></div> <div class="absolute inset-0 cyber-grid-ambient opacity-50" style="background-image: linear-gradient(to right, rgba(243,248,204,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(243,248,204,0.035) 1px, transparent 1px); background-size:56px 56px;"></div> </div> ', "  </body> </html>"])), title, addAttribute(description, "content"), renderSlot($$result, $$slots["head"]), defineScriptVars({ apiUrl: "http://localhost:3001" }), renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
