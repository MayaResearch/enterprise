import { p as decodeKey } from './chunks/astro/server_BiwHnAGj.mjs';
import 'clsx';
import 'cookie';
import './chunks/astro-designed-error-pages_DwUr6A-2.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_W_BxvxIC.mjs';

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
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
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

const manifest = deserializeManifest({"hrefRoot":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/","cacheDir":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/node_modules/.astro/","outDir":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/dist/","srcDir":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/","publicDir":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/public/","buildClientDir":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/dist/client/","buildServerDir":"file:///Users/thippareddysaicharanreddy/Desktop/enterprise_maya/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/keys/[id]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/keys\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"keys","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"src/pages/api/keys/[id].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/keys","isIndex":true,"type":"endpoint","pattern":"^\\/api\\/keys\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"keys","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/keys/index.ts","pathname":"/api/keys","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DkyNrHlc.css"}],"routeData":{"route":"/dashboard/api-keys","isIndex":true,"type":"page","pattern":"^\\/dashboard\\/api-keys\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"api-keys","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/api-keys/index.astro","pathname":"/dashboard/api-keys","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DkyNrHlc.css"}],"routeData":{"route":"/dashboard/text-to-speech","isIndex":true,"type":"page","pattern":"^\\/dashboard\\/text-to-speech\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"text-to-speech","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/text-to-speech/index.astro","pathname":"/dashboard/text-to-speech","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DkyNrHlc.css"}],"routeData":{"route":"/dashboard/usage","isIndex":true,"type":"page","pattern":"^\\/dashboard\\/usage\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}],[{"content":"usage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/usage/index.astro","pathname":"/dashboard/usage","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DkyNrHlc.css"}],"routeData":{"route":"/dashboard","isIndex":true,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard/index.astro","pathname":"/dashboard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.DkyNrHlc.css"}],"routeData":{"route":"/login","isIndex":true,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login/index.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/api-keys/index.astro",{"propagation":"none","containsHead":true}],["/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/index.astro",{"propagation":"none","containsHead":true}],["/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/text-to-speech/index.astro",{"propagation":"none","containsHead":true}],["/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/usage/index.astro",{"propagation":"none","containsHead":true}],["/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/login/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/keys/[id]@_@ts":"pages/api/keys/_id_.astro.mjs","\u0000@astro-page:src/pages/api/keys/index@_@ts":"pages/api/keys.astro.mjs","\u0000@astro-page:src/pages/dashboard/api-keys/index@_@astro":"pages/dashboard/api-keys.astro.mjs","\u0000@astro-page:src/pages/dashboard/text-to-speech/index@_@astro":"pages/dashboard/text-to-speech.astro.mjs","\u0000@astro-page:src/pages/dashboard/usage/index@_@astro":"pages/dashboard/usage.astro.mjs","\u0000@astro-page:src/pages/dashboard/index@_@astro":"pages/dashboard.astro.mjs","\u0000@astro-page:src/pages/login/index@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_YXJ-Q6ja.mjs","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DfSaW-6Z.mjs","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/text-to-speech/_components/TextToSpeechPage":"_astro/TextToSpeechPage.B3einnVU.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/login/_components/GoogleLoginButton":"_astro/GoogleLoginButton.DdrWO_Yo.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/components/Sidebar":"_astro/Sidebar.CcmlHplm.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/api-keys/_components/DevelopersPage":"_astro/DevelopersPage.Dc8tsQoH.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/_components/Home":"_astro/Home.As-688Bd.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/login/_components/LoginWrapper":"_astro/LoginWrapper.BYbcaAYX.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/components/home/HomeRedirect":"_astro/HomeRedirect.DsFKRksD.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/components/common/AuthProvider":"_astro/AuthProvider.BS3A716s.js","@astrojs/react/client.js":"_astro/client.BHD5PNQe.js","/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.elfUsALL.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/index.DkyNrHlc.css","/favicon.svg","/_astro/AuthProvider.BS3A716s.js","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.elfUsALL.js","/_astro/DevelopersPage.Dc8tsQoH.js","/_astro/GoogleLoginButton.DdrWO_Yo.js","/_astro/Home.As-688Bd.js","/_astro/HomeRedirect.DsFKRksD.js","/_astro/LoginWrapper.BYbcaAYX.js","/_astro/Sidebar.CcmlHplm.js","/_astro/TextToSpeechPage.B3einnVU.js","/_astro/authStore.Dsf0ip_C.js","/_astro/client.BHD5PNQe.js","/_astro/index.DIYlxJI2.js","/_astro/index.i2v55a1N.js","/_astro/jsx-runtime.D_zvdyIk.js","/_astro/skeleton.BXZSd1DG.js","/_astro/tslib.es6.DcwbYiNs.js","/_astro/useAuth.Bk7SB493.js","/assets/images/3dd1f6f589e4ab52ce4bd8191ac1766492530452.svg","/assets/images/65f020a1ddc0deb2dd154611097c1f8f3025c1a9.svg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"S6pxTBz0uxI92nhYXNsfSScbFtG1n21fTyxLjxs4lvk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
