import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BiwHnAGj.mjs';
import { $ as $$DashboardLayout } from '../../chunks/DashboardLayout_AcODx6TE.mjs';
export { renderers } from '../../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Usage - Maya Research" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex flex-1 flex-col overflow-hidden"> <!-- Main Content --> <main class="flex-1 overflow-auto p-8"> <div class="max-w-7xl mx-auto"> <p class="text-gray-600">Usage statistics and analytics will be displayed here.</p> </div> </main> </div> ` })}`;
}, "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/usage/index.astro", void 0);

const $$file = "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/usage/index.astro";
const $$url = "/dashboard/usage";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
