// @ts-check
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $pages: r('./src/pages'),
        $components: r('./src/components'),
        $compSec: r('./src/components/sections'),
        $layouts: r('./src/layouts'),
        $lib: r('./src/lib'),
        $svelte: r('./src/svelte'),
        $svelteSec: r('./src/svelte/sections'),
        $styles: r('./src/styles'),
        $assets: r('./src/assets')
      }
    }
  }
})