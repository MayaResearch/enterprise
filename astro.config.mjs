// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable server-side rendering for API routes
  adapter: vercel({
    webAnalytics: {
      enabled: false,
    },
  }),
  
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});