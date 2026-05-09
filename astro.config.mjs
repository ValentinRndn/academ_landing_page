// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://academ.my",
  // No i18n config: routing is handled manually via /pages/index.astro (default
  // locale "en") and /pages/[lang]/index.astro (other locales). The sitemap
  // integration still gets locale info from the URL structure.
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
