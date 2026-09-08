import { h as decodeKey } from './chunks/astro/server_DCRK0Qyq.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DpE-Hdq_.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Elmodather/Downloads/999x/apps/web/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"../../node_modules/.bun/astro@4.16.19+918ec35fa125a154/node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BisUlvav.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/admin/ai-studio","isIndex":false,"type":"page","pattern":"^\\/admin\\/ai-studio\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"ai-studio","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/ai-studio.astro","pathname":"/admin/ai-studio","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BisUlvav.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/admin/cockpit","isIndex":false,"type":"page","pattern":"^\\/admin\\/cockpit\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"cockpit","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/cockpit.astro","pathname":"/admin/cockpit","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BvEUGHBp.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/admin/crm","isIndex":false,"type":"page","pattern":"^\\/admin\\/crm\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}],[{"content":"crm","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin/crm.astro","pathname":"/admin/crm","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BisUlvav.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/client/dashboard","isIndex":false,"type":"page","pattern":"^\\/client\\/dashboard\\/?$","segments":[[{"content":"client","dynamic":false,"spread":false}],[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/client/dashboard.astro","pathname":"/client/dashboard","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.D_Pkpo6K.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/client/roadmap","isIndex":false,"type":"page","pattern":"^\\/client\\/roadmap\\/?$","segments":[[{"content":"client","dynamic":false,"spread":false}],[{"content":"roadmap","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/client/roadmap.astro","pathname":"/client/roadmap","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.BisUlvav.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/client/tickets","isIndex":false,"type":"page","pattern":"^\\/client\\/tickets\\/?$","segments":[[{"content":"client","dynamic":false,"spread":false}],[{"content":"tickets","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/client/tickets.astro","pathname":"/client/tickets","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CPq6XeSZ.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/onboarding","isIndex":false,"type":"page","pattern":"^\\/onboarding\\/?$","segments":[[{"content":"onboarding","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/onboarding.astro","pathname":"/onboarding","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/hoisted.CPq6XeSZ.js"}],"styles":[{"type":"external","src":"/_astro/ai-studio.GGl-hlMg.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/ai-studio.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/cockpit.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/admin/crm.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/dashboard.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/roadmap.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/client/tickets.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Elmodather/Downloads/999x/apps/web/src/pages/onboarding.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:../../node_modules/.bun/astro@4.16.19+918ec35fa125a154/node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/admin/ai-studio@_@astro":"pages/admin/ai-studio.astro.mjs","\u0000@astro-page:src/pages/admin/cockpit@_@astro":"pages/admin/cockpit.astro.mjs","\u0000@astro-page:src/pages/admin/crm@_@astro":"pages/admin/crm.astro.mjs","\u0000@astro-page:src/pages/client/dashboard@_@astro":"pages/client/dashboard.astro.mjs","\u0000@astro-page:src/pages/client/roadmap@_@astro":"pages/client/roadmap.astro.mjs","\u0000@astro-page:src/pages/client/tickets@_@astro":"pages/client/tickets.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/onboarding@_@astro":"pages/onboarding.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","C:/Users/Elmodather/Downloads/999x/node_modules/.bun/astro@4.16.19+918ec35fa125a154/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","\u0000@astrojs-manifest":"manifest_CFbphduX.mjs","C:/Users/Elmodather/Downloads/999x/apps/web/src/components/admin/PromptStudio.tsx":"_astro/PromptStudio.DoBrNc-_.js","C:/Users/Elmodather/Downloads/999x/apps/web/src/components/wizard/IntakeWizard.tsx":"_astro/IntakeWizard.CFlhAtn2.js","/astro/hoisted.js?q=0":"_astro/hoisted.BvEUGHBp.js","/astro/hoisted.js?q=1":"_astro/hoisted.D_Pkpo6K.js","@astrojs/react/client.js":"_astro/client.DrE9CFQR.js","/astro/hoisted.js?q=2":"_astro/hoisted.BisUlvav.js","/astro/hoisted.js?q=3":"_astro/hoisted.CPq6XeSZ.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/ai-studio.GGl-hlMg.css","/index.html","/logo.svg","/logo_999x.jpg","/logo_999x.svg","/_astro/client.DrE9CFQR.js","/_astro/hoisted.BisUlvav.js","/_astro/hoisted.BvEUGHBp.js","/_astro/hoisted.CPq6XeSZ.js","/_astro/hoisted.D_Pkpo6K.js","/_astro/index.CVf8TyFT.js","/_astro/IntakeWizard.CFlhAtn2.js","/_astro/jsx-runtime.TBa3i5EZ.js","/_astro/PromptStudio.DoBrNc-_.js"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"NSgQ6Qgo0rLn6Yd4JWwEAptwQC1bSvQTULHI7xJk1PI=","experimentalEnvGetSecretEnabled":false});

export { manifest };
