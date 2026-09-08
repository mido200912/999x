import { c as createComponent, d as renderComponent, r as renderTemplate, F as Fragment, u as unescapeHTML } from '../chunks/astro/server_DCRK0Qyq.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_CQSybyu5.mjs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  let bodyHtml = "";
  let headHtml = "";
  try {
    const publicPath = resolve(process.cwd(), "public/index.html");
    const html = readFileSync(publicPath, "utf-8");
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    if (bodyMatch) bodyHtml = bodyMatch[1];
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
    if (headMatch) {
      headHtml = headMatch[1].replace(/<title[^>]*>[\s\S]*?<\/title>/, "").replace(/<meta name="description"[^>]*>/, "").replace(/<meta charset[^>]*>/, "").replace(/<meta name="viewport"[^>]*>/, "");
    }
  } catch {
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "999x Operations & Client Hub \u2014 \u0645\u0646\u0638\u0648\u0645\u0629 \u0627\u0644\u062A\u0634\u063A\u064A\u0644 \u0648\u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0645\u0624\u0633\u0633\u064A" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`${unescapeHTML(bodyHtml)}` })} `, "head": ($$result2) => renderTemplate`${renderComponent($$result2, "Fragment", Fragment, { "slot": "head" }, { "default": ($$result3) => renderTemplate`${unescapeHTML(headHtml)}` })}` })}`;
}, "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/index.astro", void 0);

const $$file = "C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
