import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CG_-fcoY.mjs';
import { manifest } from './manifest_BV6ROUsi.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/keys/_id_.astro.mjs');
const _page2 = () => import('./pages/api/keys.astro.mjs');
const _page3 = () => import('./pages/dashboard/api-keys.astro.mjs');
const _page4 = () => import('./pages/dashboard/text-to-speech.astro.mjs');
const _page5 = () => import('./pages/dashboard/usage.astro.mjs');
const _page6 = () => import('./pages/dashboard.astro.mjs');
const _page7 = () => import('./pages/login.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/keys/[id].ts", _page1],
    ["src/pages/api/keys/index.ts", _page2],
    ["src/pages/dashboard/api-keys/index.astro", _page3],
    ["src/pages/dashboard/text-to-speech/index.astro", _page4],
    ["src/pages/dashboard/usage/index.astro", _page5],
    ["src/pages/dashboard/index.astro", _page6],
    ["src/pages/login/index.astro", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "b30e0eab-7ac8-4596-a7de-977a819b97ac",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
