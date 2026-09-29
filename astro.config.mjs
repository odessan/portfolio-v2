// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.URL ?? "http://localhost:4321",
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
