import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import sharp from "sharp";
import config from "./src/config/config.json";

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp() },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: "esbuild",
    },
    server: {
      fs: {
        // Allow serving files from ZFDM root (3 levels up) where node_modules is located
        allow: ["../../.."],
      },
    },
  },
  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube.md",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
        "@/shortcodes/Changelog.astro",
      ],
    }),
    mdx(),
    icon(),
  ],
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
