// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  integrations: [svelte()],
  // Fully static build for Hostinger shared hosting
  output: "static",
  // If you know your final domain, add it (improves canonical URLs)
  site: "https://graphicsbystorm.com",
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $pages: fileURLToPath(new URL("./src/pages", import.meta.url)),
        $components: fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
        $compSec: fileURLToPath(
          new URL("./src/components/sections", import.meta.url)
        ),
        $layouts: fileURLToPath(new URL("./src/layouts", import.meta.url)),
        $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
        $svelte: fileURLToPath(new URL("./src/svelte", import.meta.url)),
        $svelteSec: fileURLToPath(
          new URL("./src/svelte/sections", import.meta.url)
        ),
        $styles: fileURLToPath(new URL("./src/styles", import.meta.url)),
        $assets: fileURLToPath(new URL("./src/assets", import.meta.url)),
      },
    },
  },
});
