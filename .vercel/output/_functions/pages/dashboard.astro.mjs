import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BiwHnAGj.mjs';
import { $ as $$DashboardLayout } from '../chunks/DashboardLayout_AcODx6TE.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "DashboardLayout", $$DashboardLayout, { "title": "Dashboard - Maya Research" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Home", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/_components/Home", "client:component-export": "default" })} ` })}`;
}, "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/index.astro", void 0);

const $$file = "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/dashboard/index.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
