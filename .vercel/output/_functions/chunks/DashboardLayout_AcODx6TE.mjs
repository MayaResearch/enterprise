import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as renderSlot } from './astro/server_BiwHnAGj.mjs';
import { $ as $$Layout } from './Layout_CRIEi6OJ.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  const topNavItems = [
    {
      id: "home",
      label: "Home",
      href: "/dashboard",
      icon: /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: 16,
          height: 16,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "lucide lucide-home",
          children: [
            /* @__PURE__ */ jsx("path", { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
            /* @__PURE__ */ jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
          ]
        }
      )
    }
  ];
  const playgroundNavItems = [
    {
      id: "text-to-speech",
      label: "Text to Speech",
      href: "/dashboard/text-to-speech",
      icon: /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: 16,
          height: 16,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "lucide lucide-volume-2",
          children: [
            /* @__PURE__ */ jsx("polygon", { points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
            /* @__PURE__ */ jsx("path", { d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
            /* @__PURE__ */ jsx("path", { d: "M19.07 4.93a10 10 0 0 1 0 14.14" })
          ]
        }
      )
    }
  ];
  const managementNavItems = [
    {
      id: "usage",
      label: "Usage",
      href: "/dashboard/usage",
      icon: /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: 16,
          height: 16,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "lucide lucide-bar-chart3",
          children: [
            /* @__PURE__ */ jsx("path", { d: "M3 3v18h18" }),
            /* @__PURE__ */ jsx("path", { d: "M18 17V9" }),
            /* @__PURE__ */ jsx("path", { d: "M13 17V5" }),
            /* @__PURE__ */ jsx("path", { d: "M8 17v-3" })
          ]
        }
      )
    },
    {
      id: "api-keys",
      label: "API Keys",
      href: "/dashboard/api-keys",
      icon: /* @__PURE__ */ jsxs(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          width: 16,
          height: 16,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          className: "lucide lucide-key",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "7.5", cy: "15.5", r: "5.5" }),
            /* @__PURE__ */ jsx("path", { d: "m21 2-9.6 9.6" }),
            /* @__PURE__ */ jsx("path", { d: "m15.5 7.5 3 3L22 7l-3-3" })
          ]
        }
      )
    }
  ];
  const renderNavItem = (item, isLast = false) => {
    const isActive = currentPath === item.href;
    return /* @__PURE__ */ jsx(
      "a",
      {
        href: item.href,
        title: item.label,
        className: `
          flex flex-row items-center gap-1.5 h-8 rounded-lg px-2 
          hover:bg-neutral-200/70 dark:hover:bg-neutral-700 
          text-sm select-none transition-all duration-150
          dark:text-white
          ${isLast ? "" : "mb-1"}
          ${isActive ? 'bg-neutral-200/70 dark:bg-neutral-700 [font-variation-settings:"wght"_370] [font-weight:370]' : '[font-variation-settings:"wght"_370] [font-weight:370]'}
        `,
        children: /* @__PURE__ */ jsxs("div", { className: "flex grow items-center justify-start gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { className: "flex items-center flex-shrink-0", children: item.icon }),
          /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label })
        ] })
      },
      item.id
    );
  };
  return /* @__PURE__ */ jsx("div", { className: "w-54 h-full pb-3 overflow-hidden border-r border-gray-200 px-4", style: { backgroundColor: "#fdfdfd" }, children: /* @__PURE__ */ jsx("div", { className: "flex flex-col h-full", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col h-16 justify-center", children: /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold text-gray-900", children: "Maya Research" }) }),
    /* @__PURE__ */ jsx("div", { className: "mb-[22px]", children: topNavItems.map(
      (item) => renderNavItem(item, true)
    ) }),
    /* @__PURE__ */ jsx("p", { className: "not-italic mb-1 font-medium text-[rgb(141,156,167)] transition-opacity duration-300 ease-in-out opacity-100 pointer-events-auto whitespace-nowrap antialiased text-sm", children: "Playground" }),
    /* @__PURE__ */ jsx("div", { className: "mb-[22px]", children: playgroundNavItems.map(
      (item, index) => renderNavItem(item, index === playgroundNavItems.length - 1)
    ) }),
    /* @__PURE__ */ jsx("p", { className: "not-italic mb-1 font-medium text-[rgb(141,156,167)] transition-opacity duration-300 ease-in-out opacity-100 pointer-events-auto whitespace-nowrap antialiased text-sm", children: "Management" }),
    managementNavItems.map(
      (item, index) => renderNavItem(item, index === managementNavItems.length - 1)
    )
  ] }) }) });
};

const $$Astro = createAstro();
const $$DashboardLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DashboardLayout;
  const { title = "Dashboard - Maya Research" } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex h-screen overflow-hidden bg-white"> ${renderComponent($$result2, "Sidebar", Sidebar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/components/Sidebar", "client:component-export": "default" })} <div class="flex flex-1 flex-col overflow-hidden"> ${renderSlot($$result2, $$slots["default"])} </div> </div> ` })}`;
}, "/Users/thippareddysaicharanreddy/Desktop/enterprise_maya/src/layouts/DashboardLayout.astro", void 0);

export { $$DashboardLayout as $ };
