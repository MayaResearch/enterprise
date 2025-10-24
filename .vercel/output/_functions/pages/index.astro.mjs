import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BiwHnAGj.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "HomeRedirect", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/components/home/HomeRedirect", "client:component-export": "HomeRedirect" })}`;
}, "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/index.astro", void 0);

const $$file = "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
