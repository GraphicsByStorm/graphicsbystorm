# GraphicsByStorm — Portfolio (Astro + Svelte 5 + Tailwind)

A fast, static portfolio built with **Astro**, **Svelte 5 (runes)**, and **Tailwind CSS**.  
It features a unified **Work** grid, image **Lightbox** with scroll-lock, dynamic **case studies** with rubric sections, and creative **social links** using Iconify.

> Repo: https://github.com/GraphicsByStorm/graphicsbystorm

---

## ✨ Highlights

- **Static by default** (`prerender = true`) for speed & SEO.
- **Svelte 5 (runes)** islands only where needed (e.g., `WorkSection.svelte`, `Lightbox.svelte`).
- **Consistent Lightbox**: wheel/touch to navigate, page scroll locked, returns focus & scroll to prior position on close.
- **Case Studies**: Overview, Highlights, rubric sections (tools/design/creativity/critique/directions/craftsmanship), sticky TOC & info sidebar, prev/next navigation.
- **Creative social links**: desktop rail + mobile bar with Iconify icons.
- **Zero-SSR pattern**: prefer `.astro` & `.ts`, hydrate Svelte sparingly with `client:visible`.

---

## 🧱 Tech Stack

- **Astro** (content routing & prerender)
- **Svelte 5 (runes)** for interactive islands
- **Tailwind CSS** for styling
- **Iconify** (`@iconify/svelte` + JSON icon packs)
- **TypeScript** everywhere

---

## 📦 Getting Started

> Requires **Node 18+** (Node 20+ recommended) and a package manager (npm/pnpm/bun).

```bash
# clone
git clone https://github.com/GraphicsByStorm/graphicsbystorm
cd graphicsbystorm

# install
npm install
# pnpm install
# bun install

# dev
npm run dev

# type-check (optional)
npm run check

# build static site
npm run build

# preview production build
npm run preview
