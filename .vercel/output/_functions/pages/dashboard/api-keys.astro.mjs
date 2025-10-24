import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BiwHnAGj.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_AcODx6TE.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "API Keys - Maya Research" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-1 flex-col overflow-hidden"> <!-- Main Content --> <main class="flex-1 overflow-auto bg-white"> ${renderComponent($$result2, "DevelopersPage", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/api-keys/_components/DevelopersPage", "client:component-export": "default" })} </main> </div> ` })}`;
}, "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/api-keys/index.astro", void 0);

const $$file = "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/api-keys/index.astro";
const $$url = "/dashboard/api-keys";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
